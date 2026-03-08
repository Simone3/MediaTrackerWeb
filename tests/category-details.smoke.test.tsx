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
		const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

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

		await waitFor(() => {
			expect(confirmSpy).toHaveBeenCalledTimes(1);
			expect(saveCategory).toHaveBeenCalledWith(category, true);
		});

		confirmSpy.mockRestore();
	});
});
