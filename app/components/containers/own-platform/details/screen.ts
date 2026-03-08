import { OwnPlatformDetailsScreenComponent, OwnPlatformDetailsScreenComponentInput } from 'app/components/presentational/own-platform/details/screen';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State): OwnPlatformDetailsScreenComponentInput => {
	
	return {
		isLoading: state.ownPlatformDetails.saveStatus === 'SAVING'
	};
};

/**
 * Container component that handles Redux state for OwnPlatformDetailsScreenComponent
 */
export const OwnPlatformDetailsScreenContainer = connect(
	mapStateToProps,
	null
)(OwnPlatformDetailsScreenComponent);
