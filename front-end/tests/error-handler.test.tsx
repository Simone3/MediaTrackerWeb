import { render, screen } from '@testing-library/react';
import { ErrorHandlerComponent } from 'app/components/presentational/generic/error-handler';
import { AppError } from 'app/data/models/internal/error';

/**
 * Helper to render the error handler and then push an error into it, since the component reacts to prop updates
 * @param error the error to be displayed
 * @returns the text of the visible error description
 */
const renderErrorDescription = (error: AppError | string): string => {
	const clearError = jest.fn();

	const { rerender } = render(
		<ErrorHandlerComponent clearError={clearError}>
			<div>Content</div>
		</ErrorHandlerComponent>
	);

	rerender(
		<ErrorHandlerComponent error={error} clearError={clearError}>
			<div>Content</div>
		</ErrorHandlerComponent>
	);

	const alert = screen.getByRole('alert');
	const description = alert.querySelector('.error-handler-toast-description');
	return description ? description.textContent || '' : '';
};

describe('ErrorHandlerComponent', () => {
	test('shows the operation message alone when the error carries no hint', () => {
		expect(renderErrorDescription(AppError.BACKEND_CATEGORY_SAVE.withDetails('Some developer detail'))).toBe('Cannot save the category to the server');
	});

	test('appends the Firebase hint to the operation message', () => {
		const error = AppError.BACKEND_USER_SIGNUP.withDetails({
			name: 'FirebaseError',
			code: 'auth/email-already-in-use'
		});

		expect(renderErrorDescription(error)).toBe('An error occurred during signup: this email address is already registered');
	});

	test('appends the hint of the innermost error of the chain', () => {
		const error = AppError.BACKEND_CATEGORY_DELETE.withDetails(AppError.BACKEND_GENERIC_ERROR.withDetails({
			isAxiosError: true,
			response: {
				status: 500,
				data: {
					errorCode: 'db.delete.not.empty'
				}
			}
		}));

		expect(renderErrorDescription(error)).toBe('Cannot delete the category from the server: it still contains other elements');
	});

	test('interpolates the hint params', () => {
		const error = AppError.BACKEND_MEDIA_ITEM_FETCH.withDetails(AppError.BACKEND_GENERIC_ERROR.withDetails({
			isAxiosError: true,
			response: {
				status: 502,
				data: {}
			}
		}));

		expect(renderErrorDescription(error)).toBe('Cannot fetch media items from the server: the server responded with status 502');
	});

	test('shows a plain string error as it is', () => {
		expect(renderErrorDescription('Some direct message')).toBe('Some direct message');
	});
});
