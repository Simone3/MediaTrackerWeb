import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsScreenComponent } from 'app/components/presentational/settings/screen';

describe('SettingsScreenComponent', () => {
	test('supports logout confirmation flow', async() => {
		const logout = jest.fn();

		const { unmount } = render(
			<SettingsScreenComponent
				user={{
					id: 'user-id',
					email: 'test@example.com'
				}}
				isLoading={false}
				logout={logout}
			/>
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: /Logout/i }));
		await user.click(screen.getByRole('button', { name: 'OK' }));
		expect(logout).toHaveBeenCalledTimes(1);

		unmount();
		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
