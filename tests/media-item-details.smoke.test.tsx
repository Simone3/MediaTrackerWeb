import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemDetailsScreenComponent } from 'app/components/presentational/media-item/details/screen';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

type DetailsProps = React.ComponentProps<typeof MediaItemDetailsScreenComponent>;

const buildProps = (overrides: Partial<DetailsProps> = {}): DetailsProps => {
	return {
		isLoading: false,
		mediaItem: DEFAULT_BOOK,
		draftMediaItem: undefined,
		sameNameConfirmationRequested: false,
		tvShowSeasons: [],
		tvShowSeasonsLoadTimestamp: undefined,
		catalogSearchResults: undefined,
		catalogDetails: undefined,
		selectedGroup: undefined,
		selectedOwnPlatform: undefined,
		saveMediaItem: jest.fn(),
		notifyFormStatus: jest.fn(),
		persistFormDraft: jest.fn(),
		discardFormDraft: jest.fn(),
		handleTvShowSeasons: jest.fn(),
		requestGroupSelection: jest.fn(),
		requestOwnPlatformSelection: jest.fn(),
		searchMediaItemsCatalog: jest.fn(),
		loadMediaItemCatalogDetails: jest.fn(),
		resetMediaItemsCatalogSearch: jest.fn(),
		...overrides
	};
};

const createScreen = (overrides: Partial<DetailsProps> = {}): React.ReactElement => {
	return React.createElement(MediaItemDetailsScreenComponent, buildProps(overrides));
};

describe('MediaItemDetailsScreenComponent', () => {
	test('submits a valid media item from form input', async() => {
		const saveMediaItem = jest.fn();
		const notifyFormStatus = jest.fn();
		const persistFormDraft = jest.fn();
		const handleTvShowSeasons = jest.fn();
		const requestGroupSelection = jest.fn();
		const requestOwnPlatformSelection = jest.fn();
		const searchMediaItemsCatalog = jest.fn();
		const loadMediaItemCatalogDetails = jest.fn();
		const resetMediaItemsCatalogSearch = jest.fn();

		render(createScreen({
			saveMediaItem,
			notifyFormStatus,
			persistFormDraft,
			handleTvShowSeasons,
			requestGroupSelection,
			requestOwnPlatformSelection,
			searchMediaItemsCatalog,
			loadMediaItemCatalogDetails,
			resetMediaItemsCatalogSearch
		}));

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name'));
		const pagesInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.BOOK'));
		const authorsInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.creators.BOOK'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		expect(saveButton).toBeDisabled();

		await user.type(nameInput, 'Dune');
		await user.type(pagesInput, '412');
		await user.type(authorsInput, 'Frank Herbert');
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(saveMediaItem).toHaveBeenCalledTimes(1);
		expect(saveMediaItem).toHaveBeenCalledWith({
			...DEFAULT_BOOK,
			name: 'Dune',
			pagesNumber: 412,
			authors: [ 'Frank Herbert' ]
		}, false);
		expect(notifyFormStatus).toHaveBeenCalled();
		expect(persistFormDraft).toHaveBeenCalled();
		expect(handleTvShowSeasons).not.toHaveBeenCalled();
		expect(requestGroupSelection).not.toHaveBeenCalled();
		expect(requestOwnPlatformSelection).not.toHaveBeenCalled();
		expect(searchMediaItemsCatalog).not.toHaveBeenCalled();
		expect(loadMediaItemCatalogDetails).not.toHaveBeenCalled();
		expect(resetMediaItemsCatalogSearch).not.toHaveBeenCalled();
	});

	test('asks confirmation and retries save when same-name warning is requested', async() => {
		const saveMediaItem = jest.fn();
		const mediaItem: MediaItemInternal = {
			id: 'media-id',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '300'
		};

		const { rerender } = render(createScreen({
			mediaItem,
			saveMediaItem
		}));

		rerender(createScreen({
			mediaItem,
			sameNameConfirmationRequested: true,
			saveMediaItem
		}));

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		await waitFor(() => {
			expect(saveMediaItem).toHaveBeenCalledWith(mediaItem, true);
		});
	});

	test('opens TV show seasons handler from the details form', async() => {
		const handleTvShowSeasons = jest.fn();
		const tvShow: TvShowInternal = {
			id: 'tv-show-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				}
			]
		};

		render(createScreen({
			mediaItem: tvShow,
			handleTvShowSeasons
		}));

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.details.placeholders.seasons') }));

		expect(handleTvShowSeasons).toHaveBeenCalledWith(tvShow.seasons);
		expect(screen.getByText(i18n.t('mediaItem.details.labels.seasons', {
			seasonsNumber: 1,
			watchedEpisodesNumber: 8,
			episodesNumber: 10
		}))).toBeInTheDocument();
	});

	test('shows and hides the next episode air date field with the in-production toggle', async() => {
		const tvShow: TvShowInternal = {
			id: 'tv-show-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300'
		};

		render(createScreen({
			mediaItem: tvShow
		}));

		expect(screen.getByText(i18n.t('mediaItem.details.placeholders.production'))).toBeInTheDocument();
		expect(screen.queryByLabelText(i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate'))).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.inProduction')));

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate'))).toBeInTheDocument();

		await user.click(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.inProduction')));

		expect(screen.queryByLabelText(i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate'))).not.toBeInTheDocument();
	});

	test('renders the old shared book form controls and syncs selected entities', () => {
		const mediaItem: MediaItemInternal = {
			...DEFAULT_BOOK,
			id: 'book-id',
			name: 'Dune',
			importance: '300',
			catalogId: 'catalog-1',
			imageUrl: 'https://example.com/dune.jpg'
		};
		const selectedGroup: GroupInternal = {
			id: 'group-id',
			name: 'Sci-Fi Saga'
		};
		const selectedOwnPlatform: OwnPlatformInternal = {
			id: 'platform-id',
			name: 'Kindle',
			color: '#f5a623',
			icon: 'kindle'
		};

		const { rerender } = render(createScreen({
			mediaItem
		}));

		expect(screen.queryByText('Status')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.google') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.wikipedia') })).toBeInTheDocument();
		expect(screen.getByAltText('Dune cover')).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent(i18n.t('ownPlatform.list.none'));
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent(i18n.t('group.list.none'));
		expect(screen.getByText(i18n.t('mediaItem.details.placeholders.completedOn'))).toBeInTheDocument();

		rerender(createScreen({
			mediaItem,
			selectedGroup,
			selectedOwnPlatform
		}));

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent('Kindle');
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent('Sci-Fi Saga');
	});

	test('renders completion date controls and picker actions', async() => {
		render(createScreen({
			mediaItem: {
				...DEFAULT_BOOK,
				name: 'Dune',
				importance: '300'
			}
		}));

		expect(screen.getAllByText(i18n.t('common.buttons.select'))).toHaveLength(2);
		expect(screen.getByText(i18n.t('mediaItem.details.completion.empty'))).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.addDate') }));

		expect(screen.queryByText(i18n.t('mediaItem.details.completion.empty'))).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('common.buttons.remove') })).toBeInTheDocument();
	});

	test('hides the media image/actions block for a brand new item without catalog data', () => {
		render(createScreen());

		expect(screen.queryByRole('button', { name: i18n.t('mediaItem.details.buttons.google') })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: i18n.t('mediaItem.details.buttons.wikipedia') })).not.toBeInTheDocument();
		expect(screen.queryByAltText('Books cover')).not.toBeInTheDocument();
	});

	test('renders the dark media-style shell sections and cleans up the body class', () => {
		const { unmount } = render(createScreen({
			mediaItem: {
				...DEFAULT_BOOK,
				name: 'Dune'
			}
		}));

		expect(document.body).toHaveClass('app-dark-screen-active');
		expect(screen.queryByRole('heading', { name: 'Quick actions' })).not.toBeInTheDocument();
		expect(screen.queryByText(i18n.t('category.mediaTypes.BOOK'))).not.toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.basics.title') })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.profile.title') })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.collection.title') })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.progress.title') })).toBeInTheDocument();
		expect(screen.queryByText('Importance: Very important')).not.toBeInTheDocument();

		unmount();

		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});

	test('hydrates selected own platform on mount and saves it', async() => {
		const saveMediaItem = jest.fn();
		const selectedOwnPlatform: OwnPlatformInternal = {
			id: 'platform-id',
			name: 'Kindle',
			color: '#f5a623',
			icon: 'kindle'
		};

		render(createScreen({
			selectedOwnPlatform,
			saveMediaItem
		}));

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent('Kindle');

		const user = userEvent.setup();
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name')), 'Dune');
		await user.click(screen.getByRole('button', { name: i18n.t('common.buttons.save') }));

		expect(saveMediaItem).toHaveBeenCalledWith({
			...DEFAULT_BOOK,
			name: 'Dune',
			ownPlatform: selectedOwnPlatform
		}, false);
	});

	test('restores unsaved draft after remounting from picker navigation', async() => {
		let savedDraft: MediaItemInternal | undefined;
		const persistFormDraft = jest.fn((mediaItem: MediaItemInternal) => {
			savedDraft = mediaItem;
		});

		const { unmount } = render(createScreen({
			persistFormDraft
		}));

		const user = userEvent.setup();
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name')), 'Dune');
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.BOOK')), '412');
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment')), 'Keep this draft');

		expect(savedDraft).toMatchObject({
			name: 'Dune',
			pagesNumber: 412,
			userComment: 'Keep this draft'
		});

		unmount();

		render(createScreen({
			draftMediaItem: savedDraft
		}));

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name'))).toHaveValue('Dune');
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.BOOK'))).toHaveValue(412);
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment'))).toHaveValue('Keep this draft');
	});

	test('restores handled tv show seasons after remounting from the seasons flow', () => {
		const draftMediaItem: TvShowInternal = {
			id: 'tv-show-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				}
			]
		};
		const handledSeasons = [
			{
				number: 1,
				episodesNumber: 10,
				watchedEpisodesNumber: 10
			},
			{
				number: 2,
				episodesNumber: 8,
				watchedEpisodesNumber: 4
			}
		];

		render(createScreen({
			mediaItem: draftMediaItem,
			draftMediaItem: draftMediaItem,
			tvShowSeasons: handledSeasons,
			tvShowSeasonsLoadTimestamp: new Date('2026-03-14T12:00:00.000Z')
		}));

		expect(screen.getByText(i18n.t('mediaItem.details.labels.seasons', {
			seasonsNumber: 2,
			watchedEpisodesNumber: 14,
			episodesNumber: 18
		}))).toBeInTheDocument();
	});
});
