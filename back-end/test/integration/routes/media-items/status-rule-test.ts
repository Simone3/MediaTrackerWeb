import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { GetMediaItemsStatsRequest, GetMediaItemsStatsResponse } from 'app/data/models/api/media-items/media-item';
import { MediaItemBacklogStatusInternal } from 'app/data/models/internal/media-items/media-item';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestMovie, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';

const expect = chai.expect;

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

/**
 * The three instants every case is built from. The aggregation resolves a release date against the server clock at
 * query time, which a test cannot inject, so these are offsets from the current instant rather than fixed dates: the
 * front end pins the same table against a fixed "now" instead, which is the only difference between the two copies
 */
const PAST_DATE = new Date(Date.now() - ONE_YEAR);
const FUTURE_DATE = new Date(Date.now() + ONE_YEAR);
const COMPLETION_DATE = new Date(Date.now() - 2 * ONE_YEAR);

/**
 * THE MEDIA ITEM STATUS RULE, AS A TABLE OF CASES.
 *
 * The five statuses are derived from four stored fields and are resolved twice in the product: here, by the MongoDB
 * expression in MediaItemEntityController.buildBacklogStatusExpression, to bucket the stats backlog, and in the front
 * end, in TypeScript, for the list rows. Neither side can import the other, so this table is duplicated in
 * front-end/tests/media-item-status-rule.test.ts and the two copies must stay identical: they are what turns a silent
 * disagreement between the two screens into a failing test.
 *
 * Adding, removing or reordering a case here means doing the same there.
 */
const STATUS_RULE_CASES: { description: string; source: { completedOn?: Date[]; releaseDate?: Date; active?: boolean; markedAsRedo?: boolean }; expectedStatus: MediaItemBacklogStatusInternal | 'COMPLETE' }[] = [{
	description: 'nothing set at all',
	source: {},
	expectedStatus: 'NEW'
}, {
	description: 'already released and never started',
	source: { releaseDate: PAST_DATE },
	expectedStatus: 'NEW'
}, {
	description: 'marked for redo but never completed',
	source: { markedAsRedo: true },
	expectedStatus: 'NEW'
}, {
	description: 'an empty completion list, which is not a completion',
	source: { completedOn: [] },
	expectedStatus: 'NEW'
}, {
	description: 'an empty completion list and marked for redo',
	source: { completedOn: [], markedAsRedo: true },
	expectedStatus: 'NEW'
}, {
	description: 'currently active',
	source: { active: true },
	expectedStatus: 'ACTIVE'
}, {
	description: 'active beats a future release date',
	source: { active: true, releaseDate: FUTURE_DATE },
	expectedStatus: 'ACTIVE'
}, {
	description: 'active beats a completion that was marked for redo',
	source: { active: true, completedOn: [ COMPLETION_DATE ], markedAsRedo: true },
	expectedStatus: 'ACTIVE'
}, {
	description: 'not released yet',
	source: { releaseDate: FUTURE_DATE },
	expectedStatus: 'UPCOMING'
}, {
	description: 'completed and marked for redo',
	source: { completedOn: [ COMPLETION_DATE ], markedAsRedo: true },
	expectedStatus: 'REDO'
}, {
	description: 'redo beats a future release date',
	source: { completedOn: [ COMPLETION_DATE ], markedAsRedo: true, releaseDate: FUTURE_DATE },
	expectedStatus: 'REDO'
}, {
	description: 'completed and not marked for redo',
	source: { completedOn: [ COMPLETION_DATE ] },
	expectedStatus: 'COMPLETE'
}, {
	description: 'completed several times',
	source: { completedOn: [ COMPLETION_DATE, PAST_DATE ] },
	expectedStatus: 'COMPLETE'
}, {
	description: 'complete beats active',
	source: { completedOn: [ COMPLETION_DATE ], active: true },
	expectedStatus: 'COMPLETE'
}, {
	description: 'complete beats a future release date',
	source: { completedOn: [ COMPLETION_DATE ], releaseDate: FUTURE_DATE },
	expectedStatus: 'COMPLETE'
}, {
	description: 'marked for redo with an explicit false, which is not a redo',
	source: { completedOn: [ COMPLETION_DATE ], markedAsRedo: false },
	expectedStatus: 'COMPLETE'
}];

/**
 * Tests that pin the media item status rule, one media item at a time so that a wrong bucket names the case that broke
 */
describe('Media Item Status Rule Tests', () => {
	setupTestDatabaseConnection();
	setupTestServer();

	describe('Media Item Status Rule Tests', () => {
		const firstUCG: TestUCG = { user: '', category: '' };

		// Create a new user/category for each test, so that the single seeded media item is the whole category
		beforeEach(async() => {
			await initTestUCGHelper('MOVIE', firstUCG, 'First');
		});

		/**
		 * Helper to call the movies stats API of the test user
		 * @returns the response body, as a promise
		 */
		const getMovieStats = (): Promise<GetMediaItemsStatsResponse> => {
			return callHelper<GetMediaItemsStatsRequest, GetMediaItemsStatsResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/stats`, firstUCG.user, {});
		};

		for(const statusRuleCase of STATUS_RULE_CASES) {
			it(`Should resolve ${statusRuleCase.expectedStatus} for a media item with ${statusRuleCase.description}`, async() => {
				await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, statusRuleCase.source));

				const response = await getMovieStats();

				expect(response.mediaItems.total, 'API did not see the seeded media item').to.equal(1);

				if(statusRuleCase.expectedStatus === 'COMPLETE') {
					// 'COMPLETE' is the one status the backlog cannot report, so it is asserted as an absence plus a completion
					expect(response.backlog.byStatus, 'API put a complete media item in the backlog').to.eql([]);
					expect(response.backlog.total, 'API counted a complete media item in the backlog').to.equal(0);
					expect(response.completions.mediaItems, 'API did not count the media item as completed').to.equal(1);
				}
				else {
					expect(response.backlog.byStatus, 'API resolved the wrong status').to.eql([{ status: statusRuleCase.expectedStatus, count: 1 }]);
					expect(response.backlog.total, 'API did not count the media item in the backlog').to.equal(1);
				}
			});
		}
	});
});
