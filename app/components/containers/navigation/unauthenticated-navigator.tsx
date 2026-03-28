import { UserLoginScreenContainer } from 'app/components/containers/auth/login';
import { UserSignupScreenContainer } from 'app/components/containers/auth/signup';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';
import { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * The navigator for the unauthenticated section of the app
 */
export class UnauthenticatedNavigator extends Component {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<Routes>
				<Route path={screenToPath(AppScreens.UserLogin)} element={<UserLoginScreenContainer />} />
				<Route path={screenToPath(AppScreens.UserSignup)} element={<UserSignupScreenContainer />} />
				<Route path='*' element={<Navigate to={screenToPath(AppScreens.UserLogin)} replace={true} />} />
			</Routes>
		);
	}
}
