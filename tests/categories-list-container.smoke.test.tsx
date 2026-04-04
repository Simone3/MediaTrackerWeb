import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { Action, createStore } from 'redux';
import { CategoriesListContainer } from 'app/components/containers/category/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { HIGHLIGHT_CATEGORY, REMOVE_CATEGORY_HIGHLIGHT } from 'app/redux/actions/category/const';
import { i18n } from 'app/utilities/i18n';

type CategoriesListContainerTestState = {
	categoriesList: {
		categories: CategoryInternal[];
		status: string;
		highlightedCategory: CategoryInternal | undefined;
	};
};

describe('CategoriesListContainer', () => {
	test('opens the category popup from the options button', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Books',
			mediaType: 'BOOK',
			color: '#3f51b5'
		};

		const initialState: CategoriesListContainerTestState = {
			categoriesList: {
				categories: [ category ],
				status: 'FETCHED',
				highlightedCategory: undefined
			}
		};
		const store = createStore((state: CategoriesListContainerTestState = initialState, action: Action & { category?: CategoryInternal }) => {
			switch (action.type) {
				case HIGHLIGHT_CATEGORY: {
					return {
						...state,
						categoriesList: {
							...state.categoriesList,
							highlightedCategory: action.category
						}
					};
				}

				case REMOVE_CATEGORY_HIGHLIGHT: {
					return {
						...state,
						categoriesList: {
							...state.categoriesList,
							highlightedCategory: undefined
						}
					};
				}

				default:
					return state;
			}
		});

		render(
			<Provider store={store}>
				<CategoriesListContainer/>
			</Provider>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.optionsFor', { name: category.name }) }));

		expect(screen.getByRole('button', { name: i18n.t('category.list.edit') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('category.list.delete') })).toBeInTheDocument();
		expect(screen.getAllByText('My Books')).toHaveLength(2);
	});
});
