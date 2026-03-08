import { PlaceholderScreenComponent } from 'app/components/presentational/generic/placeholder-screen';
import { i18n } from 'app/utilities/i18n';
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
					index={true}
					element={<PlaceholderScreenComponent title={i18n.t('settings.screen.title')} message='TODO phase2: settings migration in progress.' />} />
				<Route path='*' element={<Navigate to='.' replace={true} />} />
			</Routes>
		);
	}
}
