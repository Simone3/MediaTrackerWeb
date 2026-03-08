import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { ASK_CONFIRMATION_BEFORE_SAVING_CATEGORY, COMPLETE_SAVING_CATEGORY, FAIL_SAVING_CATEGORY, LOAD_CATEGORY_DETAILS, LOAD_NEW_CATEGORY_DETAILS, REQUEST_CATEGORY_SAVE, SET_CATEGORY_FORM_STATUS, START_SAVING_CATEGORY } from 'app/redux/actions/category/const';
import { LoadCategoryDetailsAction, SetCategoryFormStatusAction, StartSavingCategoryAction } from 'app/redux/actions/category/types';
import { CategoryDetailsState } from 'app/redux/state/category';
import { Action } from 'redux';

/**
 * The initial state for the category details
 */
const initialState: CategoryDetailsState = {
	category: undefined,
	valid: false,
	dirty: false,
	saveStatus: 'IDLE'
};

/**
 * Reducer for the category details portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const categoryDetails = (state: CategoryDetailsState = initialState, action: Action): CategoryDetailsState => {
	
	switch(action.type) {

		// When the details page is started with a new category, the status is reset and the default category is loaded
		case LOAD_NEW_CATEGORY_DETAILS: {

			return {
				...state,
				saveStatus: 'IDLE',
				category: DEFAULT_CATEGORY
			};
		}
	
		// When the details page is started with an existing category, the status is reset and the given category is loaded
		case LOAD_CATEGORY_DETAILS: {

			const loadCategoryAction = action as LoadCategoryDetailsAction;
			
			return {
				...state,
				saveStatus: 'IDLE',
				category: loadCategoryAction.category
			};
		}
	
		// When the form status changes, the corresponding state fields are set
		case SET_CATEGORY_FORM_STATUS: {

			const setCategoryFormStatusAction = action as SetCategoryFormStatusAction;
			
			return {
				...state,
				valid: setCategoryFormStatusAction.valid,
				dirty: setCategoryFormStatusAction.dirty
			};
		}

		// When the category save is requested, the status changes (e.g. allows header save button to notify the form about the request)
		case REQUEST_CATEGORY_SAVE: {

			return {
				...state,
				saveStatus: 'REQUESTED'
			};
		}
	
		// When the app starts saving a category, the status changes to show the loading indicator
		case START_SAVING_CATEGORY: {

			const startSavingCategoryAction = action as StartSavingCategoryAction;

			return {
				...state,
				category: startSavingCategoryAction.category,
				saveStatus: 'SAVING'
			};
		}
	
		// When the app requires a confirmation before saving a category, the status changes to show the alert
		case ASK_CONFIRMATION_BEFORE_SAVING_CATEGORY: {

			return {
				...state,
				saveStatus: 'REQUIRES_CONFIRMATION'
			};
		}
	
		// When the app completes the save process, the status changes (at this point a navigation back to the list is expected)
		case COMPLETE_SAVING_CATEGORY: {

			return {
				...state,
				saveStatus: 'SAVED'
			};
		}
	
		// When the app fails to save a category, the status is reset (an error is shown by the global handler)
		case FAIL_SAVING_CATEGORY: {

			return {
				...state,
				saveStatus: 'IDLE'
			};
		}

		default:
			return state;
	}
};
