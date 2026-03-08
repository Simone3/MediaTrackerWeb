import { CategoriesListScreenComponent, CategoriesListScreenComponentInput, CategoriesListScreenComponentOutput } from 'app/components/presentational/category/list/screen';
import { fetchCategories, loadNewCategoryDetails } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): CategoriesListScreenComponentInput => {
	
	const listState = state.categoriesList;

	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CategoriesListScreenComponentOutput => {

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
 */
export const CategoriesListScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoriesListScreenComponent);
