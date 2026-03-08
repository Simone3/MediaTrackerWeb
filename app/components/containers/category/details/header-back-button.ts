import { Navigation } from 'app/components/containers/navigation/global';
import { HeaderFormExitBackComponent, HeaderFormExitBackComponentInput } from 'app/components/presentational/generic/header-form-exit-back';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: CategoryDetailsHeaderBackButtonContainerProps): HeaderFormExitBackComponentInput => {
	
	return {
		disabled: state.categoryDetails.saveStatus === 'SAVING',
		dirtyForm: state.categoryDetails.dirty,
		navigation: ownProps.navigation
	};
};

/**
 * Container component that handles Redux state for HeaderFormExitBackComponent
 */
export const CategoryDetailsHeaderBackButtonContainer = connect(
	mapStateToProps
)(HeaderFormExitBackComponent);

/**
 * CategoryDetailsHeaderBackButtonContainer's props
 */
export type CategoryDetailsHeaderBackButtonContainerProps = {
	
	/**
	 * The navigation data
	 */
	navigation: Navigation;
}

