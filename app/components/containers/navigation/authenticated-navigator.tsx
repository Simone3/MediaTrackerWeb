import { CreditsNavigator } from 'app/components/containers/navigation/credits-navigator';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

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
					<div className='app-shell-brand'>{i18n.t('common.app.name')}</div>
					<NavLink
						to={screenToPath(AppScreens.CategoriesList)}
						className={({ isActive }) => {
							return isActive ? 'app-shell-link app-shell-link-active' : 'app-shell-link';
						}}>
						{i18n.t('common.drawer.home')}
					</NavLink>
					<NavLink
						to={screenToPath(AppScreens.Settings)}
						className={({ isActive }) => {
							return isActive ? 'app-shell-link app-shell-link-active' : 'app-shell-link';
						}}>
						{i18n.t('common.drawer.settings')}
					</NavLink>
					<NavLink
						to={screenToPath(AppScreens.Credits)}
						className={({ isActive }) => {
							return isActive ? 'app-shell-link app-shell-link-active' : 'app-shell-link';
						}}>
						{i18n.t('common.drawer.credits')}
					</NavLink>
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
