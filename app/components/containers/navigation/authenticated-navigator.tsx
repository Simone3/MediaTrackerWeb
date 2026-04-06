import { ReactElement } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import homeIcon from 'app/resources/images/ic_home.svg';
import settingsIcon from 'app/resources/images/ic_settings.svg';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';

const homeSectionPath = screenToPath(AppSections.Media);
const homeScreenPath = screenToPath(AppScreens.CategoriesList);
const settingsPath = screenToPath(AppScreens.Settings);

/**
 * Shared compact navigation controls for the authenticated shell.
 * @returns the responsive rail/header controls
 */
const AuthenticatedNavigationControls = (): ReactElement => {
	const navigationItems = [
		{
			icon: homeIcon,
			label: i18n.t('common.drawer.home'),
			path: homeSectionPath
		},
		{
			icon: settingsIcon,
			label: i18n.t('common.drawer.settings'),
			path: settingsPath
		}
	];

	return (
		<aside className='app-shell-sidebar'>
			<nav className='app-shell-nav' aria-label={i18n.t('common.drawer.navigation')}>
				{navigationItems.map((navigationItem) => {
					return (
						<NavLink
							key={navigationItem.path}
							to={navigationItem.path}
							title={navigationItem.label}
							aria-label={navigationItem.label}
							className={({ isActive }) => {
								return isActive ? 'app-shell-nav-link app-shell-nav-link-active' : 'app-shell-nav-link';
							}}>
							<img src={navigationItem.icon} alt='' aria-hidden='true' className='app-shell-nav-link-icon' />
						</NavLink>
					);
				})}
			</nav>
		</aside>
	);
};

/**
 * The navigator to switch between the main authenticated app sections
 * @returns the navigator
 */
export const AuthenticatedNavigator = (): ReactElement => {
	return (
		<div className='app-shell'>
			<AuthenticatedNavigationControls />
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
