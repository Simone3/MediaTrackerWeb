import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

describe('AuthenticatedPageHeaderComponent', () => {
	test('renders home, title/subtitle, action, and hides settings by default', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.Settings) ]}>
				<AuthenticatedPageHeaderComponent
					title='Settings'
					subtitle='Manage your account'
					actions={
						<PillButtonComponent size='compact' tone='secondary'>
							Do thing
						</PillButtonComponent>
					}
				/>
			</MemoryRouter>
		);

		expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
		expect(screen.getByText('Manage your account')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Do thing' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.home') })).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: i18n.t('common.drawer.settings') })).not.toBeInTheDocument();
	});

	test('renders the settings shortcut when explicitly enabled', () => {
		render(
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.CategoriesList) ]}>
				<AuthenticatedPageHeaderComponent
					title='Media Tracker'
					subtitle='2 categories'
					showSettingsShortcut={true}
				/>
			</MemoryRouter>
		);

		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toBeInTheDocument();
	});
});
