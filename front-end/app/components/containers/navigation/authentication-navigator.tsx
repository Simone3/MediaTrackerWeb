import { ReactElement } from 'react';
import { AuthLoadingScreenContainer } from 'app/components/containers/auth/loading';
import { AuthenticatedNavigator } from 'app/components/containers/navigation/authenticated-navigator';
import { UnauthenticatedNavigator } from 'app/components/containers/navigation/unauthenticated-navigator';
import { useContainerInput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { UserStatus } from 'app/redux/state/user';

/**
 * AuthenticationNavigator's input props
 */
type AuthenticationNavigatorInput = {
	userStatus: UserStatus;
};

const selectInput = (state: State): AuthenticationNavigatorInput => {
	return {
		userStatus: state.userGlobal.status
	};
};

/**
 * The navigator to switch between unauthenticated and authenticated flows (connected via Redux)
 * @returns the navigator matching the current user status
 */
export const ConnectedAuthenticationNavigator = (): ReactElement => {
	const {
		userStatus
	} = useContainerInput(selectInput);

	if(userStatus === 'REQUIRES_CHECK') {
		return <AuthLoadingScreenContainer />;
	}
	if(userStatus === 'UNAUTHENTICATED') {
		return <UnauthenticatedNavigator />;
	}
	if(userStatus === 'AUTHENTICATED') {
		return <AuthenticatedNavigator />;
	}
	throw Error('Unhandled user status');
};
