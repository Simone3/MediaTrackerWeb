import { config } from 'app/config/config';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { FAIL_FETCHING_CATEGORIES } from 'app/redux/actions/category/const';
import { FAIL_FETCHING_GROUPS } from 'app/redux/actions/group/const';
import { FAIL_FETCHING_MEDIA_ITEMS } from 'app/redux/actions/media-item/const';
import { FAIL_FETCHING_OWN_PLATFORMS } from 'app/redux/actions/own-platform/const';
import { categoriesList } from 'app/redux/reducers/category/list';
import { groupsList } from 'app/redux/reducers/group/list';
import { mediaItemsList } from 'app/redux/reducers/media-item/list';
import { ownPlatformsList } from 'app/redux/reducers/own-platform/list';
import { CategoriesListState } from 'app/redux/state/category';
import { GroupsListState } from 'app/redux/state/group';
import { MediaItemsListState } from 'app/redux/state/media-item';
import { OwnPlatformsListState } from 'app/redux/state/own-platform';

jest.mock('app/controllers/main/entities/media-items/factories', () => {
	return {
		mediaItemDefinitionsControllerFactory: {
			get: jest.fn()
		}
	};
});

describe('list fetch failure reducers', () => {
	test('keeps the last categories list when category fetching fails', () => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			mediaType: 'BOOK',
			color: config.ui.colors.availableCategoryColors[0]
		};
		const previousState: CategoriesListState = {
			categories: [ category ],
			status: 'FETCHING',
			highlightedCategory: undefined
		};

		const nextState = categoriesList(previousState, {
			type: FAIL_FETCHING_CATEGORIES
		});

		expect(nextState.status).toBe('FETCH_FAILED');
		expect(nextState.categories).toEqual([ category ]);
	});

	test('keeps the last media items list when media item fetching fails', () => {
		const mediaItem: MediaItemInternal = {
			id: 'media-item-id',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '300'
		};
		const previousState: MediaItemsListState = {
			status: 'FETCHING',
			mode: 'NORMAL',
			filter: undefined,
			sortBy: undefined,
			searchTerm: undefined,
			viewGroup: undefined,
			mediaItems: [ mediaItem ],
			highlightedMediaItem: undefined
		};

		const nextState = mediaItemsList(previousState, {
			type: FAIL_FETCHING_MEDIA_ITEMS
		});

		expect(nextState.status).toBe('FETCH_FAILED');
		expect(nextState.mediaItems).toEqual([ mediaItem ]);
	});

	test('keeps the last groups list when group fetching fails', () => {
		const group: GroupInternal = {
			id: 'group-id',
			name: 'Saga'
		};
		const previousState: GroupsListState = {
			groups: [ group ],
			status: 'FETCHING',
			highlightedGroup: undefined
		};

		const nextState = groupsList(previousState, {
			type: FAIL_FETCHING_GROUPS
		});

		expect(nextState.status).toBe('FETCH_FAILED');
		expect(nextState.groups).toEqual([ group ]);
	});

	test('keeps the last own platforms list when own platform fetching fails', () => {
		const ownPlatform: OwnPlatformInternal = {
			id: 'own-platform-id',
			name: 'Switch',
			color: config.ui.colors.availableOwnPlatformColors[1],
			icon: 'switch'
		};
		const previousState: OwnPlatformsListState = {
			ownPlatforms: [ ownPlatform ],
			status: 'FETCHING',
			highlightedOwnPlatform: undefined
		};

		const nextState = ownPlatformsList(previousState, {
			type: FAIL_FETCHING_OWN_PLATFORMS
		});

		expect(nextState.status).toBe('FETCH_FAILED');
		expect(nextState.ownPlatforms).toEqual([ ownPlatform ]);
	});
});
