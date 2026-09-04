import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { AuthLoadingScreenComponent, AuthLoadingScreenComponentOutput } from 'app/components/presentational/auth/loading/screen';
import { checkUserLoginStatus } from 'app/redux/actions/user/generators';
import { useContainerOutput } from 'app/redux/hooks';

const buildOutput = (dispatch: Dispatch): AuthLoadingScreenComponentOutput => {
	return {
		fetchLoginStatus: () => {
			dispatch(checkUserLoginStatus());
		}
	};
};

/**
 * Container component that handles Redux state for AuthLoadingScreenComponent
 * @returns the connected authentication loading screen
 */
export const AuthLoadingScreenContainer = (): ReactElement => {
	const output = useContainerOutput(buildOutput);

	return <AuthLoadingScreenComponent {...output} />;
};
