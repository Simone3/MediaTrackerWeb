import { PlaceholderScreenComponent } from 'app/components/presentational/generic/placeholder-screen';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

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
				<Route
					path={screenToPath(AppScreens.Settings)}
					element={<PlaceholderScreenComponent title={i18n.t('settings.screen.title')} message='TODO phase2: settings migration in progress.' />} />
				<Route path='*' element={<Navigate to={screenToPath(AppScreens.Settings)} replace={true} />} />
			</Routes>
		);
	}
}
