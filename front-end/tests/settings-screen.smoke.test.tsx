import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsScreenComponent } from 'app/components/presentational/settings/screen';
import { i18n } from 'app/utilities/i18n';

describe('SettingsScreenComponent', () => {
	test('supports logout confirmation flow', async() => {
		const logout = jest.fn();

		render(
			<MemoryRouter>
				<SettingsScreenComponent
					user={{
						id: 'user-id',
						email: 'test@example.com'
					}}
					isLoading={false}
					logout={logout}
					openCredits={jest.fn()}
				/>
			</MemoryRouter>
		);

		expect(screen.getByText(i18n.t('settings.screen.subtitle'))).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', {
			name: `${i18n.t('settings.screen.rows.logout.title')} ${i18n.t('settings.screen.rows.logout.subtitle', { username: 'test@example.com' })}`
		}));
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));
		expect(logout).toHaveBeenCalledTimes(1);
	});

	test('opens the credits row from settings', async() => {
		const openCredits = jest.fn();

		render(
			<MemoryRouter>
				<SettingsScreenComponent
					user={{
						id: 'user-id',
						email: 'test@example.com'
					}}
					isLoading={false}
					logout={jest.fn()}
					openCredits={openCredits}
				/>
			</MemoryRouter>
		);

		expect(screen.getByText(i18n.t('settings.screen.subtitle'))).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', {
			name: `${i18n.t('settings.screen.rows.credits.title')} ${i18n.t('settings.screen.rows.credits.subtitle')}`
		}));
		expect(openCredits).toHaveBeenCalledTimes(1);
	});
});
