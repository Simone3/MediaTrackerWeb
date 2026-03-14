import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemDetailsScreenComponent } from 'app/components/presentational/media-item/details/screen';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';

describe('MediaItemDetailsScreenComponent', () => {
	test('submits a valid media item from form input', async() => {
		const saveMediaItem = jest.fn();
		const notifyFormStatus = jest.fn();
		const handleTvShowSeasons = jest.fn();
		const requestGroupSelection = jest.fn();
		const requestOwnPlatformSelection = jest.fn();
		const searchMediaItemsCatalog = jest.fn();
		const loadMediaItemCatalogDetails = jest.fn();
		const resetMediaItemsCatalogSearch = jest.fn();

		render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={DEFAULT_BOOK}
				sameNameConfirmationRequested={false}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				catalogSearchResults={undefined}
				catalogDetails={undefined}
				selectedGroup={undefined}
				selectedOwnPlatform={undefined}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={notifyFormStatus}
				handleTvShowSeasons={handleTvShowSeasons}
				requestGroupSelection={requestGroupSelection}
				requestOwnPlatformSelection={requestOwnPlatformSelection}
				searchMediaItemsCatalog={searchMediaItemsCatalog}
				loadMediaItemCatalogDetails={loadMediaItemCatalogDetails}
				resetMediaItemsCatalogSearch={resetMediaItemsCatalogSearch}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText('Search or type name');
		const pagesInput = screen.getByLabelText('Number of pages');
		const authorsInput = screen.getByLabelText('Authors');
		const saveButton = screen.getByRole('button', { name: 'Save' });

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

		const { rerender } = render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={mediaItem}
				sameNameConfirmationRequested={false}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				catalogSearchResults={undefined}
				catalogDetails={undefined}
				selectedGroup={undefined}
				selectedOwnPlatform={undefined}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={jest.fn()}
				requestGroupSelection={jest.fn()}
				requestOwnPlatformSelection={jest.fn()}
				searchMediaItemsCatalog={jest.fn()}
				loadMediaItemCatalogDetails={jest.fn()}
				resetMediaItemsCatalogSearch={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		rerender(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={mediaItem}
				sameNameConfirmationRequested={true}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				catalogSearchResults={undefined}
				catalogDetails={undefined}
				selectedGroup={undefined}
				selectedOwnPlatform={undefined}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={jest.fn()}
				requestGroupSelection={jest.fn()}
				requestOwnPlatformSelection={jest.fn()}
				searchMediaItemsCatalog={jest.fn()}
				loadMediaItemCatalogDetails={jest.fn()}
				resetMediaItemsCatalogSearch={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'OK' }));

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

		render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={tvShow}
				sameNameConfirmationRequested={false}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				catalogSearchResults={undefined}
				catalogDetails={undefined}
				selectedGroup={undefined}
				selectedOwnPlatform={undefined}
				saveMediaItem={jest.fn()}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={handleTvShowSeasons}
				requestGroupSelection={jest.fn()}
				requestOwnPlatformSelection={jest.fn()}
				searchMediaItemsCatalog={jest.fn()}
				loadMediaItemCatalogDetails={jest.fn()}
				resetMediaItemsCatalogSearch={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Seasons' }));

		expect(handleTvShowSeasons).toHaveBeenCalledWith(tvShow.seasons);
		expect(screen.getByText('1 seasons, watched 8 out of 10 episodes')).toBeInTheDocument();
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

		const { rerender } = render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={mediaItem}
				sameNameConfirmationRequested={false}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				catalogSearchResults={undefined}
				catalogDetails={undefined}
				selectedGroup={undefined}
				selectedOwnPlatform={undefined}
				saveMediaItem={jest.fn()}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={jest.fn()}
				requestGroupSelection={jest.fn()}
				requestOwnPlatformSelection={jest.fn()}
				searchMediaItemsCatalog={jest.fn()}
				loadMediaItemCatalogDetails={jest.fn()}
				resetMediaItemsCatalogSearch={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		expect(screen.queryByText('Status')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Google Search' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Wikipedia Search' })).toBeInTheDocument();
		expect(screen.getByAltText('Dune cover')).toBeInTheDocument();
		expect(screen.getByLabelText('Owned at')).toHaveTextContent('None');
		expect(screen.getByLabelText('Group')).toHaveTextContent('None');
		expect(screen.getByText('Completed on')).toBeInTheDocument();

		rerender(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={mediaItem}
				sameNameConfirmationRequested={false}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				catalogSearchResults={undefined}
				catalogDetails={undefined}
				selectedGroup={selectedGroup}
				selectedOwnPlatform={selectedOwnPlatform}
				saveMediaItem={jest.fn()}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={jest.fn()}
				requestGroupSelection={jest.fn()}
				requestOwnPlatformSelection={jest.fn()}
				searchMediaItemsCatalog={jest.fn()}
				loadMediaItemCatalogDetails={jest.fn()}
				resetMediaItemsCatalogSearch={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		expect(screen.getByLabelText('Owned at')).toHaveTextContent('Kindle');
		expect(screen.getByLabelText('Group')).toHaveTextContent('Sci-Fi Saga');
	});
});
