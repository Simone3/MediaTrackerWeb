import { CategoryInternal } from 'app/data/models/internal/category';
import { ASK_CONFIRMATION_BEFORE_SAVING_CATEGORY, COMPLETE_DELETING_CATEGORY, COMPLETE_FETCHING_CATEGORIES, COMPLETE_SAVING_CATEGORY, DELETE_CATEGORY, FAIL_DELETING_CATEGORY, FAIL_FETCHING_CATEGORIES, FAIL_SAVING_CATEGORY, FETCH_CATEGORIES, HIGHLIGHT_CATEGORY, INVALIDATE_CATEGORIES, LOAD_CATEGORY_DETAILS, LOAD_NEW_CATEGORY_DETAILS, REMOVE_CATEGORY_HIGHLIGHT, REQUEST_CATEGORY_SAVE, SAVE_CATEGORY, SELECT_CATEGORY, SET_CATEGORY_FORM_STATUS, START_DELETING_CATEGORY, START_FETCHING_CATEGORIES, START_SAVING_CATEGORY } from './const';
import { AskConfirmationBeforeSavingCategoryAction, CompleteDeletingCategoryAction, CompleteFetchingCategoriesAction, CompleteSavingCategoryAction, DeleteCategoryAction, FailDeletingCategoryAction, FailFetchingCategoriesAction, FailSavingCategoryAction, FetchCategoriesAction, HighlightCategoryAction, InvalidateCategoriesAction, LoadCategoryDetailsAction, LoadNewCategoryDetailsAction, RemoveCategoryHighlightAction, RequestCategorySaveAction, SaveCategoryAction, SelectCategoryAction, SetCategoryFormStatusAction, StartDeletingCategoryAction, StartFetchingCategoriesAction, StartSavingCategoryAction } from './types';

/**
 * Generator for the fetch categories list action, which causes the request categories action, the async categories fetch and then the receive categories action
 * @returns the action
 */
export const fetchCategories = (): FetchCategoriesAction => {
	
	return {
		type: FETCH_CATEGORIES
	};
};

/**
 * Generator for the start fetching categories action, which marks the start of the categories list fetching operation
 * @returns the action
 */
export const startFetchingCategories = (): StartFetchingCategoriesAction => {
	
	return {
		type: START_FETCHING_CATEGORIES
	};
};

/**
 * Generator for the complete fetching categories action, which marks the successful end of the categories list fetching operation
 * @param categories the fetched categories, possibly an empty array
 * @returns the action
 */
export const completeFetchingCategories = (categories: CategoryInternal[]): CompleteFetchingCategoriesAction => {
	
	return {
		type: COMPLETE_FETCHING_CATEGORIES,
		categories: categories
	};
};

/**
 * Generator for the fail fetching categories action, which marks the unsuccessful end of the categories list fetching operation
 * @returns the action
 */
export const failFetchingCategories = (): FailFetchingCategoriesAction => {
	
	return {
		type: FAIL_FETCHING_CATEGORIES
	};
};

/**
 * Generator for the invalidate categories action, which marks the categories list as invalid, i.e. they require a reload
 * @returns the action
 */
export const invalidateCategories = (): InvalidateCategoriesAction => {

	return {
		type: INVALIDATE_CATEGORIES
	};
};

/**
 * Generator for the load new category action, which resets the category details state to the initial values
 * @returns the action
 */
export const loadNewCategoryDetails = (): LoadNewCategoryDetailsAction => {
	
	return {
		type: LOAD_NEW_CATEGORY_DETAILS
	};
};

/**
 * Generator for the load existing category action, which sets the category details state
 * @param category the category data
 * @returns the action
 */
export const loadCategoryDetails = (category: CategoryInternal): LoadCategoryDetailsAction => {
	
	return {
		type: LOAD_CATEGORY_DETAILS,
		category: category
	};
};

/**
 * Generator for the set category form status, which sets the current status of the category details form
 * @param valid true if the form is currently valid (no validation errors)
 * @param dirty true if the form is currently dirty (one or more fields changed)
 * @returns the action
 */
export const setCategoryFormStatus = (valid: boolean, dirty: boolean): SetCategoryFormStatusAction => {
	
	return {
		type: SET_CATEGORY_FORM_STATUS,
		valid: valid,
		dirty: dirty
	};
};

/**
 * Generator for the request category save action, which requests the category form validation and, if OK, submission
 * @returns the action
 */
export const requestCategorySave = (): RequestCategorySaveAction => {
	
	return {
		type: REQUEST_CATEGORY_SAVE
	};
};

/**
 * Generator for the save category action, which causes the start saving category action, the async category store and then the complete saving category action
 * @param category the category data
 * @param confirmSameName if the user confirmed to save the category even if it has the same name as an existing item
 * @returns the action
 */
export const saveCategory = (category: CategoryInternal, confirmSameName: boolean): SaveCategoryAction => {
	
	return {
		type: SAVE_CATEGORY,
		category: category,
		confirmSameName: confirmSameName
	};
};

/**
 * Generator for the start saving category action, which marks the start of the category saving operation
 * @param category the category data
 * @returns the action
 */
export const startSavingCategory = (category: CategoryInternal): StartSavingCategoryAction => {
	
	return {
		type: START_SAVING_CATEGORY,
		category: category
	};
};

/**
 * Generator for the ask confirmation before saving category action, which triggers a user pop-up to confirm a category save process (e.g. same-name check on insert)
 * @returns the action
 */
export const askConfirmationBeforeSavingCategory = (): AskConfirmationBeforeSavingCategoryAction => {
	
	return {
		type: ASK_CONFIRMATION_BEFORE_SAVING_CATEGORY
	};
};

/**
 * Generator for the complete saving category action, which marks the successful end of the category saving operation
 * @returns the action
 */
export const completeSavingCategory = (): CompleteSavingCategoryAction => {
	
	return {
		type: COMPLETE_SAVING_CATEGORY
	};
};

/**
 * Generator for the complete saving category action, which marks the unsuccessful end of the category saving operation
 * @returns the action
 */
export const failSavingCategory = (): FailSavingCategoryAction => {
	
	return {
		type: FAIL_SAVING_CATEGORY
	};
};

/**
 * Generator for the delete category action, which causes the start deleting category action, the async category removal and then the complete deleting category action
 * @param category the category data
 * @returns the action
 */
export const deleteCategory = (category: CategoryInternal): DeleteCategoryAction => {
	
	return {
		type: DELETE_CATEGORY,
		category: category
	};
};

/**
 * Generator for the start deleting category action, which marks the start of the category deleting operation
 * @returns the action
 */
export const startDeletingCategory = (): StartDeletingCategoryAction => {
	
	return {
		type: START_DELETING_CATEGORY
	};
};

/**
 * Generator for the complete deleting category action, which marks the successful end of the category deleting operation
 * @returns the action
 */
export const completeDeletingCategory = (): CompleteDeletingCategoryAction => {
	
	return {
		type: COMPLETE_DELETING_CATEGORY
	};
};

/**
 * Generator for the fail deleting category action, which marks the unsuccessful end of the category deleting operation
 * @returns the action
 */
export const failDeletingCategory = (): FailDeletingCategoryAction => {
	
	return {
		type: FAIL_DELETING_CATEGORY
	};
};

/**
 * Generator for the highlight category action, which marks a category as highlighted
 * @param category the category
 * @returns the action
 */
export const highlightCategory = (category: CategoryInternal): HighlightCategoryAction => {
	
	return {
		type: HIGHLIGHT_CATEGORY,
		category: category
	};
};

/**
 * Generator for the remove category highlight action, which removes any highlighted category
 * @returns the action
 */
export const removeCategoryHighlight = (): RemoveCategoryHighlightAction => {
	
	return {
		type: REMOVE_CATEGORY_HIGHLIGHT
	};
};

/**
 * Generator for the select category action, which sets the category into the global state to allow retrieval of the correct media items, groups, etc.
 * @param category the linked category
 * @returns the action
 */
export const selectCategory = (category: CategoryInternal): SelectCategoryAction => {
	
	return {
		type: SELECT_CATEGORY,
		category: category
	};
};
