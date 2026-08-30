import { config } from 'app/config/config';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { changeMediaItemsPage, completeDeletingMediaItem, completeFetchingMediaItems, completeInlineUpdatingMediaItem, completeSavingMediaItem, searchMediaItems, stopMediaItemsSearchMode, stopMediaItemsViewGroupMode, submitMediaItemsFilters } from 'app/redux/actions/media-item/generators';
import { mediaItemsList } from 'app/redux/reducers/media-item/list';
import { MediaItemsListState } from 'app/redux/state/media-item';

jest.mock('app/controllers/main/entities/media-items/factories', () => {
	return {
		mediaItemDefinitionsControllerFactory: {
			get: jest.fn()
		}
	};
});

const pageSize = config.ui.mediaItemsPageSize;

const buildMediaItem = (id: string): MediaItemInternal => {
	return {
		id: id,
		name: `Media item ${id}`,
		mediaType: 'BOOK',
		status: 'ACTIVE',
		importance: '300'
	};
};

const buildState = (overrides: Partial<MediaItemsListState>): MediaItemsListState => {
	return {
		status: 'FETCHED',
		mode: 'NORMAL',
		filter: undefined,
		sortBy: undefined,
		searchTerm: undefined,
		viewGroup: undefined,
		mediaItems: [ buildMediaItem('first') ],
		currentPage: 0,
		totalCount: 1,
		highlightedMediaItem: undefined,
		...overrides
	};
};

describe('media items list pagination reducer', () => {
	test('moving to another page marks the list for reload', () => {
		const previousState = buildState({ currentPage: 0 });

		const nextState = mediaItemsList(previousState, changeMediaItemsPage(3));

		expect(nextState.currentPage).toBe(3);
		expect(nextState.status).toBe('REQUIRES_FETCH');
	});

	test('completing a fetch stores the page and the total match count', () => {
		const previousState = buildState({ currentPage: 1, status: 'FETCHING' });
		const pageItems = [ buildMediaItem('one'), buildMediaItem('two') ];

		const nextState = mediaItemsList(previousState, completeFetchingMediaItems(pageItems, pageSize + 2));

		expect(nextState.status).toBe('FETCHED');
		expect(nextState.currentPage).toBe(1);
		expect(nextState.mediaItems).toEqual(pageItems);
		expect(nextState.totalCount).toBe(pageSize + 2);
	});

	test('falls back to the last existing page when the current one is gone', () => {
		// The user was on the third page and the only media item it held has just been deleted
		const previousState = buildState({ currentPage: 2, status: 'FETCHING' });

		const nextState = mediaItemsList(previousState, completeFetchingMediaItems([], 2 * pageSize));

		expect(nextState.currentPage).toBe(1);
		expect(nextState.status).toBe('REQUIRES_FETCH');
	});

	test('goes back to the first page without reloading when nothing matches anymore', () => {
		const previousState = buildState({ currentPage: 2, status: 'FETCHING' });

		const nextState = mediaItemsList(previousState, completeFetchingMediaItems([], 0));

		expect(nextState.currentPage).toBe(0);
		expect(nextState.status).toBe('FETCHED');
		expect(nextState.mediaItems).toEqual([]);
	});

	test.each([
		[ 'submitting filters', submitMediaItemsFilters({}, []) ],
		[ 'submitting a search', searchMediaItems('dune') ],
		[ 'closing search mode', stopMediaItemsSearchMode() ],
		[ 'closing view group mode', stopMediaItemsViewGroupMode() ]
	])('%s starts back from the first page', (_, action) => {
		const previousState = buildState({ currentPage: 4 });

		const nextState = mediaItemsList(previousState, action);

		expect(nextState.currentPage).toBe(0);
	});

	test.each([
		[ 'saving', completeSavingMediaItem() ],
		[ 'deleting', completeDeletingMediaItem() ],
		[ 'inline updating', completeInlineUpdatingMediaItem() ]
	])('completing %s reloads without leaving the current page', (_, action) => {
		const previousState = buildState({ currentPage: 4 });

		const nextState = mediaItemsList(previousState, action);

		expect(nextState.currentPage).toBe(4);
		expect(nextState.status).toBe('REQUIRES_FETCH');
	});
});
