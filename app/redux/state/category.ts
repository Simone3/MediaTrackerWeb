import { CategoryInternal } from 'app/data/models/internal/category';

/**
 * Portion of the internal state with the global category data
 */
export type CategoryGlobalState = {

	/**
	 * The current category, e.g. to show the correct list of media items, groups, etc.
	 * Undefined means no category has been selected yet
	 */
	selectedCategory: CategoryInternal | undefined;
};

/**
 * The initial value for the global category state
 */
export const categoryGlobalStateInitialValue: CategoryGlobalState = {
	selectedCategory: undefined
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapCategoryGlobalForPersistence = (state: CategoryGlobalState): CategoryGlobalState => {
	return {
		...state
	};
};

/**
 * Portion of the internal state with the categories list information
 */
export type CategoriesListState = {

	/**
	 * The list of available categories
	 */
	readonly categories: CategoryInternal[];

	/**
	 * The current status of the categories list
	 */
	readonly status: CategoriesListStatus;

	/**
	 * The currently highlighted (e.g. context menu is open) category, or undefined if none is highlighted
	 */
	readonly highlightedCategory: CategoryInternal | undefined;
};

/**
 * The initial value for the categories list state
 */
export const categoriesListStateInitialValue: CategoriesListState = {
	categories: [],
	status: 'REQUIRES_FETCH',
	highlightedCategory: undefined
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapCategoriesListForPersistence = (state: CategoriesListState): CategoriesListState => {
	return {
		...state,
		status: 'REQUIRES_FETCH',
		highlightedCategory: undefined
	};
};

/**
 * Portion of the internal state with the category details information
 */
export type CategoryDetailsState = {

	/**
	 * The category data
	 */
	readonly category?: CategoryInternal;

	/**
	 * If the currently loaded category is valid (no validation error occurred)
	 */
	readonly valid: boolean;

	/**
	 * If the currently loaded category is dirty (one or more fields are different from initial values)
	 */
	readonly dirty: boolean;

	/**
	 * The current status of the category saving process
	 */
	readonly saveStatus: CategorySaveStatus;
};

/**
 * The initial value for the category details state
 */
export const categoryDetailsStateInitialValue: CategoryDetailsState = {
	category: undefined,
	valid: false,
	dirty: false,
	saveStatus: 'IDLE'
};

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapCategoryDetailsForPersistence = (state: CategoryDetailsState): CategoryDetailsState => {
	return {
		...state,
		saveStatus: 'IDLE'
	};
};

/**
 * The current status of the categories list
 */
export type CategoriesListStatus = 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'FETCH_FAILED' | 'DELETING';

/**
 * The current status of the category saving process
 */
export type CategorySaveStatus = 'IDLE' | 'REQUESTED' | 'REQUIRES_CONFIRMATION' | 'SAVING' | 'SAVED';
