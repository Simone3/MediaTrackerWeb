import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticatedNavigator } from 'app/components/containers/navigation/authenticated-navigator';
import { i18n } from 'app/utilities/i18n';
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
	test('shows home and settings utility controls for nested media routes', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.MediaItemsList) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByRole('navigation', { name: i18n.t('common.drawer.navigation') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.home') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toBeInTheDocument();
		expect(screen.getByText('Media section')).toBeInTheDocument();
	});

	test('hides the home shortcut on the categories home screen', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.CategoriesList) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.queryByRole('link', { name: i18n.t('common.drawer.home') })).not.toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toBeInTheDocument();
	});

	test('marks the settings shortcut active on settings routes', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.Settings) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByRole('link', { name: i18n.t('common.drawer.home') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toHaveClass('app-shell-utility-link-active');
		expect(screen.getByText('Settings section')).toBeInTheDocument();
	});
});
