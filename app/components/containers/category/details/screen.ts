import { CategoryDetailsScreenComponent, CategoryDetailsScreenComponentInput, CategoryDetailsScreenComponentOutput } from 'app/components/presentational/category/details/screen';
import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { saveCategory, setCategoryFormStatus } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): CategoryDetailsScreenComponentInput => {
	return {
		isLoading: state.categoryDetails.saveStatus === 'SAVING',
		category: state.categoryDetails.category || DEFAULT_CATEGORY,
		sameNameConfirmationRequested: state.categoryDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CategoryDetailsScreenComponentOutput => {
	return {
		saveCategory: (category, confirmSameName) => {
			dispatch(saveCategory(category, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setCategoryFormStatus(valid, dirty));
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for CategoryDetailsScreenComponent
 */
export const CategoryDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryDetailsScreenComponent);
