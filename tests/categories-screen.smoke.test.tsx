import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesListScreenComponent } from 'app/components/presentational/category/list/screen';
import { i18n } from 'app/utilities/i18n';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

type CategoriesScreenTestState = {
	categoriesList: {
		categories: {
			id: string;
			name: string;
			mediaType: 'BOOK' | 'MOVIE' | 'TV_SHOW' | 'VIDEOGAME';
			color: string;
		}[];
		status: string;
		highlightedCategory: undefined;
	};
};

describe('CategoriesListScreenComponent', () => {
	const originalInnerWidth = window.innerWidth;

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			value: originalInnerWidth,
			writable: true
		});
	});

	test('uses the header add button on desktop', async() => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			value: 1200,
			writable: true
		});

		const loadNewCategoryDetails = jest.fn();
		const fetchCategories = jest.fn();
		const store = createStore((state: CategoriesScreenTestState = {
			categoriesList: {
				categories: [],
				status: 'FETCHED',
				highlightedCategory: undefined
			}
		}) => {
			return state;
		});

		render(
			<Provider store={store}>
				<CategoriesListScreenComponent
					categoriesCount={0}
					isLoading={false}
					requiresFetch={false}
					fetchCategories={fetchCategories}
					loadNewCategoryDetails={loadNewCategoryDetails}
				/>
			</Provider>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: `+ ${i18n.t('category.list.add')}` }));

		expect(screen.getByText(i18n.t('category.list.count.multiple', { count: 0 }))).toBeInTheDocument();
		expect(loadNewCategoryDetails).toHaveBeenCalledTimes(1);
		expect(fetchCategories).not.toHaveBeenCalled();
	});

	test('keeps the floating add button on mobile', async() => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			value: 640,
			writable: true
		});

		const loadNewCategoryDetails = jest.fn();
		const store = createStore((state: CategoriesScreenTestState = {
			categoriesList: {
				categories: [],
				status: 'FETCHED',
				highlightedCategory: undefined
			}
		}) => {
			return state;
		});

		render(
			<Provider store={store}>
				<CategoriesListScreenComponent
					categoriesCount={0}
					isLoading={false}
					requiresFetch={false}
					fetchCategories={jest.fn()}
					loadNewCategoryDetails={loadNewCategoryDetails}
				/>
			</Provider>
		);

		expect(document.querySelector('.categories-screen-content .floating-action-button')).not.toBeNull();
		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: '+' }));

		expect(loadNewCategoryDetails).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('button', { name: `+ ${i18n.t('category.list.add')}` })).not.toBeInTheDocument();
	});
});
