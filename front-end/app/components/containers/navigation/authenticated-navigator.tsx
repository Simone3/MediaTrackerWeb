import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';

const homeScreenPath = screenToPath(AppScreens.CategoriesList);

/**
 * The navigator to switch between the main authenticated app sections
 * @returns the navigator
 */
export const AuthenticatedNavigator = (): ReactElement => {
	return (
		<div className='app-shell'>
			<main className='app-shell-content'>
				<Routes>
					<Route path={`${screenToPath(AppSections.Media)}/*`} element={<MediaNavigator />} />
					<Route path={`${screenToPath(AppSections.Settings)}/*`} element={<SettingsNavigator />} />
					<Route path='*' element={<Navigate to={homeScreenPath} replace={true} />} />
				</Routes>
			</main>
		</div>
	);
};
