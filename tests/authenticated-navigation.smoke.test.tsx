import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthenticatedNavigator } from 'app/components/containers/navigation/authenticated-navigator';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';
import { MemoryRouter } from 'react-router-dom';

jest.mock('app/components/containers/navigation/media-navigator', () => ({
	MediaNavigator: () => <div>Media section</div>
}));

jest.mock('app/components/containers/navigation/settings-navigator', () => ({
	SettingsNavigator: () => <div>Settings section</div>
}));

jest.mock('app/components/containers/navigation/credits-navigator', () => ({
	CreditsNavigator: () => <div>Credits section</div>
}));

describe('AuthenticatedNavigator', () => {
	test('keeps the media icon active for nested media routes', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.MediaItemsList) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByRole('navigation', { name: i18n.t('common.drawer.navigation') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.home') })).toHaveClass('app-shell-link-active');
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.credits') })).toBeInTheDocument();
		expect(screen.getByText('Media section')).toBeInTheDocument();
	});

	test('marks the settings icon active on the settings route', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.Settings) ]}>
				<AuthenticatedNavigator />
			</MemoryRouter>
		);

		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toHaveClass('app-shell-link-active');
		expect(screen.getByText('Settings section')).toBeInTheDocument();
	});
});
