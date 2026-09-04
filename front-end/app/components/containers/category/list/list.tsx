import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { CategoriesListComponent, CategoriesListComponentInput, CategoriesListComponentOutput } from 'app/components/presentational/category/list/list';
import { deleteCategory, highlightCategory, loadCategoryDetails, removeCategoryHighlight, selectCategory } from 'app/redux/actions/category/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): CategoriesListComponentInput => {
	const categories = state.categoriesList.categories;
	const status = state.categoriesList.status;

	return {
		categories: categories,
		highlightedCategory: state.categoriesList.highlightedCategory,
		showEmptyState: status === 'FETCHED' && categories.length === 0,
		showSkeletons: categories.length === 0 && (status === 'REQUIRES_FETCH' || status === 'FETCHING')
	};
};

const buildOutput = (dispatch: Dispatch): CategoriesListComponentOutput => {
	return {
		selectCategory: (category) => {
			dispatch(selectCategory(category));
		},
		highlightCategory: (category) => {
			dispatch(highlightCategory(category));
		},
		editCategory: (category) => {
			dispatch(loadCategoryDetails(category));
		},
		deleteCategory: (category) => {
			dispatch(deleteCategory(category));
		},
		closeCategoryMenu: () => {
			dispatch(removeCategoryHighlight());
		}
	};
};

/**
 * Container component that handles Redux state for CategoriesListComponent
 * @returns the connected categories list
 */
export const CategoriesListContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <CategoriesListComponent {...input} {...output} />;
};
