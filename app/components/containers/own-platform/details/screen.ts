import { OwnPlatformDetailsScreenComponent, OwnPlatformDetailsScreenComponentInput, OwnPlatformDetailsScreenComponentOutput } from 'app/components/presentational/own-platform/details/screen';
import { DEFAULT_OWN_PLATFORM } from 'app/data/models/internal/own-platform';
import { saveOwnPlatform, setOwnPlatformFormStatus } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): OwnPlatformDetailsScreenComponentInput => {
	return {
		isLoading: state.ownPlatformDetails.saveStatus === 'SAVING',
		ownPlatform: state.ownPlatformDetails.ownPlatform || DEFAULT_OWN_PLATFORM,
		sameNameConfirmationRequested: state.ownPlatformDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): OwnPlatformDetailsScreenComponentOutput => {
	return {
		saveOwnPlatform: (ownPlatform, confirmSameName) => {
			dispatch(saveOwnPlatform(ownPlatform, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setOwnPlatformFormStatus(valid, dirty));
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for OwnPlatformDetailsScreenComponent
 */
export const OwnPlatformDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnPlatformDetailsScreenComponent);
