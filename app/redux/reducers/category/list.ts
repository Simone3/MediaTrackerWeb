import { COMPLETE_DELETING_CATEGORY, COMPLETE_FETCHING_CATEGORIES, COMPLETE_SAVING_CATEGORY, FAIL_DELETING_CATEGORY, FAIL_FETCHING_CATEGORIES, HIGHLIGHT_CATEGORY, INVALIDATE_CATEGORIES, REMOVE_CATEGORY_HIGHLIGHT, START_DELETING_CATEGORY, START_FETCHING_CATEGORIES } from 'app/redux/actions/category/const';
import { CompleteFetchingCategoriesAction, HighlightCategoryAction } from 'app/redux/actions/category/types';
import { COMPLETE_IMPORTING_OLD_APP_EXPORT } from 'app/redux/actions/import-export/const';
import { CategoriesListState } from 'app/redux/state/category';
import { Action } from 'redux';

/**
 * The initial state for the categories list
 */
const initialState: CategoriesListState = {
	categories: [],
	status: 'REQUIRES_FETCH',
	highlightedCategory: undefined
};

/**
 * Reducer for the categories list portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const categoriesList = (state: CategoriesListState = initialState, action: Action): CategoriesListState => {
	
	switch(action.type) {

		// When the app starts fetching the list of categories, the status changes to show the loading indicator
		case START_FETCHING_CATEGORIES: {

			return {
				...state,
				status: 'FETCHING'
			};
		}
	
		// When the app completes the fetching process, the status is reset and the retrieved list is saved
		case COMPLETE_FETCHING_CATEGORIES: {

			const receiveCategoriesAction = action as CompleteFetchingCategoriesAction;
			
			return {
				...state,
				status: 'FETCHED',
				categories: receiveCategoriesAction.categories
			};
		}

		// When the app fails to fetch the categories, the status is reset and an empty list is loaded (an error is shown by the global handler)
		case FAIL_FETCHING_CATEGORIES: {

			return {
				...state,
				status: 'FETCHED',
				categories: []
			};
		}

		// When the list is explicitly invalidated or when a new category has been successfully saved, the list is marked for reload
		case INVALIDATE_CATEGORIES:
		case COMPLETE_SAVING_CATEGORY: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app starts deleting a category, the status changes to show the loading indicator
		case START_DELETING_CATEGORY: {

			return {
				...state,
				status: 'DELETING'
			};
		}

		// When the app completes the delete process, the list is marked for reload
		case COMPLETE_DELETING_CATEGORY: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app fails to delete a category, the status is reset (an error is shown by the global handler)
		case FAIL_DELETING_CATEGORY: {
		
			return {
				...state,
				status: 'FETCHED'
			};
		}

		// When a category is highlighted (e.g. to open the context menu), the corresponding state field is set
		case HIGHLIGHT_CATEGORY: {

			const highlightCategoryAction = action as HighlightCategoryAction;

			return {
				...state,
				highlightedCategory: highlightCategoryAction.category
			};
		}

		// When a category is no longer highlighted (e.g. to close the context menu), the corresponding state field is reset
		case REMOVE_CATEGORY_HIGHLIGHT: {

			return {
				...state,
				highlightedCategory: undefined
			};
		}

		// When a bulk import completes, the list is reset
		case COMPLETE_IMPORTING_OLD_APP_EXPORT: {

			return {
				...initialState
			};
		}
		
		default:
			return state;
	}
};
