import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserLoginScreenComponent } from 'app/components/presentational/auth/login/screen';
import { i18n } from 'app/utilities/i18n';

describe('UserLoginScreenComponent', () => {
	test('submits credentials after user input', async() => {
		const login = jest.fn();
		const { unmount } = render(
			<UserLoginScreenComponent
				isLoading={false}
				login={login}
			/>
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		const user = userEvent.setup();
		const emailInput = screen.getByPlaceholderText(i18n.t('auth.login.placeholders.email'));
		const passwordInput = screen.getByPlaceholderText(i18n.t('auth.login.placeholders.password'));
		const submitButton = screen.getByRole('button', { name: i18n.t('auth.login.buttons.submit') });

		expect(submitButton).toBeDisabled();

		await user.type(emailInput, 'test@test.test');
		await user.type(passwordInput, '123456');
		await user.click(submitButton);

		expect(login).toHaveBeenCalledTimes(1);
		expect(login).toHaveBeenCalledWith({
			email: 'test@test.test',
			password: '123456'
		});

		unmount();
		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
