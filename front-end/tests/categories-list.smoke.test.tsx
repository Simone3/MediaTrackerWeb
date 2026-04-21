import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config } from 'app/config/config';
import { CategoriesListComponent } from 'app/components/presentational/category/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

describe('CategoriesListComponent', () => {
	test('handles category selection', async() => {
		const categories: CategoryInternal[] = [
			{
				id: '1',
				name: 'My Books',
				mediaType: 'BOOK',
				color: config.ui.colors.availableCategoryColors[0]
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
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.optionsFor', { name: categories[0].name }) }));

		expect(selectCategory).toHaveBeenCalledWith(categories[0]);
		expect(highlightCategory).toHaveBeenCalledWith(categories[0]);
		expect(screen.queryByText(i18n.t('category.mediaTypes.BOOK'))).not.toBeInTheDocument();
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

		expect(screen.queryByText(i18n.t('category.list.empty'))).not.toBeInTheDocument();
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

		expect(screen.getByText(i18n.t('category.list.empty'))).toBeInTheDocument();
		expect(container.querySelectorAll('.categories-list-skeleton-row')).toHaveLength(0);
	});
});
