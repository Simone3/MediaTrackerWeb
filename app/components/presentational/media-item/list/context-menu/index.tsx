import React, { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { ResponsiveActionMenuAnchorRect, ResponsiveActionMenuComponent } from 'app/components/presentational/generic/responsive-action-menu';
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

		const visibility = this.getVisibility(mediaItem);

		return (
			<>
				<ResponsiveActionMenuComponent
					visible={true}
					anchorRect={this.props.anchorRect}
					labelledBy='media-item-context-menu-title'
					closeAriaLabel={i18n.t('common.a11y.closeMediaItemActions')}
					onClose={close}
					popoverWidth={304}
					popoverHeight={52 + (this.getActionsCount(visibility) * 58)}
					escapeDisabled={this.state.deleteConfirmationVisible}
					layerClassName='responsive-action-menu-layer media-item-context-menu-layer'
					dismissClassName='responsive-action-menu-dismiss media-item-context-menu-dismiss'
					overlayClassName='responsive-action-menu-overlay media-item-context-menu-overlay'
					popoverClassName='responsive-action-menu responsive-action-menu-popover media-item-context-menu media-item-context-menu-popover'
					sheetClassName='responsive-action-menu responsive-action-menu-sheet media-item-context-menu media-item-context-menu-sheet'
					handleClassName='responsive-action-menu-handle media-item-context-menu-handle'>
					{this.renderMenuContent(mediaItem, close, visibility)}
				</ResponsiveActionMenuComponent>
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

	/**
	 * Renders the shared menu header and actions
	 * @param mediaItem active media item
	 * @param close callback to close the menu
	 * @param visibility action visibility flags
	 * @returns the shared menu content
	 */
	private renderMenuContent(mediaItem: MediaItemInternal, close: () => void, visibility: MediaItemContextMenuVisibility): ReactNode {
		return (
			<>
				<header className='responsive-action-menu-header media-item-context-menu-header'>
					<h2 id='media-item-context-menu-title' className='responsive-action-menu-title media-item-context-menu-title'>{mediaItem.name}</h2>
				</header>
				<div className='responsive-action-menu-actions media-item-context-menu-actions'>
					<button
						type='button'
						className='responsive-action-menu-button media-item-context-menu-button'
						onClick={() => {
							this.props.edit(mediaItem);
							close();
						}}>
						{i18n.t(`mediaItem.list.edit.${mediaItem.mediaType}`)}
					</button>
					<button
						type='button'
						className='responsive-action-menu-button responsive-action-menu-button-danger media-item-context-menu-button media-item-context-menu-button-danger'
						onClick={() => {
							this.setState({
								deleteConfirmationVisible: true
							});
						}}>
						{i18n.t(`mediaItem.list.delete.${mediaItem.mediaType}`)}
					</button>
					{visibility.canMarkAsRedo && (
						<button
							type='button'
							className='responsive-action-menu-button media-item-context-menu-button'
							onClick={() => {
								this.props.markAsRedo(mediaItem);
								close();
							}}>
							{i18n.t(`mediaItem.list.markRedo.${mediaItem.mediaType}`)}
						</button>
					)}
					{visibility.canMarkAsActive && (
						<button
							type='button'
							className='responsive-action-menu-button media-item-context-menu-button'
							onClick={() => {
								this.props.markAsActive(mediaItem);
								close();
							}}>
							{i18n.t(`mediaItem.list.markActive.${mediaItem.mediaType}`)}
						</button>
					)}
					{visibility.canMarkAsComplete && (
						<button
							type='button'
							className='responsive-action-menu-button media-item-context-menu-button'
							onClick={() => {
								this.props.markAsComplete(mediaItem);
								close();
							}}>
							{i18n.t(`mediaItem.list.markComplete.${mediaItem.mediaType}`)}
						</button>
					)}
					{visibility.canViewGroup && mediaItem.group && (
						<button
							type='button'
							className='responsive-action-menu-button media-item-context-menu-button'
							onClick={() => {
								this.props.viewGroup(mediaItem.group as GroupInternal);
								close();
							}}>
							{i18n.t('mediaItem.list.viewGroup')}
						</button>
					)}
				</div>
			</>
		);
	}

	/**
	 * Resolves which media-item actions should be shown for the current row state
	 * @param mediaItem current media item
	 * @returns action visibility flags
	 */
	private getVisibility(mediaItem: MediaItemInternal): MediaItemContextMenuVisibility {
		return {
			canMarkAsRedo: mediaItem.status === 'COMPLETE',
			canMarkAsActive: mediaItem.status === 'REDO' || mediaItem.status === 'NEW',
			canMarkAsComplete: mediaItem.status === 'REDO' || mediaItem.status === 'NEW' || mediaItem.status === 'ACTIVE',
			canViewGroup: Boolean(mediaItem.group?.id) && mediaItem.group?.id !== this.props.currentViewGroupId
		};
	}

	/**
	 * Counts the number of visible menu actions
	 * @param visibility action visibility flags
	 * @returns action count
	 */
	private getActionsCount(visibility: MediaItemContextMenuVisibility): number {
		return 2 +
			Number(visibility.canMarkAsRedo) +
			Number(visibility.canMarkAsActive) +
			Number(visibility.canMarkAsComplete) +
			Number(visibility.canViewGroup);
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
	 * Bounding rect of the options button that opened the menu
	 */
	anchorRect?: MediaItemContextMenuAnchorRect;

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

type MediaItemContextMenuVisibility = {
	canMarkAsRedo: boolean;
	canMarkAsActive: boolean;
	canMarkAsComplete: boolean;
	canViewGroup: boolean;
};

export type MediaItemContextMenuAnchorRect = ResponsiveActionMenuAnchorRect;
