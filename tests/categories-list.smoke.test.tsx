import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesListComponent } from 'app/components/presentational/category/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';

describe('CategoriesListComponent', () => {
	test('handles category selection', async() => {
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

		render(
			<CategoriesListComponent
				categories={categories}
				highlightedCategory={undefined}
				showEmptyState={false}
				showSkeletons={false}
				selectCategory={selectCategory}
				highlightCategory={highlightCategory}
				editCategory={jest.fn()}
				deleteCategory={jest.fn()}
				closeCategoryMenu={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByText('My Books'));
		await user.click(screen.getByRole('button', { name: 'Options for My Books' }));

		expect(selectCategory).toHaveBeenCalledWith(categories[0]);
		expect(highlightCategory).toHaveBeenCalledWith(categories[0]);
		expect(screen.queryByText('Books')).not.toBeInTheDocument();
	});

	test('renders loading skeletons until an empty result is actually fetched', () => {
		const {
			container,
			rerender
		} = render(
			<CategoriesListComponent
				categories={[]}
				highlightedCategory={undefined}
				showEmptyState={false}
				showSkeletons={true}
				selectCategory={jest.fn()}
				highlightCategory={jest.fn()}
				editCategory={jest.fn()}
				deleteCategory={jest.fn()}
				closeCategoryMenu={jest.fn()}
			/>
		);

		expect(screen.queryByText('No categories')).not.toBeInTheDocument();
		expect(container.querySelectorAll('.categories-list-skeleton-row')).toHaveLength(4);

		rerender(
			<CategoriesListComponent
				categories={[]}
				highlightedCategory={undefined}
				showEmptyState={true}
				showSkeletons={false}
				selectCategory={jest.fn()}
				highlightCategory={jest.fn()}
				editCategory={jest.fn()}
				deleteCategory={jest.fn()}
				closeCategoryMenu={jest.fn()}
			/>
		);

		expect(screen.getByText('No categories')).toBeInTheDocument();
		expect(container.querySelectorAll('.categories-list-skeleton-row')).toHaveLength(0);
	});
});
