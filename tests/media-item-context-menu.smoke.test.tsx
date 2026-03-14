import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemContextMenuComponent } from 'app/components/presentational/media-item/list/context-menu';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

describe('MediaItemContextMenuComponent', () => {
	const group: GroupInternal = {
		id: 'group-id',
		name: 'Saga'
	};
	const mediaItem: MediaItemInternal = {
		id: 'media-id',
		name: 'Dune',
		mediaType: 'BOOK',
		status: 'NEW',
		importance: '300',
		group: group
	};

	test('renders contextual actions and allows editing a media item', async() => {
		const edit = jest.fn();
		const deleteCallback = jest.fn();
		const markAsActive = jest.fn();
		const markAsComplete = jest.fn();
		const markAsRedo = jest.fn();
		const viewGroup = jest.fn();
		const close = jest.fn();

		render(
			<MediaItemContextMenuComponent
				mediaItem={mediaItem}
				currentViewGroupId={undefined}
				edit={edit}
				delete={deleteCallback}
				markAsActive={markAsActive}
				markAsComplete={markAsComplete}
				markAsRedo={markAsRedo}
				viewGroup={viewGroup}
				close={close}
			/>
		);

		expect(screen.getByRole('button', { name: 'Edit book' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Delete book' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: "I'm reading this" })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: "I've read this" })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'View Group' })).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Edit book' }));

		expect(edit).toHaveBeenCalledWith(mediaItem);
		expect(deleteCallback).not.toHaveBeenCalled();
		expect(markAsActive).not.toHaveBeenCalled();
		expect(markAsComplete).not.toHaveBeenCalled();
		expect(markAsRedo).not.toHaveBeenCalled();
		expect(viewGroup).not.toHaveBeenCalled();
		expect(close).toHaveBeenCalledTimes(1);
	});

	test('asks confirmation before deleting a media item', async() => {
		const deleteCallback = jest.fn();
		const close = jest.fn();

		render(
			<MediaItemContextMenuComponent
				mediaItem={mediaItem}
				currentViewGroupId={undefined}
				edit={jest.fn()}
				delete={deleteCallback}
				markAsActive={jest.fn()}
				markAsComplete={jest.fn()}
				markAsRedo={jest.fn()}
				viewGroup={jest.fn()}
				close={close}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Delete book' }));

		expect(screen.getByText('Delete Book')).toBeInTheDocument();
		expect(deleteCallback).not.toHaveBeenCalled();

		await user.click(screen.getByRole('button', { name: 'OK' }));

		expect(deleteCallback).toHaveBeenCalledWith(mediaItem);
		expect(close).toHaveBeenCalledTimes(1);
	});
});
