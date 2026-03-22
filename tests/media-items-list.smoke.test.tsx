import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config } from 'app/config/config';
import { MediaItemsListComponent } from 'app/components/presentational/media-item/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

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
		const submitSearch = jest.fn();
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
				showEmptyState={false}
				showSkeletons={false}
				openSearch={openSearch}
				submitSearch={submitSearch}
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
		const searchInput = screen.getByRole('searchbox', { name: i18n.t('mediaItem.list.search.BOOK') });

		await user.type(searchInput, 'Dune');
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.buttons.search') }));
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.filter.title') }));
		await user.click(screen.getByText('Dune'));
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.optionsFor', { name: mediaItem.name }) }));

		expect(screen.queryByText(i18n.t('mediaItem.list.count.single'))).not.toBeInTheDocument();
		expect(openSearch).toHaveBeenCalledTimes(1);
		expect(submitSearch).toHaveBeenCalledWith('Dune');
		expect(openFilters).toHaveBeenCalledTimes(1);
		expect(selectMediaItem).toHaveBeenCalledWith(mediaItem);
		expect(highlightMediaItem).toHaveBeenCalledWith(mediaItem);
	});

	test('keeps the platform shell empty when a media item has no own platform', () => {
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

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				showEmptyState={false}
				showSkeletons={false}
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

		const platformBadge = screen.getByLabelText(i18n.t('mediaItem.list.accessibility.ownPlatform.notOwned'));

		expect(platformBadge.querySelector('.media-item-row-platform-shell')).not.toBeNull();
		expect(platformBadge.querySelector('.media-item-row-platform-icon')).toBeNull();
	});

	test('keeps the search bar visible and closes search mode from the submit button when cleared', async() => {
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
				showEmptyState={false}
				showSkeletons={false}
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
		const searchInput = screen.getByRole('searchbox', { name: i18n.t('mediaItem.list.search.BOOK') });
		await user.clear(searchInput);
		await user.type(searchInput, 'Dune Messiah');
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.buttons.search') }));
		await user.clear(searchInput);
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.buttons.search') }));

		expect(submitSearch).toHaveBeenCalledWith('Dune Messiah');
		expect(closeSearch).toHaveBeenCalledTimes(1);
		expect(screen.getByRole('searchbox', { name: i18n.t('mediaItem.list.search.BOOK') })).toBeInTheDocument();
	});

	test('renders loading skeletons until the empty result is confirmed', () => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Books',
			mediaType: 'BOOK',
			color: '#3f51b5'
		};
		const {
			container,
			rerender
		} = render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				showEmptyState={false}
				showSkeletons={true}
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

		expect(screen.queryByText(i18n.t('mediaItem.list.empty.BOOK'))).not.toBeInTheDocument();
		expect(container.querySelectorAll('.media-item-row-skeleton')).toHaveLength(4);

		rerender(
			<MediaItemsListComponent
				category={category}
				mediaItems={[]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				showEmptyState={true}
				showSkeletons={false}
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

		expect(screen.getByText(i18n.t('mediaItem.list.empty.BOOK'))).toBeInTheDocument();
		expect(container.querySelectorAll('.media-item-row-skeleton')).toHaveLength(0);
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
				showEmptyState={false}
				showSkeletons={false}
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
		expect(screen.getByText(i18n.t('mediaItem.list.group', { groupName: group.name, order: 1 }))).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.list.accessibility.ownPlatform.owned', { name: ownPlatform.name }))).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.list.markActive.BOOK'))).toBeInTheDocument();
		expect(screen.getByText('Dune').closest('li')?.style.getPropertyValue('--media-item-row-accent')).toBe(config.ui.colors.green);
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
				showEmptyState={false}
				showSkeletons={false}
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
		expect(screen.getByLabelText(i18n.t('mediaItem.list.markActive.TV_SHOW'))).toBeInTheDocument();
	});

	test('keeps the new-item chrome neutral while leaving the left accent transparent', () => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Games',
			mediaType: 'VIDEOGAME',
			color: '#3f51b5'
		};
		const mediaItem: MediaItemInternal = {
			id: 'media-id',
			name: 'Hades',
			mediaType: 'VIDEOGAME',
			status: 'NEW',
			importance: '300'
		};

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				showEmptyState={false}
				showSkeletons={false}
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

		expect(screen.getByText('Hades').closest('li')?.style.getPropertyValue('--media-item-row-accent')).toBe('transparent');
		expect(screen.getByText('Hades').closest('li')).not.toHaveClass('media-item-row-highlighted');
		expect(screen.getByLabelText(i18n.t('mediaItem.common.importance.300'))).toHaveStyle({
			backgroundColor: 'rgba(255, 255, 255, 0.06)',
			borderColor: 'rgba(255, 255, 255, 0.06)'
		});
	});

	test('adds the highlighted row class when the media item menu is open', () => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Movies',
			mediaType: 'MOVIE',
			color: '#3f51b5'
		};
		const mediaItem: MediaItemInternal = {
			id: 'media-id',
			name: 'Arrival',
			mediaType: 'MOVIE',
			status: 'ACTIVE',
			importance: '300'
		};

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={mediaItem}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				showEmptyState={false}
				showSkeletons={false}
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

		expect(screen.getByRole('button', { name: i18n.t('common.a11y.optionsFor', { name: mediaItem.name }) }).closest('li')).toHaveClass('media-item-row-highlighted');
	});

	test('renders extremely long names without changing the row interaction model', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'My Movies',
			mediaType: 'MOVIE',
			color: '#3f51b5'
		};
		const mediaItem: MediaItemInternal = {
			id: 'media-id',
			name: 'TheRidiculouslyLongMovieNameThatKeepsGoingAndGoingWithoutAnySpacesToForceTheRowToShrinkCorrectlyOnWebPorts',
			mediaType: 'MOVIE',
			status: 'ACTIVE',
			importance: '300'
		};
		const selectMediaItem = jest.fn();

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				highlightedMediaItem={undefined}
				currentViewGroup={undefined}
				isSearchMode={false}
				currentSearchTerm={undefined}
				showEmptyState={false}
				showSkeletons={false}
				openSearch={jest.fn()}
				submitSearch={jest.fn()}
				closeSearch={jest.fn()}
				openFilters={jest.fn()}
				selectMediaItem={selectMediaItem}
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
		await user.click(screen.getByText(mediaItem.name));

		expect(selectMediaItem).toHaveBeenCalledWith(mediaItem);
		expect(screen.getByText(mediaItem.name)).toHaveClass('media-item-row-name');
	});
});
