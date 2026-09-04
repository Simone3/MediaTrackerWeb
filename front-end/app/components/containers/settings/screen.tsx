import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { SettingsScreenComponent, SettingsScreenComponentInput, SettingsScreenComponentOutput } from 'app/components/presentational/settings/screen';
import { logUserOut } from 'app/redux/actions/user/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { AppScreens } from 'app/utilities/screens';

const selectInput = (state: State): SettingsScreenComponentInput => {
	return {
		isLoading: state.userOperations.logoutStatus === 'IN_PROGRESS',
		user: state.userGlobal.user
	};
};

const buildOutput = (dispatch: Dispatch): SettingsScreenComponentOutput => {
	return {
		logout: () => {
			dispatch(logUserOut());
		},
		openCredits: () => {
			navigationService.navigate(AppScreens.Credits);
		}
	};
};

/**
 * Container component that handles Redux state for SettingsScreenComponent
 * @returns the connected settings screen
 */
export const UserSettingsScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <SettingsScreenComponent {...input} {...output} />;
};
