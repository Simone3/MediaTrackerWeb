import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemDetailsScreenComponent } from 'app/components/presentational/media-item/details/screen';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

describe('MediaItemDetailsScreenComponent', () => {
	test('submits a valid media item from form input', async() => {
		const saveMediaItem = jest.fn();
		const notifyFormStatus = jest.fn();

		render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={DEFAULT_BOOK}
				sameNameConfirmationRequested={false}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={notifyFormStatus}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText('Search or type name');
		const saveButton = screen.getByRole('button', { name: 'Save' });

		expect(saveButton).toBeDisabled();

		await user.type(nameInput, 'Dune');
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(saveMediaItem).toHaveBeenCalledTimes(1);
		expect(saveMediaItem).toHaveBeenCalledWith({
			...DEFAULT_BOOK,
			name: 'Dune'
		}, false);
		expect(notifyFormStatus).toHaveBeenCalled();
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
		const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

		const { rerender } = render(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={mediaItem}
				sameNameConfirmationRequested={false}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		rerender(
			<MediaItemDetailsScreenComponent
				isLoading={false}
				mediaItem={mediaItem}
				sameNameConfirmationRequested={true}
				saveMediaItem={saveMediaItem}
				notifyFormStatus={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		await waitFor(() => {
			expect(confirmSpy).toHaveBeenCalledTimes(1);
			expect(saveMediaItem).toHaveBeenCalledWith(mediaItem, true);
		});

		confirmSpy.mockRestore();
	});
});
