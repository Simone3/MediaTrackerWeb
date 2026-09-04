import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { CategoriesListScreenComponent, CategoriesListScreenComponentInput, CategoriesListScreenComponentOutput } from 'app/components/presentational/category/list/screen';
import { fetchCategories, loadNewCategoryDetails } from 'app/redux/actions/category/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): CategoriesListScreenComponentInput => {
	const listState = state.categoriesList;

	return {
		categoriesCount: listState.categories.length,
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH'
	};
};

const buildOutput = (dispatch: Dispatch): CategoriesListScreenComponentOutput => {
	return {
		fetchCategories: () => {
			dispatch(fetchCategories());
		},
		loadNewCategoryDetails: () => {
			dispatch(loadNewCategoryDetails());
		}
	};
};

/**
 * Container component that handles Redux state for CategoriesListScreenComponent
 * @returns the connected categories list screen
 */
export const CategoriesListScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <CategoriesListScreenComponent {...input} {...output} />;
};
