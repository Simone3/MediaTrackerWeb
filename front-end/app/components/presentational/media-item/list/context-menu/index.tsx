import { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { ResponsiveActionMenuAction, ResponsiveActionMenuAnchorRect, ResponsiveActionMenuComponent } from 'app/components/presentational/generic/responsive-action-menu';
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
		const actions = this.getActions(mediaItem, close, visibility);

		return (
			<>
				<ResponsiveActionMenuComponent
					visible={true}
					anchorRect={this.props.anchorRect}
					title={mediaItem.name}
					closeAriaLabel={i18n.t('common.a11y.closeMediaItemActions')}
					onClose={close}
					escapeDisabled={this.state.deleteConfirmationVisible}
					actions={actions}
				/>
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
	 * Builds the menu actions for the current media item
	 * @param mediaItem active media item
	 * @param close callback to close the menu
	 * @param visibility action visibility flags
	 * @returns the shared menu actions
	 */
	private getActions(mediaItem: MediaItemInternal, close: () => void, visibility: MediaItemContextMenuVisibility): ResponsiveActionMenuAction[] {
		const actions: ResponsiveActionMenuAction[] = [
			{
				label: i18n.t(`mediaItem.list.edit.${mediaItem.mediaType}`),
				onClick: () => {
					this.props.edit(mediaItem);
					close();
				}
			},
			{
				label: i18n.t(`mediaItem.list.delete.${mediaItem.mediaType}`),
				onClick: () => {
					this.setState({
						deleteConfirmationVisible: true
					});
				},
				tone: 'danger'
			}
		];

		if(visibility.canMarkAsRedo) {
			actions.push({
				label: i18n.t(`mediaItem.list.markRedo.${mediaItem.mediaType}`),
				onClick: () => {
					this.props.markAsRedo(mediaItem);
					close();
				}
			});
		}

		if(visibility.canMarkAsActive) {
			actions.push({
				label: i18n.t(`mediaItem.list.markActive.${mediaItem.mediaType}`),
				onClick: () => {
					this.props.markAsActive(mediaItem);
					close();
				}
			});
		}

		if(visibility.canMarkAsComplete) {
			actions.push({
				label: i18n.t(`mediaItem.list.markComplete.${mediaItem.mediaType}`),
				onClick: () => {
					this.props.markAsComplete(mediaItem);
					close();
				}
			});
		}

		if(visibility.canViewGroup && mediaItem.group) {
			actions.push({
				label: i18n.t('mediaItem.list.viewGroup'),
				onClick: () => {
					this.props.viewGroup(mediaItem.group);
					close();
				}
			});
		}

		return actions;
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
