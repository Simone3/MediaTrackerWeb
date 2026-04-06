import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

jest.mock('app/components/containers/settings/screen', () => {
	return {
		UserSettingsScreenContainer: () => {
			return <div>Settings home</div>;
		}
	};
});

jest.mock('app/components/containers/navigation/credits-navigator', () => {
	return {
		CreditsNavigator: () => {
			return <div>Credits section</div>;
		}
	};
});

describe('SettingsNavigator', () => {
	test('renders the settings screen at the section index', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.Settings) ]}>
				<Routes>
					<Route path='/settings/*' element={<SettingsNavigator />} />
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText('Settings home')).toBeInTheDocument();
	});

	test('renders the nested credits route inside settings', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.Credits) ]}>
				<Routes>
					<Route path='/settings/*' element={<SettingsNavigator />} />
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText('Credits section')).toBeInTheDocument();
	});
});
