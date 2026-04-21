import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticatedNavigator } from 'app/components/containers/navigation/authenticated-navigator';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

jest.mock('app/components/containers/navigation/media-navigator', () => {
	return {
		MediaNavigator: () => {
			return <div>Media section</div>;
		}
	};
});

jest.mock('app/components/containers/navigation/settings-navigator', () => {
	return {
		SettingsNavigator: () => {
			return <div>Settings section</div>;
		}
	};
});

describe('AuthenticatedNavigator', () => {
	test('renders the media section for media routes', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.MediaItemsList) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByText('Media section')).toBeInTheDocument();
	});

	test('renders the settings section for settings routes', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.Settings) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByText('Settings section')).toBeInTheDocument();
	});

	test('redirects unknown authenticated routes to the home screen', () => {
		render(
			<MemoryRouter initialEntries={[ '/app/unknown' ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByText('Media section')).toBeInTheDocument();
	});
});
