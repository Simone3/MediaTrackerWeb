import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemsListComponent } from 'app/components/presentational/media-item/list/list';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

describe('MediaItemsListComponent', () => {
	test('handles refresh, item open and options action', async() => {
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
		const selectMediaItem = jest.fn();
		const highlightMediaItem = jest.fn();

		render(
			<MediaItemsListComponent
				category={category}
				mediaItems={[ mediaItem ]}
				refreshMediaItems={refreshMediaItems}
				selectMediaItem={selectMediaItem}
				highlightMediaItem={highlightMediaItem}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Refresh' }));
		await user.click(screen.getByText('Dune'));
		await user.click(screen.getByRole('button', { name: 'Options for Dune' }));

		expect(refreshMediaItems).toHaveBeenCalledTimes(1);
		expect(selectMediaItem).toHaveBeenCalledWith(mediaItem);
		expect(highlightMediaItem).toHaveBeenCalledWith(mediaItem);
	});
});
