import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemDetailsScreenComponent } from 'app/components/presentational/media-item/details/screen';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';

describe('MediaItemDetailsScreenComponent', () => {
	test('submits a valid media item from form input', async() => {
		const saveMediaItem = jest.fn();
		const notifyFormStatus = jest.fn();
		const handleTvShowSeasons = jest.fn();

		render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={DEFAULT_BOOK}
				sameNameConfirmationRequested={false}
				tvShowSeasons={[]}
				tvShowSeasonsLoadTimestamp={undefined}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={notifyFormStatus}
				handleTvShowSeasons={handleTvShowSeasons}
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
				saveMediaItem={saveMediaItem}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={jest.fn()}
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
				saveMediaItem={saveMediaItem}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={jest.fn()}
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
				saveMediaItem={jest.fn()}
				notifyFormStatus={jest.fn()}
				handleTvShowSeasons={handleTvShowSeasons}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Seasons' }));

		expect(handleTvShowSeasons).toHaveBeenCalledWith(tvShow.seasons);
		expect(screen.getByText('1 seasons, watched 8 out of 10 episodes')).toBeInTheDocument();
	});
});
