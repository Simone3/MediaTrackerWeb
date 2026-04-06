import { ReactElement } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import homeIcon from 'app/resources/images/ic_home.svg';
import settingsIcon from 'app/resources/images/ic_settings.svg';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';

const homePath = screenToPath(AppScreens.CategoriesList);
const settingsPath = screenToPath(AppScreens.Settings);

/**
 * Shared utility navigation controls for the authenticated shell.
 * @returns the controls
 */
const AuthenticatedNavigationControls = (): ReactElement => {
	const location = useLocation();
	const homeLabel = i18n.t('common.drawer.home');
	const settingsLabel = i18n.t('common.drawer.settings');
	const showHomeLink = location.pathname !== homePath;

	return (
		<nav className='app-shell-utility-nav' aria-label={i18n.t('common.drawer.navigation')}>
			{showHomeLink &&
				<Link
					to={homePath}
					title={homeLabel}
					aria-label={homeLabel}
					className='app-shell-utility-link'>
					<img src={homeIcon} alt='' aria-hidden='true' className='app-shell-utility-link-icon' />
				</Link>}
			<NavLink
				to={settingsPath}
				title={settingsLabel}
				aria-label={settingsLabel}
				className={({ isActive }) => {
					return isActive ? 'app-shell-utility-link app-shell-utility-link-active' : 'app-shell-utility-link';
				}}>
				<img src={settingsIcon} alt='' aria-hidden='true' className='app-shell-utility-link-icon' />
			</NavLink>
		</nav>
	);
};

/**
 * The navigator to switch between the main authenticated app sections
 * @returns the navigator
 */
export const AuthenticatedNavigator = (): ReactElement => {
	return (
		<div className='app-shell'>
			<div className='app-shell-utility-bar'>
				<AuthenticatedNavigationControls />
			</div>
			<main className='app-shell-content'>
				<Routes>
					<Route path={`${screenToPath(AppSections.Media)}/*`} element={<MediaNavigator />} />
					<Route path={`${screenToPath(AppSections.Settings)}/*`} element={<SettingsNavigator />} />
					<Route path='*' element={<Navigate to={homePath} replace={true} />} />
				</Routes>
			</main>
		</div>
	);
};
