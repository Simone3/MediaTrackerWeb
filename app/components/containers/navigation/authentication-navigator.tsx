import { AuthLoadingScreenContainer } from 'app/components/containers/auth/loading';
import { AuthenticatedNavigator } from 'app/components/containers/navigation/authenticated-navigator';
import { UnauthenticatedNavigator } from 'app/components/containers/navigation/unauthenticated-navigator';
import { State } from 'app/redux/state/state';
import { UserStatus } from 'app/redux/state/user';
import { Component, ReactNode } from 'react';
import { connect } from 'react-redux';

/**
 * The navigator to switch between unauthenticated and authenticated flows
 */
class AuthenticationNavigator extends Component<AuthenticationNavigatorProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			userStatus
		} = this.props;

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
	}
}

/**
 * AuthenticationSwitchNavigator's props
 */
type AuthenticationNavigatorProps = {
	userStatus: UserStatus;
}

const mapStateToProps = (state: State): AuthenticationNavigatorProps => {
	return {
		userStatus: state.userGlobal.status
	};
};

/**
 * The navigator to switch between unauthenticated and authenticated flows (connected via Redux)
 */
export const ConnectedAuthenticationNavigator = connect(
	mapStateToProps
)(AuthenticationNavigator);
