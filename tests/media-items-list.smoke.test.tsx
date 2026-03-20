import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemsListComponent } from 'app/components/presentational/media-item/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

describe('MediaItemsListComponent', () => {
	test('handles search open, item open and options action', async() => {
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
		await user.click(screen.getByRole('button', { name: 'Search' }));
		await user.click(screen.getByRole('button', { name: 'Filter' }));
		await user.click(screen.getByText('Dune'));
		await user.click(screen.getByRole('button', { name: 'Options for Dune' }));

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

	test('renders restored row metadata, platform icon and status icon', () => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Books',
			mediaType: 'BOOK',
			color: '#3f51b5'
		};
		const group: GroupInternal = {
			id: 'group-id',
			name: 'Dune Chronicles'
		};
		const ownPlatform: OwnPlatformInternal = {
			id: 'platform-id',
			name: 'Kindle',
			color: '#5f6368',
			icon: 'kindle'
		};
		const mediaItem: BookInternal = {
			id: 'media-id',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '300',
			releaseDate: new Date('1965-01-01'),
			authors: [ 'Frank Herbert' ],
			pagesNumber: 412,
			genres: [ 'Science fiction', 'Adventure' ],
			group: group,
			orderInGroup: 1,
			ownPlatform: ownPlatform
		};

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				openSearch={jest.fn()}
				submitSearch={jest.fn()}
				closeSearch={jest.fn()}
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

		expect(screen.getByText('Dune')).toBeInTheDocument();
		expect(screen.getByText('1965 • 412pp. • Frank Herbert')).toBeInTheDocument();
		expect(screen.getByText('Science fiction, Adventure')).toBeInTheDocument();
		expect(screen.getByText('Dune Chronicles, #1')).toBeInTheDocument();
		expect(screen.getByLabelText('Owned at Kindle')).toBeInTheDocument();
		expect(screen.getByLabelText("I'm reading this")).toBeInTheDocument();
	});

	test('renders tv show specific row metadata', () => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Shows',
			mediaType: 'TV_SHOW',
			color: '#3f51b5'
		};
		const mediaItem: TvShowInternal = {
			id: 'media-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			releaseDate: new Date('2017-01-01'),
			averageEpisodeRuntimeMinutes: 60,
			creators: [ 'Baran bo Odar', 'Jantje Friese' ],
			inProduction: true
		};

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				openSearch={jest.fn()}
				submitSearch={jest.fn()}
				closeSearch={jest.fn()}
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

		expect(screen.getByText('2017 • 60\' • P • Baran bo Odar, Jantje Friese')).toBeInTheDocument();
		expect(screen.getByLabelText("I'm following this")).toBeInTheDocument();
	});
});
