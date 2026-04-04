import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CategoriesListComponent, CategoriesListComponentInput, CategoriesListComponentOutput } from 'app/components/presentational/category/list/list';
import { deleteCategory, highlightCategory, loadCategoryDetails, removeCategoryHighlight, selectCategory } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';

const mapStateToProps = (state: State): CategoriesListComponentInput => {
	const categories = state.categoriesList.categories;
	const status = state.categoriesList.status;

	return {
		categories: categories,
		highlightedCategory: state.categoriesList.highlightedCategory,
		showEmptyState: status === 'FETCHED' && categories.length === 0,
		showSkeletons: categories.length === 0 && (status === 'REQUIRES_FETCH' || status === 'FETCHING')
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CategoriesListComponentOutput => {
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
 */
export const CategoriesListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoriesListComponent);
