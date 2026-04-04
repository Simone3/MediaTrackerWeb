import { Action } from 'redux';
import { SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { SelectCategoryAction } from 'app/redux/actions/category/types';
import { CategoryGlobalState, categoryGlobalStateInitialValue } from 'app/redux/state/category';

/**
 * Reducer for the global category portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const categoryGlobal = (state: CategoryGlobalState = categoryGlobalStateInitialValue, action: Action): CategoryGlobalState => {
	switch(action.type) {
		// When a category is selected, it is marked as such
		case SELECT_CATEGORY: {
			const selectCategoryAction = action as SelectCategoryAction;

			const category = selectCategoryAction.category;

			return {
				...categoryGlobalStateInitialValue,
				selectedCategory: category
			};
		}

		default:
			return state;
	}
};
