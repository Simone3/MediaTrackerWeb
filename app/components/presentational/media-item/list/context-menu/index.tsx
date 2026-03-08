import React, { Component, ReactNode } from 'react';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { i18n } from 'app/utilities/i18n';
import { ButtonsListComponentButton, ButtonsListComponent } from 'app/components/presentational/generic/buttons-list';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { images } from 'app/utilities/images';
import { GroupInternal } from 'app/data/models/internal/group';

/**
 * Presentational component to display a modal dialog with the media item options
 */
export class MediaItemContextMenuComponent extends Component<MediaItemContextMenuComponentInput & MediaItemContextMenuComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			mediaItem
		} = this.props;

		if(mediaItem) {

			const {
				close
			} = this.props;

			// All media items have edit and delete button
			const buttons: ButtonsListComponentButton[] = [
				this.getEditButton(mediaItem),
				this.getDeleteButton(mediaItem)
			];

			// Currently completed items have the "could redo this" (e.g. rewatch) button
			if(mediaItem.status === 'COMPLETE') {

				buttons.push(this.getMarkAsRedoButton(mediaItem));
			}
			
			// Currently non-active (either new or redo) items have the "I'm doing this" (e.g. watching) button
			if(mediaItem.status === 'REDO' || mediaItem.status === 'NEW') {

				buttons.push(this.getMarkAsActiveButton(mediaItem));
			}

			// Currently non-completed (active or not) items have the "I've done this" (e.g. watched) button
			if(mediaItem.status === 'REDO' || mediaItem.status === 'NEW' || mediaItem.status === 'ACTIVE') {

				buttons.push(this.getMarkAsCompleteButton(mediaItem));
			}

			// Media items that belong to a group have the "View Group" button
			if(mediaItem.group && mediaItem.group.id) {

				buttons.push(this.getViewGroupButton(mediaItem));
			}

			return (
				<ModalComponent
					visible={true}
					onClose={close}
					horizontalPosition='center'
					verticalPosition='bottom'>
					<ButtonsListComponent
						title={mediaItem.name}
						titleIcon={images.mediaType(mediaItem.mediaType)}
						buttons={buttons}
					/>
				</ModalComponent>
			);
		}
		else {

			return null;
		}
	}

	/**
	 * The "Edit" button
	 * @param mediaItem the media item
	 * @returns the button
	 */
	private getEditButton(mediaItem: MediaItemInternal): ButtonsListComponentButton {

		const {
			edit,
			close
		} = this.props;

		return {
			label: i18n.t(`mediaItem.list.edit.${mediaItem.mediaType}`),
			icon: images.editButton(),
			onClick: (): void => {

				edit(mediaItem);
				close();
			}
		};
	}

	/**
	 * The "Delete" button
	 * @param mediaItem the media item
	 * @returns the button
	 */
	private getDeleteButton(mediaItem: MediaItemInternal): ButtonsListComponentButton {

		const {
			delete: deleteCallback,
			close
		} = this.props;

		return {
			label: i18n.t(`mediaItem.list.delete.${mediaItem.mediaType}`),
			icon: images.deleteButton(),
			onClick: (): void => {

				const title = i18n.t(`mediaItem.common.alert.delete.title.${mediaItem.mediaType}`);
				const message = i18n.t('mediaItem.common.alert.delete.message', { name: mediaItem.name });
				ConfirmAlert.alert(title, message, () => {
					
					deleteCallback(mediaItem);
					close();
				});
			}
		};
	}

	/**
	 * The "I'm watching/reading/... this" button
	 * @param mediaItem the media item
	 * @returns the button
	 */
	private getMarkAsActiveButton(mediaItem: MediaItemInternal): ButtonsListComponentButton {

		const {
			markAsActive,
			close
		} = this.props;

		return {
			label: i18n.t(`mediaItem.list.markActive.${mediaItem.mediaType}`),
			icon: images.activeIcon(mediaItem.mediaType),
			onClick: (): void => {

				markAsActive(mediaItem);
				close();
			}
		};
	}

	/**
	 * The "I've read/played/... this" button
	 * @param mediaItem the media item
	 * @returns the button
	 */
	private getMarkAsCompleteButton(mediaItem: MediaItemInternal): ButtonsListComponentButton {

		const {
			markAsComplete,
			close
		} = this.props;

		return {
			label: i18n.t(`mediaItem.list.markComplete.${mediaItem.mediaType}`),
			icon: images.completeIcon(),
			onClick: (): void => {

				markAsComplete(mediaItem);
				close();
			}
		};
	}

	/**
	 * The "I could rewatch/reread/... this" button
	 * @param mediaItem the media item
	 * @returns the button
	 */
	private getMarkAsRedoButton(mediaItem: MediaItemInternal): ButtonsListComponentButton {

		const {
			markAsRedo,
			close
		} = this.props;

		return {
			label: i18n.t(`mediaItem.list.markRedo.${mediaItem.mediaType}`),
			icon: images.redoIcon(),
			onClick: (): void => {

				markAsRedo(mediaItem);
				close();
			}
		};
	}

	/**
	 * The "View Group" button
	 * @param mediaItem the media item
	 * @returns the button
	 */
	private getViewGroupButton(mediaItem: MediaItemInternal): ButtonsListComponentButton {

		const {
			viewGroup,
			close
		} = this.props;

		return {
			label: i18n.t(`mediaItem.list.viewGroup`),
			icon: images.groupField(),
			onClick: (): void => {

				viewGroup(mediaItem.group as GroupInternal);
				close();
			}
		};
	}
}

/**
 * MediaItemContextMenuComponent's input props
 */
export type MediaItemContextMenuComponentInput = {

	/**
	 * The media item linked with the modal. Undefined means no modal is displayed.
	 */
	mediaItem: MediaItemInternal | undefined;
};

/**
 * MediaItemContextMenuComponent's output props
 */
export type MediaItemContextMenuComponentOutput = {

	/**
	 * Callback to edit the media item
	 */
	edit: (mediaItem: MediaItemInternal) => void;
	
	/**
	 * Callback to delete the media item
	 */
	delete: (mediaItem: MediaItemInternal) => void;
	
	/**
	 * Callback to mark the media item as active (e.g. currently watching)
	 */
	markAsActive: (mediaItem: MediaItemInternal) => void;
	
	/**
	 * Callback to mark the media item as completed (e.g. played)
	 */
	markAsComplete: (mediaItem: MediaItemInternal) => void;
	
	/**
	 * Callback to mark the media item as redoing (e.g. rereading)
	 */
	markAsRedo: (mediaItem: MediaItemInternal) => void;
	
	/**
	 * Callback to view the media item group
	 */
	viewGroup: (group: GroupInternal) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;
};

