import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserSignupScreenComponent } from 'app/components/presentational/auth/signup/screen';

describe('UserSignupScreenComponent', () => {
	test('submits credentials after user input', async() => {
		const signup = jest.fn();
		const { unmount } = render(
			<UserSignupScreenComponent
				isLoading={false}
				signup={signup}
			/>
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		const user = userEvent.setup();
		const emailInput = screen.getByPlaceholderText('E-mail');
		const passwordInput = screen.getByPlaceholderText('Password');
		const submitButton = screen.getByRole('button', { name: 'Signup' });

		expect(submitButton).toBeDisabled();

		await user.type(emailInput, 'test@test.test');
		await user.type(passwordInput, '123456');
		await user.click(submitButton);

		expect(signup).toHaveBeenCalledTimes(1);
		expect(signup).toHaveBeenCalledWith({
			email: 'test@test.test',
			password: '123456'
		});

		unmount();
		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
