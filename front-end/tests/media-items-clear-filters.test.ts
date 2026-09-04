import { config } from 'app/config/config';
import { CategoryInternal } from 'app/data/models/internal/category';
import { BookFilterInternal, BookSortByInternal } from 'app/data/models/internal/media-items/book';
import { clearMediaItemsFilters } from 'app/redux/actions/media-item/generators';
import { mediaItemsList } from 'app/redux/reducers/media-item/list';
import { MediaItemsListState } from 'app/redux/state/media-item';

const defaultFilter: BookFilterInternal = {
	status: 'CURRENT'
};

const defaultSortBy: BookSortByInternal[] = [{
	field: 'ACTIVE',
	ascending: false
}];

jest.mock('app/controllers/main/entities/media-items/factories', () => {
	return {
		mediaItemDefinitionsControllerFactory: {
			get: jest.fn()
		}
	};
});

const factoriesMock = jest.requireMock('app/controllers/main/entities/media-items/factories');

const category: CategoryInternal = {
	id: 'category-id',
	name: 'Books',
	mediaType: 'BOOK',
	color: config.ui.colors.availableCategoryColors[0]
};

const buildState = (overrides: Partial<MediaItemsListState>): MediaItemsListState => {
	return {
		status: 'FETCHED',
		mode: 'NORMAL',
		filter: undefined,
		sortBy: undefined,
		searchTerm: undefined,
		viewGroup: undefined,
		mediaItems: [],
		currentPage: 0,
		totalCount: 0,
		highlightedMediaItem: undefined,
		...overrides
	};
};

describe('media items clear filters reducer', () => {
	beforeEach(() => {
		factoriesMock.mediaItemDefinitionsControllerFactory.get.mockReturnValue({
			getDefaultFilter: () => {
				return defaultFilter;
			},
			getDefaultSortBy: () => {
				return defaultSortBy;
			}
		});
	});

	test('restores the category defaults and reloads the first page', () => {
		const previousState = buildState({
			filter: {
				status: 'COMPLETE',
				groups: {
					anyGroup: true
				}
			},
			sortBy: [{
				ascending: true
			}],
			currentPage: 4
		});

		const nextState = mediaItemsList(previousState, clearMediaItemsFilters(category));

		expect(factoriesMock.mediaItemDefinitionsControllerFactory.get).toHaveBeenCalledWith(category);
		expect(nextState.filter).toEqual(defaultFilter);
		expect(nextState.sortBy).toEqual(defaultSortBy);
		expect(nextState.status).toBe('REQUIRES_FETCH');
		expect(nextState.currentPage).toBe(0);
	});

	test('leaves the current mode and search term alone, since only the modal closing changes them', () => {
		const previousState = buildState({
			mode: 'SET_FILTERS',
			searchTerm: 'dune'
		});

		const nextState = mediaItemsList(previousState, clearMediaItemsFilters(category));

		expect(nextState.mode).toBe('SET_FILTERS');
		expect(nextState.searchTerm).toBe('dune');
	});
});
