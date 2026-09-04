import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { AddGroupRequest, AddGroupResponse, IdentifiedGroup } from 'app/data/models/api/group';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddMovieRequest, CatalogMovie, FilterMoviesRequest, FilterMoviesResponse, GetAllMoviesResponse, GetMovieFromCatalogResponse, IdentifiedMovie, SearchMovieCatalogResponse, SearchMoviesRequest, SearchMoviesResponse, UpdateMovieRequest } from 'app/data/models/api/media-items/movie';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, IdentifiedOwnPlatform } from 'app/data/models/api/own-platform';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestMovie, getTestMovieInGroup, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';
import { setupMovieExternalServicesMocks } from 'mocks/external-services-mocks';

const expect = chai.expect;

/**
 * Tests for the movie API
 */
describe('Movie API Tests', () => {
	setupTestDatabaseConnection();
	setupTestServer();
	setupMovieExternalServicesMocks();

	describe('Movie API Tests', () => {
		const firstUCG: TestUCG = { user: '', category: '' };
		const secondUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {
			await initTestUCGHelper('MOVIE', firstUCG, 'First');
			await initTestUCGHelper('MOVIE', secondUCG, 'Second');
		});

		it('Should create a new movie', async() => {
			const name = randomName();
			const response = await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					name: name,
					importance: '100'
				}
			});
			
			const movieId: string = response.uid;
			expect(movieId, 'API did not return a UID').not.to.be.undefined;
			
			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(foundMovie.name, 'GetMovie returned the wrong name').to.equal(name);
		});

		it('Should update an existing movie', async() => {
			const movie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const movieId = String(movie._id);
			const newName = randomName('Changed');

			await callHelper<UpdateMovieRequest, UpdateMediaItemResponse>('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/${movieId}`, firstUCG.user, {
				movie: {
					name: newName,
					importance: '100'
				}
			});
			
			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(foundMovie.name, 'GetMovie returned the wrong name').to.equal(newName);
		});

		it('Should filter and sort movies', async() => {
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Rrr', importance: '100' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: '200' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Zzz', importance: '200' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ttt', importance: '100' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Aaa', importance: '200' }));
			
			const response = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				filter: {
					importanceLevels: [ '200' ]
				},
				sortBy: [{
					field: 'NAME',
					ascending: false
				}]
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(3);
			expect(extract(response.movies, 'name'), 'API did not return the correct movies').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should return every movie and no pagination details if the request does not paginate', async() => {
			for(const name of [ 'Aaa', 'Bbb', 'Ccc' ]) {
				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: name, importance: '100' }));
			}

			const response = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				sortBy: [{
					field: 'NAME',
					ascending: true
				}]
			});
			expect(response.movies, 'API did not return every movie').to.have.lengthOf(3);
			expect(response.pagination, 'API returned pagination details for an unpaginated request').to.be.undefined;
		});

		it('Should paginate the filtered movies', async() => {
			for(const name of [ 'Aaa', 'Bbb', 'Ccc', 'Ddd', 'Eee' ]) {
				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: name, importance: '100' }));
			}

			const sortBy: FilterMoviesRequest['sortBy'] = [{
				field: 'NAME',
				ascending: true
			}];

			const firstPage = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				sortBy: sortBy,
				pagination: {
					offset: 0,
					limit: 2
				}
			});
			expect(extract(firstPage.movies, 'name'), 'API did not return the first page').to.be.eql([ 'Aaa', 'Bbb' ]);
			expect(firstPage.pagination, 'API did not return the pagination details').not.to.be.undefined;
			expect(firstPage.pagination?.totalCount, 'API did not return the total count').to.equal(5);

			const lastPage = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				sortBy: sortBy,
				pagination: {
					offset: 4,
					limit: 2
				}
			});
			expect(extract(lastPage.movies, 'name'), 'API did not return the last page').to.be.eql([ 'Eee' ]);
			expect(lastPage.pagination?.totalCount, 'API did not return the total count').to.equal(5);
		});

		it('Should count only the movies matching the filter when paginating', async() => {
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Aaa', importance: '200' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: '100' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ccc', importance: '200' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, { name: 'Ddd', importance: '200' }));

			const response = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				filter: {
					importanceLevels: [ '200' ]
				},
				pagination: {
					offset: 0,
					limit: 1
				}
			});
			expect(response.movies, 'API did not return a single movie').to.have.lengthOf(1);
			expect(response.pagination?.totalCount, 'API counted movies outside of the filter').to.equal(2);
		});

		it('Should return an empty page but the correct total count for an offset past the end', async() => {
			for(const name of [ 'Aaa', 'Bbb' ]) {
				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: name, importance: '100' }));
			}

			const response = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				pagination: {
					offset: 50,
					limit: 10
				}
			});
			expect(response.movies, 'API did not return an empty page').to.have.lengthOf(0);
			expect(response.pagination?.totalCount, 'API did not return the total count').to.equal(2);
		});

		it('Should not repeat or skip a movie across pages when the sort field has ties', async() => {
			const names = [ 'Aaa', 'Bbb', 'Ccc', 'Ddd', 'Eee', 'Fff' ];
			for(const name of names) {
				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: name, importance: '100' }));
			}

			// Every movie has the same importance, so only the ID tiebreaker keeps the pages disjoint
			const paginatedNames: string[] = [];
			for(let offset = 0; offset < names.length; offset += 2) {
				const page = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
					sortBy: [{
						field: 'IMPORTANCE',
						ascending: true
					}],
					pagination: {
						offset: offset,
						limit: 2
					}
				});
				paginatedNames.push(...extract(page.movies, 'name'));
			}

			expect(paginatedNames, 'API did not return every movie exactly once across the pages').to.have.members(names);
		});

		it('Should check for pagination validity', async() => {
			const invalidPaginations = [
				{ offset: -1, limit: 10 },
				{ offset: 0, limit: 0 },
				{ offset: 0, limit: 101 },
				{ offset: 1.5, limit: 10 },
				{ offset: 0 },
				{ limit: 10 }
			];

			for(const invalidPagination of invalidPaginations) {
				await callHelper<Record<string, unknown>, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
					pagination: invalidPagination
				}, {
					expectedStatus: 500
				});
			}
		});

		it('Should search movies by term', async() => {
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Rtestrr', importance: '100' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: '200' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'ZzTESTz', importance: '200' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ttt', importance: '100' }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'testAaa', importance: '200' }));
			
			const response = await callHelper<SearchMoviesRequest, SearchMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, firstUCG.user, {
				filter: {
					importanceLevels: [ '200' ]
				},
				searchTerm: 'test'
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(2);
			expect(extract(response.movies, 'name'), 'API did not return the correct movies').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should paginate the searched movies', async() => {
			for(const name of [ 'testAaa', 'testBbb', 'testCcc' ]) {
				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: name, importance: '100' }));
			}
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Nope', importance: '100' }));

			const response = await callHelper<SearchMoviesRequest, SearchMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, firstUCG.user, {
				searchTerm: 'test',
				pagination: {
					offset: 1,
					limit: 1
				}
			});
			expect(extract(response.movies, 'name'), 'API did not return the requested page of search results').to.be.eql([ 'testBbb' ]);
			expect(response.pagination?.totalCount, 'API did not return the total count of search results').to.equal(3);
		});

		it('Should delete an existing movie', async() => {
			const movie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const movieId = String(movie._id);

			await callHelper<undefined, DeleteMediaItemResponse>('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/${movieId}`, firstUCG.user);
			
			const foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {
			await callHelper<Record<string, unknown>, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					importance: '100'
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should check for importance validity', async() => {
			await callHelper<Record<string, unknown>, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					name: randomName()
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should sort movies in a group by their order, decimals included', async() => {
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 3, { name: 'Third' }));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 1, { name: 'First' }));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 2.5, { name: 'Spinoff' }));
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 2, { name: 'Second' }));

			const response = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				sortBy: [{
					field: 'GROUP',
					ascending: true
				}]
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(4);
			expect(extract(response.movies, 'name'), 'API did not sort the movies by their order in the group').to.be.eql([ 'First', 'Second', 'Spinoff', 'Third' ]);
		});

		it('Should save and then retrieve a decimal order in a group', async() => {
			const name = randomName();
			await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					name: name,
					importance: '100',
					group: {
						groupId: String(firstUCG.group),
						orderInGroup: 2.5
					}
				}
			});

			const response = await callHelper<undefined, GetAllMoviesResponse>('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user);
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(1);
			expect(response.movies[0].group, 'API did not return the movie group').not.to.be.undefined;
			expect(response.movies[0].group?.orderInGroup, 'API did not return the decimal order in the group').to.equal(2.5);
		});

		it('Should check for order in group validity', async() => {
			const invalidOrders = [ 2.55, 0, -1, 10000 ];

			for(const invalidOrder of invalidOrders) {
				await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
					newMovie: {
						name: randomName(),
						importance: '100',
						group: {
							groupId: String(firstUCG.group),
							orderInGroup: invalidOrder
						}
					}
				}, {
					expectedStatus: 500
				});
			}
		});

		it('Should search the movies catalog', async() => {
			const response = await callHelper<undefined, SearchMovieCatalogResponse>('GET', `/catalog/movies/search/Mock Movie`, firstUCG.user);
			
			expect(response.searchResults, 'API did not return the correct number of catalog movies').to.have.lengthOf(2);
			expect(extract(response.searchResults, 'name'), 'API did not return the correct catalog movies').to.have.members([ 'Mock Movie 1', 'Mock Movie 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog movies').to.have.members([ '123', '456' ]);
		});

		it('Should get movie details from the catalog', async() => {
			const expectedResult: Required<CatalogMovie> = {
				name: 'Mock Movie 1',
				description: 'Some description',
				directors: [ 'Some Director' ],
				durationMinutes: 178,
				genres: [ 'Action', 'Adventure', 'Fantasy' ],
				imageUrl: 'http://movie-images/pIUvQ9Ed35wlWhY2oU6OmwEsmzG.jpg',
				releaseDate: '2001-12-18T00:00:00.000Z',
				catalogId: '123'
			};

			const response = await callHelper<undefined, GetMovieFromCatalogResponse>('GET', `/catalog/movies/123`, firstUCG.user);
			
			expect(response.catalogMovie, 'API did not return the correct catalog details').to.be.eql(expectedResult);
		});

		it('Should skip the invalid parts of the movie catalog details', async() => {
			const expectedResult: Required<CatalogMovie> = {
				name: 'Malformed Movie',
				description: 'This is some description.',
				directors: [ 'Some Director' ],
				durationMinutes: 91,
				genres: [ 'Genre1', 'Genre2' ],
				imageUrl: 'http://movie-images/malformed.jpg',
				releaseDate: '2004-08-06T00:00:00.000Z',
				catalogId: '456'
			};

			const response = await callHelper<undefined, GetMovieFromCatalogResponse>('GET', `/catalog/movies/456`, firstUCG.user);

			expect(response.catalogMovie, 'API did not skip the invalid genre and crew member').to.be.eql(expectedResult);
		});

		it('Should save and then retrieve ALL fields', async() => {
			// Add group
			const sourceGroup: Required<IdentifiedGroup> = {
				uid: '',
				name: randomName('Group')
			};
			const { uid: groupId } = await await callHelper<AddGroupRequest, AddGroupResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/groups`, firstUCG.user, {
				newGroup: sourceGroup
			});

			// Add own platform
			const sourceOwnPlatform: Required<IdentifiedOwnPlatform> = {
				uid: '',
				name: randomName('OwnPlatform'),
				color: '#00ff00',
				icon: 'something'
			};
			const { uid: ownPlatformId } = await callHelper<AddOwnPlatformRequest, AddOwnPlatformResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/own-platforms`, firstUCG.user, {
				newOwnPlatform: sourceOwnPlatform
			});

			// Add media item
			const sourceMovie: Required<IdentifiedMovie> = {
				uid: '',
				name: randomName('Name'),
				active: true,
				markedAsRedo: true,
				catalogId: randomName('Catalog'),
				completedOn: [ '2011-12-25T10:32:27.240Z', '2015-04-01T10:32:27.240Z', '2017-05-17T10:32:27.240Z' ],
				description: randomName('Description'),
				genres: [ randomName('Genre1') ],
				group: {
					groupId: groupId,
					orderInGroup: 4
				},
				imageUrl: 'http://test.com',
				importance: '100',
				ownPlatform: {
					ownPlatformId: ownPlatformId
				},
				releaseDate: '2010-01-01T10:32:27.240Z',
				userComment: randomName('SomeComment'),
				directors: [ randomName('Director1') ],
				durationMinutes: 525
			};
			await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: sourceMovie
			});

			// Get media item
			const response = await callHelper<undefined, GetAllMoviesResponse>('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user);

			// "Fix" source entities
			sourceMovie.uid = response.movies[0].uid;
			sourceGroup.uid = groupId;
			sourceOwnPlatform.uid = ownPlatformId;
			sourceMovie.group.groupData = sourceGroup;
			sourceMovie.ownPlatform.ownPlatformData = sourceOwnPlatform;

			// Check media item
			expect(response.movies[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceMovie);
		});

		it('Should not allow to add to another user\'s movies', async() => {
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to update another user\'s movie', async() => {
			await callHelper('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/someobjectid`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to delete another user\'s movie', async() => {
			await callHelper('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/someobjectid`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to get another user\'s movies', async() => {
			await callHelper('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to filter another user\'s movies', async() => {
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to search another user\'s movies', async() => {
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
