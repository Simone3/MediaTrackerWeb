import { Navigation } from 'app/components/containers/navigation/global';
import { HeaderFormExitBackComponent, HeaderFormExitBackComponentInput } from 'app/components/presentational/generic/header-form-exit-back';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: OwnPlatformDetailsHeaderBackButtonContainerProps): HeaderFormExitBackComponentInput => {
	
	return {
		disabled: state.ownPlatformDetails.saveStatus === 'SAVING',
		dirtyForm: state.ownPlatformDetails.dirty,
		navigation: ownProps.navigation
	};
};

/**
 * Container component that handles Redux state for HeaderFormExitBackComponent
 */
export const OwnPlatformDetailsHeaderBackButtonContainer = connect(
	mapStateToProps
)(HeaderFormExitBackComponent);

/**
 * OwnPlatformDetailsHeaderBackButtonContainer's props
 */
export type OwnPlatformDetailsHeaderBackButtonContainerProps = {
	
	/**
	 * The navigation data
	 */
	navigation: Navigation;
}

