import { MediaItemStatusInternal } from 'app/data/models/internal/media-items/media-item';
import { mediaItemUtils, MediaItemStatusSourceInternal } from 'app/utilities/media-item-utils';

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

/**
 * The instant every case is resolved against, and the three instants they are built from. The helper takes the instant
 * as an argument, so the cases can be pinned against a fixed "now" here: the back end resolves the same table against
 * the server clock at query time instead, which is the only difference between the two copies
 */
const NOW = new Date('2026-06-15T12:00:00.000Z');

const PAST_DATE = new Date(NOW.getTime() - ONE_YEAR);
const FUTURE_DATE = new Date(NOW.getTime() + ONE_YEAR);
const COMPLETION_DATE = new Date(NOW.getTime() - 2 * ONE_YEAR);

/**
 * THE MEDIA ITEM STATUS RULE, AS A TABLE OF CASES.
 *
 * The five statuses are derived from four stored fields and are resolved twice in the product: here, by
 * mediaItemUtils.buildStatusLabel, for the list rows, and in the back end, by the MongoDB expression in
 * MediaItemEntityController.buildBacklogStatusExpression, to bucket the stats backlog. Neither side can import the
 * other, so this table is duplicated in back-end/test/integration/routes/media-items/status-rule-test.ts and the two
 * copies must stay identical: they are what turns a silent disagreement between the two screens into a failing test.
 *
 * Adding, removing or reordering a case here means doing the same there.
 */
const STATUS_RULE_CASES: { description: string; source: MediaItemStatusSourceInternal; expectedStatus: MediaItemStatusInternal }[] = [{
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

describe('mediaItemUtils.buildStatusLabel', () => {
	for(const statusRuleCase of STATUS_RULE_CASES) {
		test(`resolves ${statusRuleCase.expectedStatus} for a media item with ${statusRuleCase.description}`, () => {
			expect(mediaItemUtils.buildStatusLabel(statusRuleCase.source, NOW)).toBe(statusRuleCase.expectedStatus);
		});
	}

	test('compares the release date against the current instant by default', () => {
		const justReleased = new Date(Date.now() - 60 * 1000);
		const aboutToRelease = new Date(Date.now() + 60 * 60 * 1000);

		expect(mediaItemUtils.buildStatusLabel({ releaseDate: justReleased })).toBe('NEW');
		expect(mediaItemUtils.buildStatusLabel({ releaseDate: aboutToRelease })).toBe('UPCOMING');
	});
});
