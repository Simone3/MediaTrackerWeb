import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesListComponent } from 'app/components/presentational/category/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';

describe('CategoriesListComponent', () => {
	test('handles refresh and category selection', async() => {
		const categories: CategoryInternal[] = [
			{
				id: '1',
				name: 'My Books',
				mediaType: 'BOOK',
				color: '#3f51b5'
			}
		];

		const selectCategory = jest.fn();
		const highlightCategory = jest.fn();
		const refreshCategories = jest.fn();

		render(
			<CategoriesListComponent
				categories={categories}
				selectCategory={selectCategory}
				highlightCategory={highlightCategory}
				refreshCategories={refreshCategories}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Refresh' }));
		await user.click(screen.getByText('My Books'));
		await user.click(screen.getByRole('button', { name: 'Options for My Books' }));

		expect(refreshCategories).toHaveBeenCalledTimes(1);
		expect(selectCategory).toHaveBeenCalledWith(categories[0]);
		expect(highlightCategory).toHaveBeenCalledWith(categories[0]);
	});
});
