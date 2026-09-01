import { SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { COMPLETE_FETCHING_MEDIA_ITEMS_STATS, FAIL_FETCHING_MEDIA_ITEMS_STATS, SET_MEDIA_ITEMS_STATS_FILTER } from 'app/redux/actions/media-item/const';
import { CompleteFetchingMediaItemsStatsAction, SetMediaItemsStatsFilterAction } from 'app/redux/actions/media-item/types';
import { mediaItemsStats } from 'app/redux/reducers/media-item/stats';
import { MediaItemsStatsState, mapMediaItemsStatsForPersistence, mediaItemsStatsStateInitialValue } from 'app/redux/state/media-item-stats';
import { MediaItemsStatsInternal } from 'app/data/models/internal/media-items/media-item';

const stats: MediaItemsStatsInternal = {
	mediaItems: {
		total: 12,
		filtered: 4
	},
	completions: {
		total: 7,
		mediaItems: 5,
		byYear: [ { year: 2023, count: 7 } ]
	},
	backlog: {
		total: 3,
		byStatus: [ { status: 'NEW', count: 3 } ],
		byImportanceAndOwnPlatform: [ { importance: '300', ownPlatformId: undefined, count: 3 } ]
	}
};

const fetchedState: MediaItemsStatsState = {
	status: 'FETCHED',
	filter: {
		groups: {
			noGroup: true
		}
	},
	stats: stats
};

describe('mediaItemsStats reducer', () => {
	test('saves the fetched stats', () => {
		const action: CompleteFetchingMediaItemsStatsAction = {
			type: COMPLETE_FETCHING_MEDIA_ITEMS_STATS,
			stats: stats
		};

		const nextState = mediaItemsStats(mediaItemsStatsStateInitialValue, action);

		expect(nextState.status).toBe('FETCHED');
		expect(nextState.stats).toEqual(stats);
	});

	test('keeps the last stats on screen when the fetch fails', () => {
		const nextState = mediaItemsStats(fetchedState, {
			type: FAIL_FETCHING_MEDIA_ITEMS_STATS
		});

		expect(nextState.status).toBe('FETCH_FAILED');
		expect(nextState.stats).toEqual(stats);
	});

	test('marks the stats for reload when the filter changes', () => {
		const action: SetMediaItemsStatsFilterAction = {
			type: SET_MEDIA_ITEMS_STATS_FILTER,
			filter: {}
		};

		const nextState = mediaItemsStats(fetchedState, action);

		expect(nextState.status).toBe('REQUIRES_FETCH');
		expect(nextState.filter).toEqual({});
	});

	test('resets the whole slice when another category is selected', () => {
		const nextState = mediaItemsStats(fetchedState, {
			type: SELECT_CATEGORY
		});

		expect(nextState).toEqual(mediaItemsStatsStateInitialValue);
	});
});

describe('mapMediaItemsStatsForPersistence', () => {
	test('keeps the stats and the filter but makes a reload behave like a reload', () => {
		const persisted = mapMediaItemsStatsForPersistence(fetchedState);

		expect(persisted.status).toBe('REQUIRES_FETCH');
		expect(persisted.stats).toEqual(stats);
		expect(persisted.filter).toEqual(fetchedState.filter);
	});
});
