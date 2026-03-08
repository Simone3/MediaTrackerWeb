import { CategoryInternal } from 'app/data/models/internal/category';
import { Action } from 'redux';

/**
 * The fetch categories action
 */
export type FetchCategoriesAction = Action & {
	
};

/**
 * The start fetching categories action
 */
export type StartFetchingCategoriesAction = Action & {
	
};

/**
 * The complete fetching categories action
 */
export type CompleteFetchingCategoriesAction = Action & {
	
	categories: CategoryInternal[];
};

/**
 * The fail fetching categories action
 */
export type FailFetchingCategoriesAction = Action & {
	
};

/**
 * The invalidate categories action
 */
export type InvalidateCategoriesAction = Action & {
	
};

/**
 * The load new category action
 */
export type LoadNewCategoryDetailsAction = Action & {
	
};

/**
 * The load existing category action
 */
export type LoadCategoryDetailsAction = Action & {
	
	category: CategoryInternal;
};

/**
 * The set category form status action
 */
export type SetCategoryFormStatusAction = Action & {
	
	valid: boolean;
	dirty: boolean;
};

/**
 * The request category save action
 */
export type RequestCategorySaveAction = Action & {
	
};

/**
 * The save category action
 */
export type SaveCategoryAction = Action & {
	
	category: CategoryInternal;
	confirmSameName: boolean;
};

/**
 * The start saving category action
 */
export type StartSavingCategoryAction = Action & {
	
	category: CategoryInternal;
};

/**
 * The ask confirmation before saving category action
 */
export type AskConfirmationBeforeSavingCategoryAction = Action & {
	
};

/**
 * The complete saving category action
 */
export type CompleteSavingCategoryAction = Action & {
	
};

/**
 * The fail saving category action
 */
export type FailSavingCategoryAction = Action & {
	
};

/**
 * The delete category action
 */
export type DeleteCategoryAction = Action & {
	
	category: CategoryInternal;
};

/**
 * The start deleting category action
 */
export type StartDeletingCategoryAction = Action & {
	
};

/**
 * The complete deleting category action
 */
export type CompleteDeletingCategoryAction = Action & {
	
};

/**
 * The fail deleting category action
 */
export type FailDeletingCategoryAction = Action & {
	
};

/**
 * The highlight category action
 */
export type HighlightCategoryAction = Action & {
	
	category: CategoryInternal;
};

/**
 * The remove category highlight action
 */
export type RemoveCategoryHighlightAction = Action & {
	
};

/**
 * The select category action
 */
export type SelectCategoryAction = Action & {
	
	category: CategoryInternal;
};
