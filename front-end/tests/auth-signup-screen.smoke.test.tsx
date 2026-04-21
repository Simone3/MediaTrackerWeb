import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserSignupScreenComponent } from 'app/components/presentational/auth/signup/screen';
import { i18n } from 'app/utilities/i18n';

describe('UserSignupScreenComponent', () => {
	test('submits credentials after user input', async() => {
		const signup = jest.fn();
		render(
			<UserSignupScreenComponent
				isLoading={false}
				signup={signup}
			/>
		);

		const user = userEvent.setup();
		const emailInput = screen.getByPlaceholderText(i18n.t('auth.signup.placeholders.email'));
		const passwordInput = screen.getByPlaceholderText(i18n.t('auth.signup.placeholders.password'));
		const submitButton = screen.getByRole('button', { name: i18n.t('auth.signup.buttons.submit') });

		expect(submitButton).toBeDisabled();

		await user.type(emailInput, 'test@test.test');
		await user.type(passwordInput, '123456');
		await user.click(submitButton);

		expect(signup).toHaveBeenCalledTimes(1);
		expect(signup).toHaveBeenCalledWith({
			email: 'test@test.test',
			password: '123456'
		});
	});
});
