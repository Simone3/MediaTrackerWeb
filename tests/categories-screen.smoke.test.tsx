import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoriesListScreenComponent } from 'app/components/presentational/category/list/screen';
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
				highlightedCategory: undefined
			}
		}) => state);

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
		await user.click(screen.getByRole('button', { name: '+ Add category' }));

		expect(document.body).toHaveClass('categories-screen-active');
		expect(screen.getByText('0 categories')).toBeInTheDocument();
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
				highlightedCategory: undefined
			}
		}) => state);

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

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: '+' }));

		expect(document.body).toHaveClass('categories-screen-active');
		expect(loadNewCategoryDetails).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('button', { name: '+ Add category' })).not.toBeInTheDocument();
	});
});
