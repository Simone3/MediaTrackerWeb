import { bookEntityController } from 'app/controllers/entities/media-items/book';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { tvShowEntityController } from 'app/controllers/entities/media-items/tv-show';
import { videogameEntityController } from 'app/controllers/entities/media-items/videogame';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { GetMediaItemsStatsRequest, GetMediaItemsStatsResponse, MediaItemsStatsImportanceAndOwnPlatform } from 'app/data/models/api/media-items/media-item';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestBook, getTestMovie, getTestMovieInGroup, getTestOwnPlatform, getTestTvShow, getTestVideogame, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';

const expect = chai.expect;

/**
 * Helper to build a date in the middle of the given year, i.e. far enough from its boundaries for the time zone not to matter
 * @param year the year
 * @returns the date
 */
const midYear = (year: number): Date => {
	return new Date(Date.UTC(year, 5, 15, 10, 0, 0));
};

/**
 * Helper to find one entry of the backlog importance/own platform breakdown
 * @param entries the breakdown
 * @param importance the importance level
 * @param ownPlatformId the own platform ID, or null for the "not owned" bucket
 * @returns the entry, if any
 */
const findByImportanceAndOwnPlatform = (entries: MediaItemsStatsImportanceAndOwnPlatform[], importance: string, ownPlatformId: string | null): MediaItemsStatsImportanceAndOwnPlatform | undefined => {
	return entries.find((entry) => {
		return entry.importance === importance && (entry.ownPlatformId === null ? null : String(entry.ownPlatformId)) === ownPlatformId;
	});
};

/**
 * Tests for the media items stats API
 */
describe('Media Items Stats API Tests', () => {
	setupTestDatabaseConnection();
	setupTestServer();

	describe('Media Items Stats API Tests', () => {
		const firstUCG: TestUCG = { user: '', category: '' };
		const secondUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {
			await initTestUCGHelper('MOVIE', firstUCG, 'First');
			await initTestUCGHelper('MOVIE', secondUCG, 'Second');
		});

		/**
		 * Helper to call the movies stats API of the first test user
		 * @param request the optional request body
		 * @returns the response body, as a promise
		 */
		const getMovieStats = (request?: GetMediaItemsStatsRequest): Promise<GetMediaItemsStatsResponse> => {
			return callHelper<GetMediaItemsStatsRequest, GetMediaItemsStatsResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/stats`, firstUCG.user, request ? request : {});
		};

		it('Should return empty stats for an empty category', async() => {
			const response = await getMovieStats();

			expect(response.mediaItems, 'API did not return zeroed media item counts').to.eql({ total: 0, filtered: 0 });
			expect(response.completions, 'API did not return zeroed completions').to.eql({ total: 0, mediaItems: 0, byYear: [] });
			expect(response.backlog, 'API did not return an empty backlog').to.eql({ total: 0, byStatus: [], byImportanceAndOwnPlatform: [] });
		});

		it('Should count completions and bucket the backlog by status', async() => {
			// Completed twice and not marked for redo: two completions, nothing left to do
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2020), midYear(2021) ]
			}));

			// Completed once and marked for redo: one completion AND one backlog item
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2021) ],
				markedAsRedo: true
			}));

			// Completed, marked for redo and active: "active" wins the precedence
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2023) ],
				markedAsRedo: true,
				active: true
			}));

			// Active
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				active: true
			}));

			// Released in the future
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			}));

			// Released in the past, never started
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				releaseDate: midYear(2010)
			}));

			// Nothing at all
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));

			const response = await getMovieStats();

			expect(response.mediaItems, 'API did not count the media items').to.eql({ total: 7, filtered: 7 });
			expect(response.completions.total, 'API did not count every completion date').to.equal(4);
			expect(response.completions.mediaItems, 'API did not count the distinct completed media items').to.equal(3);
			expect(response.completions.byYear, 'API did not group the completions by year').to.eql([
				{ year: 2020, count: 1 },
				{ year: 2021, count: 2 },
				{ year: 2023, count: 1 }
			]);

			expect(response.backlog.total, 'API did not count the backlog').to.equal(6);
			expect(response.backlog.byStatus, 'API did not bucket the backlog by status').to.eql([
				{ status: 'NEW', count: 2 },
				{ status: 'ACTIVE', count: 2 },
				{ status: 'UPCOMING', count: 1 },
				{ status: 'REDO', count: 1 }
			]);
		});

		it('Should omit the years without completions and order the remaining ones', async() => {
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2022) ]
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2018), midYear(2022) ]
			}));

			const response = await getMovieStats();

			expect(response.completions.byYear, 'API did not omit the empty years or did not order them').to.eql([
				{ year: 2018, count: 1 },
				{ year: 2022, count: 2 }
			]);
		});

		it('Should compute the completion year in the requested time zone', async() => {
			// The 1st of January in Rome, i.e. still the 31st of December in UTC
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ new Date('2023-12-31T23:00:00Z') ]
			}));

			const utcResponse = await getMovieStats();
			expect(utcResponse.completions.byYear, 'API did not default to UTC').to.eql([{ year: 2023, count: 1 }]);

			const romeResponse = await getMovieStats({ timezone: 'Europe/Rome' });
			expect(romeResponse.completions.byYear, 'API did not use the requested time zone').to.eql([{ year: 2024, count: 1 }]);
		});

		it('Should not accept an invalid time zone', async() => {
			await callHelper<GetMediaItemsStatsRequest, GetMediaItemsStatsResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/stats`, firstUCG.user, {
				timezone: 'Middle/Earth'
			}, {
				expectedStatus: 500
			});
		});

		it('Should break the backlog down by importance and own platform', async() => {
			const firstOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));
			const secondOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				importance: '400',
				ownPlatform: String(firstOwnPlatform._id)
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				importance: '400',
				ownPlatform: String(firstOwnPlatform._id)
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				importance: '400'
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				importance: '100',
				ownPlatform: String(secondOwnPlatform._id),
				active: true
			}));

			// Complete, so it must not appear anywhere in the backlog
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				importance: '200',
				ownPlatform: String(firstOwnPlatform._id),
				completedOn: [ midYear(2021) ]
			}));

			const response = await getMovieStats();
			const entries = response.backlog.byImportanceAndOwnPlatform;

			expect(entries, 'API returned combinations with no media item').to.have.lengthOf(3);
			expect(findByImportanceAndOwnPlatform(entries, '400', String(firstOwnPlatform._id))?.count, 'API did not count the owned media items').to.equal(2);
			expect(findByImportanceAndOwnPlatform(entries, '400', null)?.count, 'API did not count the not owned media items').to.equal(1);
			expect(findByImportanceAndOwnPlatform(entries, '100', String(secondOwnPlatform._id))?.count, 'API did not count the media items of the other importance level').to.equal(1);
			expect(findByImportanceAndOwnPlatform(entries, '200', String(firstOwnPlatform._id)), 'API counted a complete media item in the backlog').to.be.undefined;
		});

		it('Should apply the group filter', async() => {
			await movieEntityController.saveMediaItem(getTestMovieInGroup(undefined, firstUCG, 1, {
				completedOn: [ midYear(2020) ]
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2021) ]
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));

			const inGroup = await getMovieStats({
				filter: {
					groups: {
						groupIds: [ String(firstUCG.group) ]
					}
				}
			});

			expect(inGroup.mediaItems, 'API did not filter by group').to.eql({ total: 3, filtered: 1 });
			expect(inGroup.completions.byYear, 'API did not filter the completions by group').to.eql([{ year: 2020, count: 1 }]);
			expect(inGroup.backlog.total, 'API did not filter the backlog by group').to.equal(0);

			const withoutGroup = await getMovieStats({
				filter: {
					groups: {
						noGroup: true
					}
				}
			});

			expect(withoutGroup.mediaItems, 'API did not filter the media items without a group').to.eql({ total: 3, filtered: 2 });
			expect(withoutGroup.completions.byYear, 'API did not filter the completions of the media items without a group').to.eql([{ year: 2021, count: 1 }]);
			expect(withoutGroup.backlog.total, 'API did not filter the backlog of the media items without a group').to.equal(1);
		});

		it('Should apply the own platform filter', async() => {
			const ownPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUCG));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				ownPlatform: String(ownPlatform._id)
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));

			const owned = await getMovieStats({
				filter: {
					ownPlatforms: {
						ownPlatformIds: [ String(ownPlatform._id) ]
					}
				}
			});

			expect(owned.mediaItems, 'API did not filter by own platform').to.eql({ total: 3, filtered: 1 });
			expect(owned.backlog.total, 'API did not filter the backlog by own platform').to.equal(1);

			const notOwned = await getMovieStats({
				filter: {
					ownPlatforms: {
						noOwnPlatform: true
					}
				}
			});

			expect(notOwned.mediaItems, 'API did not filter the media items without an own platform').to.eql({ total: 3, filtered: 2 });
			expect(notOwned.backlog.total, 'API did not filter the backlog of the media items without an own platform').to.equal(2);
		});

		it('Should not count the media items of other users or other categories', async() => {
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, {
				completedOn: [ midYear(2020) ]
			}));

			await movieEntityController.saveMediaItem(getTestMovie(undefined, secondUCG, {
				completedOn: [ midYear(2020), midYear(2021) ]
			}));

			const response = await getMovieStats();

			expect(response.mediaItems, 'API counted the media items of another user').to.eql({ total: 1, filtered: 1 });
			expect(response.completions.total, 'API counted the completions of another user').to.equal(1);
		});

		it('Should not allow to get another user\'s stats', async() => {
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/stats`, secondUCG.user, {}, {
				expectedStatus: 403
			});
		});

		it('Should expose the same API for every media type', async() => {
			const bookUCG: TestUCG = { user: '', category: '' };
			const tvShowUCG: TestUCG = { user: '', category: '' };
			const videogameUCG: TestUCG = { user: '', category: '' };
			await initTestUCGHelper('BOOK', bookUCG, 'Book');
			await initTestUCGHelper('TV_SHOW', tvShowUCG, 'TvShow');
			await initTestUCGHelper('VIDEOGAME', videogameUCG, 'Videogame');

			await bookEntityController.saveMediaItem(getTestBook(undefined, bookUCG, {
				completedOn: [ midYear(2020) ]
			}));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, tvShowUCG, {
				active: true
			}));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, videogameUCG));

			const bookResponse = await callHelper<GetMediaItemsStatsRequest, GetMediaItemsStatsResponse>('POST', `/users/${bookUCG.user}/categories/${bookUCG.category}/books/stats`, bookUCG.user, {});
			expect(bookResponse.completions.total, 'Books API did not count the completions').to.equal(1);
			expect(bookResponse.backlog.total, 'Books API did not count the backlog').to.equal(0);

			const tvShowResponse = await callHelper<GetMediaItemsStatsRequest, GetMediaItemsStatsResponse>('POST', `/users/${tvShowUCG.user}/categories/${tvShowUCG.category}/tv-shows/stats`, tvShowUCG.user, {});
			expect(tvShowResponse.backlog.byStatus, 'TV shows API did not bucket the backlog').to.eql([{ status: 'ACTIVE', count: 1 }]);

			const videogameResponse = await callHelper<GetMediaItemsStatsRequest, GetMediaItemsStatsResponse>('POST', `/users/${videogameUCG.user}/categories/${videogameUCG.category}/videogames/stats`, videogameUCG.user, {});
			expect(videogameResponse.backlog.byStatus, 'Videogames API did not bucket the backlog').to.eql([{ status: 'NEW', count: 1 }]);
		});
	});
});
