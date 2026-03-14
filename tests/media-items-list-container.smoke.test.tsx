import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemsListContainer } from 'app/components/containers/media-item/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { HIGHLIGHT_MEDIA_ITEM, REMOVE_MEDIA_ITEM_HIGHLIGHT } from 'app/redux/actions/media-item/const';
import { Provider } from 'react-redux';
import { Action, createStore } from 'redux';

type MediaItemsListContainerTestState = {
	categoryGlobal: {
		selectedCategory: CategoryInternal;
	};
	mediaItemsList: {
		mediaItems: MediaItemInternal[];
		status: string;
		mode: 'NORMAL' | 'VIEW_GROUP';
		highlightedMediaItem: MediaItemInternal | undefined;
		viewGroup: undefined;
	};
};

describe('MediaItemsListContainer', () => {
	test('opens the media item popup from the options button', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Books',
			mediaType: 'BOOK',
			color: '#3f51b5'
		};
		const mediaItem: MediaItemInternal = {
			id: 'media-id',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'NEW',
			importance: '300'
		};

		const initialState: MediaItemsListContainerTestState = {
			categoryGlobal: {
				selectedCategory: category
			},
			mediaItemsList: {
				mediaItems: [ mediaItem ],
				status: 'FETCHED',
				mode: 'NORMAL',
				highlightedMediaItem: undefined,
				viewGroup: undefined
			}
		};
		const store = createStore((state: MediaItemsListContainerTestState = initialState, action: Action & { mediaItem?: MediaItemInternal }) => {
			switch(action.type) {
				case HIGHLIGHT_MEDIA_ITEM: {
					return {
						...state,
						mediaItemsList: {
							...state.mediaItemsList,
							highlightedMediaItem: action.mediaItem
						}
					};
				}

				case REMOVE_MEDIA_ITEM_HIGHLIGHT: {
					return {
						...state,
						mediaItemsList: {
							...state.mediaItemsList,
							highlightedMediaItem: undefined
						}
					};
				}

				default:
					return state;
			}
		});

		render(
			<Provider store={store}>
				<MediaItemsListContainer/>
			</Provider>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Options for Dune' }));

		expect(screen.getByRole('button', { name: 'Edit book' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Delete book' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: "I'm reading this" })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: "I've read this" })).toBeInTheDocument();
		expect(screen.getAllByText('Dune')).toHaveLength(2);
	});
});
