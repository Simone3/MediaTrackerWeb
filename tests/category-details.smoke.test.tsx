import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryDetailsScreenComponent } from 'app/components/presentational/category/details/screen';
import { CategoryInternal, DEFAULT_CATEGORY } from 'app/data/models/internal/category';

describe('CategoryDetailsScreenComponent', () => {
	test('submits a valid category from form input', async() => {
		const saveCategory = jest.fn();
		const notifyFormStatus = jest.fn();

		render(
			<CategoryDetailsScreenComponent
				isLoading={false}
				category={DEFAULT_CATEGORY}
				sameNameConfirmationRequested={false}
				saveCategory={saveCategory}
				notifyFormStatus={notifyFormStatus}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		const nameInput = screen.getByRole('textbox');
		const saveButton = screen.getByRole('button', { name: 'Save' });

		expect(saveButton).toBeDisabled();

		await user.type(nameInput, 'Sci-Fi');
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(saveCategory).toHaveBeenCalledTimes(1);
		expect(saveCategory).toHaveBeenCalledWith({
			...DEFAULT_CATEGORY,
			name: 'Sci-Fi'
		}, false);
		expect(notifyFormStatus).toHaveBeenCalled();
	});

	test('asks confirmation and retries save when same-name warning is requested', async() => {
		const saveCategory = jest.fn();
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			color: '#3f51b5',
			mediaType: 'BOOK'
		};

		const { rerender } = render(
			<CategoryDetailsScreenComponent
				isLoading={false}
				category={category}
				sameNameConfirmationRequested={false}
				saveCategory={saveCategory}
				notifyFormStatus={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		rerender(
			<CategoryDetailsScreenComponent
				isLoading={false}
				category={category}
				sameNameConfirmationRequested={true}
				saveCategory={saveCategory}
				notifyFormStatus={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'OK' }));

		await waitFor(() => {
			expect(saveCategory).toHaveBeenCalledWith(category, true);
		});
	});

	test('warns before exiting with unsaved category changes', async() => {
		const goBack = jest.fn();

		render(
			<CategoryDetailsScreenComponent
				isLoading={false}
				category={DEFAULT_CATEGORY}
				sameNameConfirmationRequested={false}
				saveCategory={jest.fn()}
				notifyFormStatus={jest.fn()}
				goBack={goBack}
			/>
		);

		const user = userEvent.setup();
		await user.type(screen.getByRole('textbox'), 'Sci-Fi');
		await user.click(screen.getByRole('button', { name: 'Back' }));

		expect(screen.getByRole('dialog')).toHaveTextContent('You have unsaved changes, are you sure you want to exit?');
		expect(goBack).not.toHaveBeenCalled();

		await user.click(screen.getByRole('button', { name: 'OK' }));

		expect(goBack).toHaveBeenCalledTimes(1);
	});
});
