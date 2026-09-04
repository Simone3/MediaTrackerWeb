import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { OwnPlatformDetailsScreenComponent, OwnPlatformDetailsScreenComponentInput, OwnPlatformDetailsScreenComponentOutput } from 'app/components/presentational/own-platform/details/screen';
import { DEFAULT_OWN_PLATFORM } from 'app/data/models/internal/own-platform';
import { saveOwnPlatform, setOwnPlatformFormStatus } from 'app/redux/actions/own-platform/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const selectInput = (state: State): OwnPlatformDetailsScreenComponentInput => {
	return {
		isLoading: state.ownPlatformDetails.saveStatus === 'SAVING',
		ownPlatform: state.ownPlatformDetails.ownPlatform || DEFAULT_OWN_PLATFORM,
		sameNameConfirmationRequested: state.ownPlatformDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const buildOutput = (dispatch: Dispatch): OwnPlatformDetailsScreenComponentOutput => {
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
 * @returns the connected own platform details screen
 */
export const OwnPlatformDetailsScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <OwnPlatformDetailsScreenComponent {...input} {...output} />;
};
