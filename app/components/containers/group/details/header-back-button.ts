import { Navigation } from 'app/components/containers/navigation/global';
import { HeaderFormExitBackComponent, HeaderFormExitBackComponentInput } from 'app/components/presentational/generic/header-form-exit-back';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: GroupDetailsHeaderBackButtonContainerProps): HeaderFormExitBackComponentInput => {
	
	return {
		disabled: state.groupDetails.saveStatus === 'SAVING',
		dirtyForm: state.groupDetails.dirty,
		navigation: ownProps.navigation
	};
};

/**
 * Container component that handles Redux state for HeaderFormExitBackComponent
 */
export const GroupDetailsHeaderBackButtonContainer = connect(
	mapStateToProps
)(HeaderFormExitBackComponent);

/**
 * GroupDetailsHeaderBackButtonContainer's props
 */
export type GroupDetailsHeaderBackButtonContainerProps = {
	
	/**
	 * The navigation data
	 */
	navigation: Navigation;
}

