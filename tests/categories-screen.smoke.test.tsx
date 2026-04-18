import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import { CategoriesListScreenComponent } from 'app/components/presentational/category/list/screen';
import { i18n } from 'app/utilities/i18n';

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
			<MemoryRouter>
				<Provider store={store}>
					<CategoriesListScreenComponent
						categoriesCount={0}
						isLoading={false}
						requiresFetch={false}
						fetchCategories={fetchCategories}
						loadNewCategoryDetails={loadNewCategoryDetails}
					/>
				</Provider>
			</MemoryRouter>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('category.list.add') }));

		expect(screen.getByRole('link', { name: i18n.t('common.drawer.home') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.settings') })).toBeInTheDocument();
		expect(screen.getByText(i18n.t('category.list.count.multiple', { count: 0 }))).toBeInTheDocument();
		expect(loadNewCategoryDetails).toHaveBeenCalledTimes(1);
		expect(fetchCategories).not.toHaveBeenCalled();
	});

	test('keeps the same header add button on mobile', async() => {
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
			<MemoryRouter>
				<Provider store={store}>
					<CategoriesListScreenComponent
						categoriesCount={0}
						isLoading={false}
						requiresFetch={false}
						fetchCategories={jest.fn()}
						loadNewCategoryDetails={loadNewCategoryDetails}
					/>
				</Provider>
			</MemoryRouter>
		);

		expect(document.querySelector('.categories-screen-content .floating-action-button')).toBeNull();
		const user = userEvent.setup();
		expect(screen.getByRole('button', { name: i18n.t('common.buttons.add') })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: i18n.t('category.list.add') })).not.toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: i18n.t('common.buttons.add') }));

		expect(loadNewCategoryDetails).toHaveBeenCalledTimes(1);
	});
});
