import { CreditsNavigator } from 'app/components/containers/navigation/credits-navigator';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import creditsIcon from 'app/resources/images/ic_credits.svg';
import homeIcon from 'app/resources/images/ic_home.svg';
import settingsIcon from 'app/resources/images/ic_settings.svg';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';
import { Component, ReactNode } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

const navigationItems = [
	{
		icon: homeIcon,
		labelKey: 'common.drawer.home',
		path: screenToPath(AppSections.Media)
	},
	{
		icon: settingsIcon,
		labelKey: 'common.drawer.settings',
		path: screenToPath(AppSections.Settings)
	},
	{
		icon: creditsIcon,
		labelKey: 'common.drawer.credits',
		path: screenToPath(AppSections.Credits)
	}
];

/**
 * The navigator to switch between the main authenticated app sections via side menu
 */
export class AuthenticatedNavigator extends Component {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<div className='app-shell'>
				<aside className='app-shell-menu'>
					<div className='app-shell-rail'>
						<nav className='app-shell-nav' aria-label={i18n.t('common.drawer.navigation')}>
							{navigationItems.map((navigationItem) => {
								const label = i18n.t(navigationItem.labelKey);
								return (
									<NavLink
										key={navigationItem.path}
										to={navigationItem.path}
										title={label}
										aria-label={label}
										className={({ isActive }) => {
											return isActive ? 'app-shell-link app-shell-link-active' : 'app-shell-link';
										}}>
										<img src={navigationItem.icon} alt='' aria-hidden='true' className='app-shell-link-icon' />
										<span className='app-shell-link-label'>{label}</span>
									</NavLink>
								);
							})}
						</nav>
					</div>
				</aside>
				<main className='app-shell-content'>
					<Routes>
						<Route path={`${screenToPath(AppSections.Media)}/*`} element={<MediaNavigator />} />
						<Route path={`${screenToPath(AppSections.Settings)}/*`} element={<SettingsNavigator />} />
						<Route path={`${screenToPath(AppSections.Credits)}/*`} element={<CreditsNavigator />} />
						<Route path='*' element={<Navigate to={screenToPath(AppScreens.CategoriesList)} replace={true} />} />
					</Routes>
				</main>
			</div>
		);
	}
}
