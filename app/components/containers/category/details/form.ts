
import { CategoryFormComponent, CategoryFormComponentInput, CategoryFormComponentOutput } from 'app/components/presentational/category/details/form/wrapper';
import { AppError } from 'app/data/models/internal/error';
import { saveCategory, setCategoryFormStatus } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): CategoryFormComponentInput => {
	
	if(!state.categoryDetails.category) {

		throw AppError.GENERIC.withDetails('App navigated to the details screen with undefined details');
	}
	
	return {
		initialValues: state.categoryDetails.category,
		saveRequested: state.categoryDetails.saveStatus === 'REQUESTED',
		sameNameConfirmationRequested: state.categoryDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): CategoryFormComponentOutput => {

	return {
		saveCategory: (category, confirmSameName) => {
			dispatch(saveCategory(category, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setCategoryFormStatus(valid, dirty));
		}
	};
};

/**
 * Container component that handles Redux state for CategoryFormComponent
 */
export const CategoryFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoryFormComponent);
