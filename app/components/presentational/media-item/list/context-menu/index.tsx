import React, { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the media item options popup
 */
export class MediaItemContextMenuComponent extends Component<MediaItemContextMenuComponentInput & MediaItemContextMenuComponentOutput, MediaItemContextMenuComponentState> {
	public state: MediaItemContextMenuComponentState = {
		deleteConfirmationVisible: false
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemContextMenuComponentInput & MediaItemContextMenuComponentOutput>): void {
		if(prevProps.mediaItem?.id !== this.props.mediaItem?.id && this.state.deleteConfirmationVisible) {
			this.setState({
				deleteConfirmationVisible: false
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			mediaItem,
			close
		} = this.props;

		if(!mediaItem) {
			return null;
		}

		const canMarkAsRedo = mediaItem.status === 'COMPLETE';
		const canMarkAsActive = mediaItem.status === 'REDO' || mediaItem.status === 'NEW';
		const canMarkAsComplete = mediaItem.status === 'REDO' || mediaItem.status === 'NEW' || mediaItem.status === 'ACTIVE';
		const canViewGroup = Boolean(mediaItem.group?.id) && mediaItem.group?.id !== this.props.currentViewGroupId;

		return (
			<>
				<div className='media-item-context-menu-overlay' role='presentation' onClick={close}>
					<div
						className='media-item-context-menu'
						role='dialog'
						aria-modal={true}
						aria-labelledby='media-item-context-menu-title'
						onClick={(event) => {
							event.stopPropagation();
						}}>
						<div className='media-item-context-menu-handle' />
						<header className='media-item-context-menu-header'>
							<h2 id='media-item-context-menu-title' className='media-item-context-menu-title'>{mediaItem.name}</h2>
							<p className='media-item-context-menu-media'>{i18n.t(`category.mediaTypes.${mediaItem.mediaType}`)}</p>
						</header>
						<div className='media-item-context-menu-actions'>
							<button
								type='button'
								className='media-item-context-menu-button'
								onClick={() => {
									this.props.edit(mediaItem);
									close();
								}}>
								{i18n.t(`mediaItem.list.edit.${mediaItem.mediaType}`)}
							</button>
							<button
								type='button'
								className='media-item-context-menu-button media-item-context-menu-button-danger'
								onClick={() => {
									this.setState({
										deleteConfirmationVisible: true
									});
								}}>
								{i18n.t(`mediaItem.list.delete.${mediaItem.mediaType}`)}
							</button>
							{canMarkAsRedo && (
								<button
									type='button'
									className='media-item-context-menu-button'
									onClick={() => {
										this.props.markAsRedo(mediaItem);
										close();
									}}>
									{i18n.t(`mediaItem.list.markRedo.${mediaItem.mediaType}`)}
								</button>
							)}
							{canMarkAsActive && (
								<button
									type='button'
									className='media-item-context-menu-button'
									onClick={() => {
										this.props.markAsActive(mediaItem);
										close();
									}}>
									{i18n.t(`mediaItem.list.markActive.${mediaItem.mediaType}`)}
								</button>
							)}
							{canMarkAsComplete && (
								<button
									type='button'
									className='media-item-context-menu-button'
									onClick={() => {
										this.props.markAsComplete(mediaItem);
										close();
									}}>
									{i18n.t(`mediaItem.list.markComplete.${mediaItem.mediaType}`)}
								</button>
							)}
							{canViewGroup && mediaItem.group && (
								<button
									type='button'
									className='media-item-context-menu-button'
									onClick={() => {
										this.props.viewGroup(mediaItem.group as GroupInternal);
										close();
									}}>
									{i18n.t('mediaItem.list.viewGroup')}
								</button>
							)}
						</div>
					</div>
				</div>
				<ConfirmDialogComponent
					visible={this.state.deleteConfirmationVisible}
					title={i18n.t(`mediaItem.common.alert.delete.title.${mediaItem.mediaType}`)}
					message={i18n.t('mediaItem.common.alert.delete.message', { name: mediaItem.name })}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						this.setState({
							deleteConfirmationVisible: false
						}, () => {
							this.props.delete(mediaItem);
							close();
						});
					}}
					onCancel={() => {
						this.setState({
							deleteConfirmationVisible: false
						});
					}}
				/>
			</>
		);
	}
}

/**
 * MediaItemContextMenuComponent's input props
 */
export type MediaItemContextMenuComponentInput = {
	/**
	 * The media item linked with the popup. Undefined means no popup is displayed.
	 */
	mediaItem: MediaItemInternal | undefined;

	/**
	 * The currently viewed group ID, if the list is already filtered by a group
	 */
	currentViewGroupId?: string;
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

type MediaItemContextMenuComponentState = {
	deleteConfirmationVisible: boolean;
};
