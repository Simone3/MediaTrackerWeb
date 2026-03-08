import { createStackNavigator } from '@react-navigation/stack';
import { AuthLoadingScreenContainer } from 'app/components/containers/auth/loading';
import { AuthenticatedNavigator } from 'app/components/containers/navigation/authenticated-navigator';
import { UnauthenticatedNavigator } from 'app/components/containers/navigation/unauthenticated-navigator';
import { State } from 'app/redux/state/state';
import { UserStatus } from 'app/redux/state/user';
import { AppScreens, AppSections } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';

const AuthStack = createStackNavigator();

/**
 * The navigator to switch between unauthenticated and authenticated flows
 */
class AuthenticationNavigator extends Component<AuthenticationNavigatorProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<AuthStack.Navigator>{this.conditionalChildRender()}</AuthStack.Navigator>
		);
	}

	/**
	 * Helper to conditionally render a single authentication screen
	 * @returns the screen to render
	 */
	private conditionalChildRender(): ReactNode {

		const {
			userStatus
		} = this.props;
		
		if(userStatus === 'REQUIRES_CHECK') {
	
			return (
				<AuthStack.Screen
					name={AppScreens.AuthLoading}
					component={AuthLoadingScreenContainer}
					options={{
						headerShown: false
					}}
				/>
			);
		}
		else if(userStatus === 'UNAUTHENTICATED') {
	
			return (
				<AuthStack.Screen
					name={AppSections.Unauthenticated}
					component={UnauthenticatedNavigator}
					options={{
						headerShown: false
					}}
				/>
			);
		}
		else if(userStatus === 'AUTHENTICATED') {
	
			return (
				<AuthStack.Screen
					name={AppSections.Authenticated}
					component={AuthenticatedNavigator}
					options={{
						headerShown: false
					}}
				/>
			);
		}
		else {
	
			throw Error('Unhandled user status');
		}
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

