import { PlaceholderScreenComponent } from 'app/components/presentational/generic/placeholder-screen';
import { i18n } from 'app/utilities/i18n';
import React, { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * The navigator for the credits section of the app
 */
export class CreditsNavigator extends Component {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<Routes>
				<Route
					index={true}
					element={<PlaceholderScreenComponent title={i18n.t('credits.screen.title')} message='TODO phase2: credits migration in progress.' />} />
				<Route path='*' element={<Navigate to='.' replace={true} />} />
			</Routes>
		);
	}
}
