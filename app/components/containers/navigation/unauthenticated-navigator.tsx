import { createStackNavigator } from '@react-navigation/stack';
import { UserLoginScreenContainer } from 'app/components/containers/auth/login';
import { UserSignupScreenContainer } from 'app/components/containers/auth/signup';
import { defaultScreenOptions } from 'app/components/containers/navigation/global';
import { AppScreens } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';

const UnauthenticatedStack = createStackNavigator();

/**
 * The navigator for the unauthenticated section of the app
 */
export class UnauthenticatedNavigator extends Component {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<UnauthenticatedStack.Navigator
				initialRouteName={AppScreens.UserLogin}
				screenOptions={defaultScreenOptions}>
				<UnauthenticatedStack.Screen
					name={AppScreens.UserLogin}
					component={UserLoginScreenContainer}
					options={{
						headerShown: false
					}}
				/>
				<UnauthenticatedStack.Screen
					name={AppScreens.UserSignup}
					component={UserSignupScreenContainer}
					options={{
						headerShown: false
					}}
				/>
			</UnauthenticatedStack.Navigator>
		);
	}
}
