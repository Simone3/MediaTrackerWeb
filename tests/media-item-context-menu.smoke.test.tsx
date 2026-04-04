import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemContextMenuComponent } from 'app/components/presentational/media-item/list/context-menu';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';
import { MOBILE_LAYOUT_BREAKPOINT } from 'app/utilities/layout';

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
	const anchorRect = {
		top: 24,
		bottom: 56,
		left: 120,
		right: 152,
		width: 32,
		height: 32
	};

	test('renders a desktop popover without the media-type subtitle and allows editing a media item', async() => {
		const edit = jest.fn();
		const deleteCallback = jest.fn();
		const markAsActive = jest.fn();
		const markAsComplete = jest.fn();
		const markAsRedo = jest.fn();
		const viewGroup = jest.fn();
		const close = jest.fn();

		const { container } = render(
			<MediaItemContextMenuComponent
				mediaItem={mediaItem}
				anchorRect={anchorRect}
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

		expect(container.querySelector('.responsive-action-menu-popover')).not.toBeNull();
		expect(container.querySelector('.responsive-action-menu-sheet')).toBeNull();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.list.edit.BOOK') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.list.delete.BOOK') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.list.markActive.BOOK') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.list.markComplete.BOOK') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.list.viewGroup') })).toBeInTheDocument();
		expect(screen.queryByText(i18n.t('category.mediaTypes.BOOK'))).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.edit.BOOK') }));

		expect(edit).toHaveBeenCalledWith(mediaItem);
		expect(deleteCallback).not.toHaveBeenCalled();
		expect(markAsActive).not.toHaveBeenCalled();
		expect(markAsComplete).not.toHaveBeenCalled();
		expect(markAsRedo).not.toHaveBeenCalled();
		expect(viewGroup).not.toHaveBeenCalled();
		expect(close).toHaveBeenCalledTimes(1);
	});

	test('uses the mobile bottom sheet and asks confirmation before deleting a media item', async() => {
		const previousInnerWidth = window.innerWidth;
		try {
			Object.defineProperty(window, 'innerWidth', {
				configurable: true,
				writable: true,
				value: MOBILE_LAYOUT_BREAKPOINT
			});

			const deleteCallback = jest.fn();
			const close = jest.fn();

			const { container } = render(
				<MediaItemContextMenuComponent
					mediaItem={mediaItem}
					anchorRect={anchorRect}
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

			expect(container.querySelector('.responsive-action-menu-sheet')).not.toBeNull();
			expect(container.querySelector('.responsive-action-menu-popover')).toBeNull();

			const user = userEvent.setup();
			await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.delete.BOOK') }));

			expect(screen.getByText(i18n.t('mediaItem.common.alert.delete.title.BOOK'))).toBeInTheDocument();
			expect(deleteCallback).not.toHaveBeenCalled();

			await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

			expect(deleteCallback).toHaveBeenCalledWith(mediaItem);
			expect(close).toHaveBeenCalledTimes(1);
		} finally {
			Object.defineProperty(window, 'innerWidth', {
				configurable: true,
				writable: true,
				value: previousInnerWidth
			});
		}
	});
});
