import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CategoryDetailsScreenComponent } from 'app/components/presentational/category/details/screen';
import { config } from 'app/config/config';
import { CategoryInternal, DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

describe('CategoryDetailsScreenComponent', () => {
	test('submits a valid category from form input', async() => {
		const saveCategory = jest.fn();
		const notifyFormStatus = jest.fn();
		const selectedColor = config.ui.colors.availableCategoryColors[1];
		render(
			<MemoryRouter>
				<CategoryDetailsScreenComponent
					isLoading={false}
					category={DEFAULT_CATEGORY}
					sameNameConfirmationRequested={false}
					saveCategory={saveCategory}
					notifyFormStatus={notifyFormStatus}
				/>
			</MemoryRouter>
		);

		expect(document.querySelector('input[type="color"]')).not.toBeInTheDocument();
		expect(screen.getByText(i18n.t('category.details.subtitle.new'))).toBeInTheDocument();
		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('category.details.placeholders.name'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await waitFor(() => {
			expect(saveButton).toBeDisabled();
		});

		await user.type(nameInput, 'Sci-Fi');
		await user.click(screen.getByRole('button', { name: i18n.t('category.mediaTypes.MOVIE') }));
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.selectColor', { color: selectedColor }) }));
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
	});

	test('asks confirmation and retries save when same-name warning is requested', async() => {
		const saveCategory = jest.fn();
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			color: config.ui.colors.availableCategoryColors[0],
			mediaType: 'BOOK'
		};

		const { rerender } = render(
			<MemoryRouter>
				<CategoryDetailsScreenComponent
					isLoading={false}
					category={category}
					sameNameConfirmationRequested={false}
					saveCategory={saveCategory}
					notifyFormStatus={jest.fn()}
				/>
			</MemoryRouter>
		);

		rerender(
			<MemoryRouter>
				<CategoryDetailsScreenComponent
					isLoading={false}
					category={category}
					sameNameConfirmationRequested={true}
					saveCategory={saveCategory}
					notifyFormStatus={jest.fn()}
				/>
			</MemoryRouter>
		);

		const user = userEvent.setup();
		await waitFor(() => {
			expect(screen.getByRole('button', { name: i18n.t('common.buttons.save') })).toBeEnabled();
		});
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		await waitFor(() => {
			expect(saveCategory).toHaveBeenCalledWith(category, true);
		});
	});

	test('keeps media type locked when editing an existing category', async() => {
		const saveCategory = jest.fn();
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			color: config.ui.colors.availableCategoryColors[0],
			mediaType: 'BOOK'
		};

		render(
			<MemoryRouter>
				<CategoryDetailsScreenComponent
					isLoading={false}
					category={category}
					sameNameConfirmationRequested={false}
					saveCategory={saveCategory}
					notifyFormStatus={jest.fn()}
				/>
			</MemoryRouter>
		);

		expect(screen.getByText(i18n.t('category.details.subtitle.existing'))).toBeInTheDocument();
		const user = userEvent.setup();
		const movieButton = screen.getByRole('button', { name: i18n.t('category.mediaTypes.MOVIE') });
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		expect(movieButton).toBeDisabled();
		await waitFor(() => {
			expect(saveButton).toBeEnabled();
		});

		await user.click(saveButton);

		expect(saveCategory).toHaveBeenCalledWith(category, false);
	});
});
