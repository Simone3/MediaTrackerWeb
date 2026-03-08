
import { OwnPlatformFormComponent, OwnPlatformFormComponentInput, OwnPlatformFormComponentOutput } from 'app/components/presentational/own-platform/details/form/wrapper';
import { AppError } from 'app/data/models/internal/error';
import { saveOwnPlatform, setOwnPlatformFormStatus } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): OwnPlatformFormComponentInput => {
	
	if(!state.ownPlatformDetails.ownPlatform) {

		throw AppError.GENERIC.withDetails('App navigated to the details screen with undefined details');
	}
	
	return {
		initialValues: state.ownPlatformDetails.ownPlatform,
		saveRequested: state.ownPlatformDetails.saveStatus === 'REQUESTED',
		sameNameConfirmationRequested: state.ownPlatformDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): OwnPlatformFormComponentOutput => {

	return {
		saveOwnPlatform: (ownPlatform, confirmSameName) => {
			dispatch(saveOwnPlatform(ownPlatform, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setOwnPlatformFormStatus(valid, dirty));
		}
	};
};

/**
 * Container component that handles Redux state for OwnPlatformFormComponent
 */
export const OwnPlatformFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnPlatformFormComponent);
