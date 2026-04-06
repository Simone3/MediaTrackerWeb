import { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CreditsNavigator } from 'app/components/containers/navigation/credits-navigator';
import { UserSettingsScreenContainer } from 'app/components/containers/settings/screen';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

const settingsPath = screenToPath(AppScreens.Settings);

/**
 * Converts an absolute settings screen path into a path relative to the settings section route.
 * @param screen the app screen
 * @returns the settings-relative route path
 */
const settingsRelativePath = (screen: string): string => {
	return screenToPath(screen).replace(`${settingsPath}/`, '');
};

/**
 * The navigator for the settings section of the app
 */
export class SettingsNavigator extends Component {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<Routes>
				<Route index={true} element={<UserSettingsScreenContainer />} />
				<Route path={`${settingsRelativePath(AppScreens.Credits)}/*`} element={<CreditsNavigator />} />
				<Route path='*' element={<Navigate to='.' replace={true} />} />
			</Routes>
		);
	}
}
