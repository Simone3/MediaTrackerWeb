import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { UserLoginScreenComponent, UserLoginScreenComponentInput, UserLoginScreenComponentOutput } from 'app/components/presentational/auth/login/screen';
import { logUserIn } from 'app/redux/actions/user/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): UserLoginScreenComponentInput => {
	return {
		isLoading: state.userOperations.loginStatus === 'IN_PROGRESS'
	};
};

const buildOutput = (dispatch: Dispatch): UserLoginScreenComponentOutput => {
	return {
		login: (user) => {
			dispatch(logUserIn(user));
		}
	};
};

/**
 * Container component that handles Redux state for UserLoginScreenComponent
 * @returns the connected login screen
 */
export const UserLoginScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <UserLoginScreenComponent {...input} {...output} />;
};
