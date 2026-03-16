import { CategoriesListComponent, CategoriesListComponentInput, CategoriesListComponentOutput } from 'app/components/presentational/category/list/list';
import { deleteCategory, highlightCategory, loadCategoryDetails, removeCategoryHighlight, selectCategory } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): CategoriesListComponentInput => {
	return {
		categories: state.categoriesList.categories,
		highlightedCategory: state.categoriesList.highlightedCategory
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
