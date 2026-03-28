import { UserSettingsScreenContainer } from 'app/components/containers/settings/screen';
import { Component, ReactNode } from 'react';
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
				<Route index={true} element={<UserSettingsScreenContainer />} />
				<Route path='*' element={<Navigate to='.' replace={true} />} />
			</Routes>
		);
	}
}
