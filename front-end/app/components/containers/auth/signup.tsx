import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { UserSignupScreenComponent, UserSignupScreenComponentInput, UserSignupScreenComponentOutput } from 'app/components/presentational/auth/signup/screen';
import { signUserUp } from 'app/redux/actions/user/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): UserSignupScreenComponentInput => {
	return {
		isLoading: state.userOperations.signupStatus === 'IN_PROGRESS'
	};
};

const buildOutput = (dispatch: Dispatch): UserSignupScreenComponentOutput => {
	return {
		signup: (user) => {
			dispatch(signUserUp(user));
		}
	};
};

/**
 * Container component that handles Redux state for UserSignupScreenComponent
 * @returns the connected signup screen
 */
export const UserSignupScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <UserSignupScreenComponent {...input} {...output} />;
};
