import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsScreenComponent } from 'app/components/presentational/settings/screen';
import { i18n } from 'app/utilities/i18n';

describe('SettingsScreenComponent', () => {
	test('supports logout confirmation flow', async() => {
		const logout = jest.fn();

		render(
			<SettingsScreenComponent
				user={{
					id: 'user-id',
					email: 'test@example.com'
				}}
				isLoading={false}
				logout={logout}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', {
			name: `${i18n.t('settings.screen.rows.logout.title')} ${i18n.t('settings.screen.rows.logout.subtitle', { username: 'test@example.com' })}`
		}));
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));
		expect(logout).toHaveBeenCalledTimes(1);
	});
});
