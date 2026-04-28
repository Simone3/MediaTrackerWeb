import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { AddGroupRequest, AddGroupResponse } from 'app/data/models/api/group';
import { AddMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddMovieRequest } from 'app/data/models/api/media-items/movie';
import { UpdateCategoryRequest, UpdateCategoryResponse } from 'app/data/models/api/category';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestCategory, getTestGroup, getTestMovie, getTestOwnPlatform, initTestUCHelper, TestUC } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extractAsString, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Security-focused integration tests for authentication and ownership isolation
 */
describe('Security API Tests', () => {
	setupTestDatabaseConnection();
	setupTestServer();

	describe('Security API Tests', () => {
		const firstUC: TestUC = { user: '', category: '' };
		const secondUC: TestUC = { user: '', category: '' };

		// Create new users/categories for each test
		beforeEach(async() => {
			await initTestUCHelper('MOVIE', firstUC, 'First');
			await initTestUCHelper('MOVIE', secondUC, 'Second');
		});

		it('Should allow only GET status without authentication', async() => {
			const statusResponse = await callHelper<undefined, { status: string }>('GET', '/status', firstUC.user, undefined, {
				customAuthorizationHeader: ''
			});
			expect(statusResponse.status, 'Status API did not return the expected response').to.equal('Running');

			await callHelper<undefined, { error: string }>('POST', '/status', firstUC.user, undefined, {
				customAuthorizationHeader: '',
				expectedStatus: 401
			});
		});

		it('Should require authentication for catalog routes', async() => {
			await callHelper<undefined, { error: string }>('GET', '/catalog/movies/search/anything', firstUC.user, undefined, {
				customAuthorizationHeader: '',
				expectedStatus: 401
			});

			await callHelper<undefined, { error: string }>('GET', '/catalog/movies/123', firstUC.user, undefined, {
				customAuthorizationHeader: '',
				expectedStatus: 401
			});
		});

		it('Should not update a different user category even when the path user matches the token user', async() => {
			const secondCategoryBefore = await categoryController.getCategory(secondUC.user, secondUC.category);
			expect(secondCategoryBefore, 'Test setup did not create the second user category').not.to.be.undefined;

			await callHelper<UpdateCategoryRequest, UpdateCategoryResponse>('PUT', `/users/${firstUC.user}/categories/${secondUC.category}`, firstUC.user, {
				category: {
					name: randomName('Hijack'),
					mediaType: 'MOVIE',
					color: '#ff0000'
				}
			}, {
				expectedStatus: 500
			});

			const secondCategoryAfter = await categoryController.getCategory(secondUC.user, secondUC.category);
			expect(secondCategoryAfter, 'Second user category was removed').not.to.be.undefined;
			expect(secondCategoryAfter?.name, 'Second user category was changed').to.equal(secondCategoryBefore?.name);
			expect(secondCategoryAfter?.color, 'Second user category was changed').to.equal(secondCategoryBefore?.color);
		});

		it('Should not create child resources inside a different user category', async() => {
			await callHelper<AddGroupRequest, AddGroupResponse>('POST', `/users/${firstUC.user}/categories/${secondUC.category}/groups`, firstUC.user, {
				newGroup: {
					name: randomName('ForeignCategoryGroup')
				}
			}, {
				expectedStatus: 500
			});

			const secondUserGroups = await groupController.getAllGroups(secondUC.user, secondUC.category);
			expect(secondUserGroups, 'API created a group in another user category').to.have.lengthOf(0);
		});

		it('Should not create media items linked to another user group or own platform', async() => {
			const secondGroup = await groupController.saveGroup(getTestGroup(undefined, secondUC));
			const secondOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, secondUC));

			await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/movies`, firstUC.user, {
				newMovie: {
					name: randomName('ForeignRelationMovie'),
					importance: '100',
					group: {
						groupId: String(secondGroup._id),
						orderInGroup: 1
					},
					ownPlatform: {
						ownPlatformId: String(secondOwnPlatform._id)
					}
				}
			}, {
				expectedStatus: 500
			});

			const firstUserMovies = await movieEntityController.getAllMediaItems(firstUC.user, firstUC.category);
			expect(firstUserMovies, 'API created a movie with another user relations').to.have.lengthOf(0);
		});

		it('Should treat exact-name filters as literal text', async() => {
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstUC, '.*'));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstUC, 'Alpha'));
			await groupController.saveGroup(getTestGroup(undefined, firstUC, '.*'));
			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Alpha'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, '.*'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Alpha'));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUC, { name: '.*' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUC, { name: 'Alpha' }));

			const categories = await categoryController.filterCategories(firstUC.user, { name: '.*' });
			const groups = await groupController.filterGroups(firstUC.user, firstUC.category, { name: '.*' });
			const ownPlatforms = await ownPlatformController.filterOwnPlatforms(firstUC.user, firstUC.category, { name: '.*' });
			const movies = await movieEntityController.filterAndOrderMediaItems(firstUC.user, firstUC.category, { name: '.*' });

			expect(extractAsString(categories, 'name'), 'Category filter treated input as a regex').to.eql([ '.*' ]);
			expect(extractAsString(groups, 'name'), 'Group filter treated input as a regex').to.eql([ '.*' ]);
			expect(extractAsString(ownPlatforms, 'name'), 'Own platform filter treated input as a regex').to.eql([ '.*' ]);
			expect(extractAsString(movies, 'name'), 'Media item filter treated input as a regex').to.eql([ '.*' ]);
		});

		it('Should not cascade-delete records owned by another user', async() => {
			const foreignGroup = await groupController.saveGroup(getTestGroup(undefined, {
				user: secondUC.user,
				category: firstUC.category
			}), true);
			const foreignOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, {
				user: secondUC.user,
				category: firstUC.category
			}), true);
			const foreignMovie = await movieEntityController.saveMediaItem(getTestMovie(undefined, {
				user: secondUC.user,
				category: firstUC.category
			}), true);

			await categoryController.deleteCategory(firstUC.user, firstUC.category);

			const foundForeignGroup = await groupController.getGroup(secondUC.user, firstUC.category, String(foreignGroup._id));
			const foundForeignOwnPlatform = await ownPlatformController.getOwnPlatform(secondUC.user, firstUC.category, String(foreignOwnPlatform._id));
			const foundForeignMovie = await movieEntityController.getMediaItem(secondUC.user, firstUC.category, String(foreignMovie._id));

			expect(foundForeignGroup, 'Category cascade deleted another user group').not.to.be.undefined;
			expect(foundForeignOwnPlatform, 'Category cascade deleted another user own platform').not.to.be.undefined;
			expect(foundForeignMovie, 'Category cascade deleted another user movie').not.to.be.undefined;
		});
	});
});
