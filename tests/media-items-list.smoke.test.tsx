import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemsListComponent } from 'app/components/presentational/media-item/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

describe('MediaItemsListComponent', () => {
	test('handles refresh, search open, item open and options action', async() => {
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
			status: 'ACTIVE',
			importance: '300'
		};
		const refreshMediaItems = jest.fn();
		const openFilters = jest.fn();
		const openSearch = jest.fn();
		const selectMediaItem = jest.fn();
		const highlightMediaItem = jest.fn();

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				refreshMediaItems={refreshMediaItems}
				openSearch={openSearch}
				submitSearch={jest.fn()}
				closeSearch={jest.fn()}
				openFilters={openFilters}
				selectMediaItem={selectMediaItem}
				highlightMediaItem={highlightMediaItem}
				editMediaItem={jest.fn()}
				deleteMediaItem={jest.fn()}
				markMediaItemAsActive={jest.fn()}
				markMediaItemAsComplete={jest.fn()}
				markMediaItemAsRedo={jest.fn()}
				viewMediaItemGroup={jest.fn()}
				closeMediaItemMenu={jest.fn()}
				exitViewGroupMode={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Refresh' }));
		await user.click(screen.getByRole('button', { name: 'Search' }));
		await user.click(screen.getByRole('button', { name: 'Filter' }));
		await user.click(screen.getByText('Dune'));
		await user.click(screen.getByRole('button', { name: 'Options for Dune' }));

		expect(refreshMediaItems).toHaveBeenCalledTimes(1);
		expect(openSearch).toHaveBeenCalledTimes(1);
		expect(openFilters).toHaveBeenCalledTimes(1);
		expect(selectMediaItem).toHaveBeenCalledWith(mediaItem);
		expect(highlightMediaItem).toHaveBeenCalledWith(mediaItem);
	});

	test('submits and closes text search', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Books',
			mediaType: 'BOOK',
			color: '#3f51b5'
		};
		const submitSearch = jest.fn();
		const closeSearch = jest.fn();

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={true}
				currentSearchTerm={'old term'}
				refreshMediaItems={jest.fn()}
				openSearch={jest.fn()}
				submitSearch={submitSearch}
				closeSearch={closeSearch}
				openFilters={jest.fn()}
				selectMediaItem={jest.fn()}
				highlightMediaItem={jest.fn()}
				editMediaItem={jest.fn()}
				deleteMediaItem={jest.fn()}
				markMediaItemAsActive={jest.fn()}
				markMediaItemAsComplete={jest.fn()}
				markMediaItemAsRedo={jest.fn()}
				viewMediaItemGroup={jest.fn()}
				closeMediaItemMenu={jest.fn()}
				exitViewGroupMode={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		const searchInput = screen.getByRole('searchbox', { name: 'Search books...' });
		await user.clear(searchInput);
		await user.type(searchInput, 'Dune Messiah');
		await user.click(screen.getByRole('button', { name: 'Search' }));
		await user.click(screen.getByRole('button', { name: 'Cancel' }));

		expect(submitSearch).toHaveBeenCalledWith('Dune Messiah');
		expect(closeSearch).toHaveBeenCalledTimes(1);
	});
});
