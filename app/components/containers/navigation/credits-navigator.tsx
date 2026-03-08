import { CreditsScreenContainer } from 'app/components/containers/credits/screen';
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
				<Route index={true} element={<CreditsScreenContainer />} />
				<Route path='*' element={<Navigate to='.' replace={true} />} />
			</Routes>
		);
	}
}
