import React, { Component, ReactNode } from 'react';
import { CATEGORIES_MOBILE_BREAKPOINT } from 'app/components/presentational/category/list/constants';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the media item options popup
 */
export class MediaItemContextMenuComponent extends Component<MediaItemContextMenuComponentInput & MediaItemContextMenuComponentOutput, MediaItemContextMenuComponentState> {
	public state: MediaItemContextMenuComponentState = {
		deleteConfirmationVisible: false,
		isMobileLayout: this.isMobileLayout()
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('resize', this.handleResize);
	}

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
	public componentWillUnmount(): void {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('resize', this.handleResize);
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
				{this.state.isMobileLayout ?
					this.renderSheet(mediaItem, close, {
						canMarkAsRedo,
						canMarkAsActive,
						canMarkAsComplete,
						canViewGroup
					}) :
					this.renderPopover(mediaItem, close, {
						canMarkAsRedo,
						canMarkAsActive,
						canMarkAsComplete,
						canViewGroup
					})}
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
	 * Renders the mobile bottom sheet menu
	 * @param mediaItem active media item
	 * @param close callback to close the menu
	 * @param visibility action visibility flags
	 * @returns the mobile menu node
	 */
	private renderSheet(mediaItem: MediaItemInternal, close: () => void, visibility: MediaItemContextMenuVisibility): ReactNode {
		return (
			<div className='media-item-context-menu-overlay' role='presentation' onClick={close}>
				<div
					className='media-item-context-menu media-item-context-menu-sheet'
					role='dialog'
					aria-modal={true}
					aria-labelledby='media-item-context-menu-title'
					onClick={(event) => {
						event.stopPropagation();
					}}>
					<div className='media-item-context-menu-handle' />
					{this.renderMenuContent(mediaItem, close, visibility)}
				</div>
			</div>
		);
	}

	/**
	 * Renders the desktop popover menu
	 * @param mediaItem active media item
	 * @param close callback to close the menu
	 * @param visibility action visibility flags
	 * @returns the desktop popover node
	 */
	private renderPopover(mediaItem: MediaItemInternal, close: () => void, visibility: MediaItemContextMenuVisibility): ReactNode {
		return (
			<div className='media-item-context-menu-layer' role='presentation'>
				<button
					type='button'
					className='media-item-context-menu-dismiss'
					onClick={close}
					aria-label={i18n.t('common.a11y.closeMediaItemActions')}
				/>
				<div
					className='media-item-context-menu media-item-context-menu-popover'
					role='dialog'
					aria-modal={false}
					aria-labelledby='media-item-context-menu-title'
					style={this.getPopoverStyle(visibility)}>
					{this.renderMenuContent(mediaItem, close, visibility)}
				</div>
			</div>
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
				<header className='media-item-context-menu-header'>
					<h2 id='media-item-context-menu-title' className='media-item-context-menu-title'>{mediaItem.name}</h2>
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
					{visibility.canMarkAsRedo && (
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
					{visibility.canMarkAsActive && (
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
					{visibility.canMarkAsComplete && (
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
					{visibility.canViewGroup && mediaItem.group && (
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
			</>
		);
	}

	/**
	 * Computes the desktop popover position from the clicked options button
	 * @param visibility action visibility flags
	 * @returns style object for the popover
	 */
	private getPopoverStyle(visibility: MediaItemContextMenuVisibility): React.CSSProperties {
		const popoverWidth = 304;
		const actionsCount = 2 +
			Number(visibility.canMarkAsRedo) +
			Number(visibility.canMarkAsActive) +
			Number(visibility.canMarkAsComplete) +
			Number(visibility.canViewGroup);
		const popoverHeight = 52 + (actionsCount * 58);
		const viewportPadding = 16;
		const anchorRect = this.props.anchorRect;

		if(!anchorRect) {
			return {
				top: viewportPadding,
				right: viewportPadding
			};
		}

		const left = Math.min(
			Math.max(viewportPadding, anchorRect.right - popoverWidth),
			window.innerWidth - popoverWidth - viewportPadding
		);
		const openAbove = anchorRect.bottom + 12 + popoverHeight > window.innerHeight - viewportPadding;
		const top = openAbove ?
			Math.max(viewportPadding, anchorRect.top - popoverHeight - 12) :
			Math.min(anchorRect.bottom + 12, window.innerHeight - popoverHeight - viewportPadding);

		return {
			top,
			left
		};
	}

	/**
	 * Closes the menu when Escape is pressed
	 * @param event keyboard event
	 */
	private handleKeyDown = (event: KeyboardEvent): void => {
		if(event.key === 'Escape' && this.props.mediaItem && !this.state.deleteConfirmationVisible) {
			this.props.close();
		}
	};

	/**
	 * Updates the responsive layout state
	 */
	private handleResize = (): void => {
		const isMobileLayout = this.isMobileLayout();

		if(isMobileLayout !== this.state.isMobileLayout) {
			this.setState({
				isMobileLayout
			});
		}
	};

	/**
	 * Checks whether the viewport should use the mobile sheet
	 * @returns true if the mobile sheet should be shown
	 */
	private isMobileLayout(): boolean {
		return window.innerWidth <= CATEGORIES_MOBILE_BREAKPOINT;
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
	isMobileLayout: boolean;
};

type MediaItemContextMenuVisibility = {
	canMarkAsRedo: boolean;
	canMarkAsActive: boolean;
	canMarkAsComplete: boolean;
	canViewGroup: boolean;
};

export type MediaItemContextMenuAnchorRect = {
	top: number;
	bottom: number;
	left: number;
	right: number;
	width: number;
	height: number;
};
