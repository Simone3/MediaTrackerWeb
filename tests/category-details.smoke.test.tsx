import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryDetailsScreenComponent } from 'app/components/presentational/category/details/screen';
import { config } from 'app/config/config';
import { CategoryInternal, DEFAULT_CATEGORY } from 'app/data/models/internal/category';

describe('CategoryDetailsScreenComponent', () => {
	test('submits a valid category from form input', async() => {
		const saveCategory = jest.fn();
		const notifyFormStatus = jest.fn();
		const selectedColor = config.ui.colors.availableCategoryColors[1];
		const { unmount } = render(
			<CategoryDetailsScreenComponent
				isLoading={false}
				category={DEFAULT_CATEGORY}
				sameNameConfirmationRequested={false}
				saveCategory={saveCategory}
				notifyFormStatus={notifyFormStatus}
			/>
		);

		expect(document.body).toHaveClass('categories-screen-active');
		expect(document.querySelector('input[type="color"]')).not.toBeInTheDocument();
		const user = userEvent.setup();
		const nameInput = screen.getByRole('textbox');
		const saveButton = screen.getByRole('button', { name: 'Save' });

		expect(saveButton).toBeDisabled();

		await user.type(nameInput, 'Sci-Fi');
		await user.click(screen.getByRole('button', { name: 'Movies' }));
		await user.click(screen.getByRole('button', { name: `Select color ${selectedColor}` }));
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(saveCategory).toHaveBeenCalledTimes(1);
		expect(saveCategory).toHaveBeenCalledWith({
			...DEFAULT_CATEGORY,
			name: 'Sci-Fi',
			mediaType: 'MOVIE',
			color: selectedColor
		}, false);
		expect(notifyFormStatus).toHaveBeenCalled();

		unmount();
		expect(document.body).not.toHaveClass('categories-screen-active');
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
			/>
		);

		rerender(
			<CategoryDetailsScreenComponent
				isLoading={false}
				category={category}
				sameNameConfirmationRequested={true}
				saveCategory={saveCategory}
				notifyFormStatus={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'OK' }));

		await waitFor(() => {
			expect(saveCategory).toHaveBeenCalledWith(category, true);
		});
	});
});
