import { CategoryContextMenuComponent, CategoryContextMenuComponentInput, CategoryContextMenuComponentOutput } from 'app/components/presentational/category/list/context-menu';
import { deleteCategory, loadCategoryDetails, removeCategoryHighlight } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): CategoryContextMenuComponentInput => {
	
	return {
		category: state.categoriesList.highlightedCategory
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CategoryContextMenuComponentOutput => {

	return {
		delete: (category) => {
			dispatch(deleteCategory(category));
		},
		edit: (category) => {
			dispatch(loadCategoryDetails(category));
		},
		close: () => {
			dispatch(removeCategoryHighlight());
		}
	};
};

/**
 * Container component that handles Redux state for CategoryContextMenuComponent
 */
export const CategoryContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryContextMenuComponent);
