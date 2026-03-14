import React, { Component, ReactNode } from 'react';
import { MediaItemContextMenuComponent } from 'app/components/presentational/media-item/list/context-menu';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';
import { CategoryInternal } from 'app/data/models/internal/category';

/**
 * Presentational component to display the list of user media items
 */
export class MediaItemsListComponent extends Component<MediaItemsListComponentInput & MediaItemsListComponentOutput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			mediaItems,
			category,
			refreshMediaItems,
			openFilters,
			selectMediaItem,
			highlightMediaItem,
			highlightedMediaItem,
			currentViewGroup,
			editMediaItem,
			deleteMediaItem,
			markMediaItemAsActive,
			markMediaItemAsComplete,
			markMediaItemAsRedo,
			viewMediaItemGroup,
			closeMediaItemMenu,
			exitViewGroupMode
		} = this.props;
		const emptyMessage = i18n.t(`mediaItem.list.empty.${category.mediaType}`);

		return (
			<section className='media-items-list'>
				<div className='media-items-list-header'>
					<h2 className='media-items-list-title'>{i18n.t(`category.mediaTypes.${category.mediaType}`)}</h2>
					<button type='button' className='media-items-list-refresh' onClick={refreshMediaItems}>
						Refresh
					</button>
					<button type='button' className='media-items-list-refresh' onClick={openFilters}>
						Filter
					</button>
				</div>
				{currentViewGroup && (
					<div className='media-items-list-view-group-banner'>
						<div className='media-items-list-view-group-copy'>
							<span className='media-items-list-view-group-label'>{i18n.t('mediaItem.list.viewGroup')}</span>
							<strong className='media-items-list-view-group-name'>{currentViewGroup.name}</strong>
						</div>
						<button type='button' className='media-items-list-view-group-exit' onClick={exitViewGroupMode}>
							Back
						</button>
					</div>
				)}
				{mediaItems.length === 0 && (
					<p className='media-items-list-empty'>{emptyMessage}</p>
				)}
				{mediaItems.length > 0 && (
					<ul className='media-items-list-items'>
						{mediaItems.map((mediaItem) => {
							return (
								<li key={mediaItem.id} className='media-item-row'>
									<button
										type='button'
										className='media-item-row-main'
										onClick={() => {
											selectMediaItem(mediaItem);
										}}>
										<span className='media-item-row-name'>{mediaItem.name}</span>
										<span className='media-item-row-meta'>{this.getMediaItemMetadata(mediaItem)}</span>
									</button>
									<button
										type='button'
										className='media-item-row-options'
										onClick={() => {
											highlightMediaItem(mediaItem);
										}}
										aria-label={`Options for ${mediaItem.name}`}>
										⋮
									</button>
								</li>
							);
						})}
					</ul>
				)}
				<MediaItemContextMenuComponent
					mediaItem={highlightedMediaItem}
					currentViewGroupId={currentViewGroup?.id}
					edit={editMediaItem}
					delete={deleteMediaItem}
					markAsActive={markMediaItemAsActive}
					markAsComplete={markMediaItemAsComplete}
					markAsRedo={markMediaItemAsRedo}
					viewGroup={viewMediaItemGroup}
					close={closeMediaItemMenu}
				/>
			</section>
		);
	}

	/**
	 * Helper method to build row metadata text for a media item
	 * @param mediaItem the media item
	 * @returns the metadata text
	 */
	private getMediaItemMetadata(mediaItem: MediaItemInternal): string {
		const metadata: string[] = [];
		if(mediaItem.importance) {
			metadata.push(i18n.t(`mediaItem.common.importance.${mediaItem.importance}`));
		}
		if(mediaItem.status) {
			metadata.push(mediaItem.status);
		}
		if(mediaItem.group && mediaItem.group.name) {
			metadata.push(mediaItem.group.name);
		}
		if(mediaItem.ownPlatform && mediaItem.ownPlatform.name) {
			metadata.push(mediaItem.ownPlatform.name);
		}

		return metadata.join(' • ');
	}
}

/**
 * MediaItemsListComponent's input props
 */
export type MediaItemsListComponentInput = {
	/**
	 * The linked category
	 */
	category: CategoryInternal;

	/**
	 * The media items list to be displayed
	 */
	mediaItems: MediaItemInternal[];

	/**
	 * The currently highlighted media item, if any
	 */
	highlightedMediaItem: MediaItemInternal | undefined;

	/**
	 * The currently viewed group, if the list is filtered by group
	 */
	currentViewGroup?: GroupInternal;
}

/**
 * MediaItemsListComponent's output props
 */
export type MediaItemsListComponentOutput = {
	/**
	 * Callback to select a media item, e.g. to open its details
	 */
	selectMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to set a mediaItem as highlighted, e.g. to open its dialog menu
	 */
	highlightMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to edit a media item from the context menu
	 */
	editMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to delete a media item from the context menu
	 */
	deleteMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to mark a media item as active from the context menu
	 */
	markMediaItemAsActive: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to mark a media item as complete from the context menu
	 */
	markMediaItemAsComplete: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to mark a media item as redo from the context menu
	 */
	markMediaItemAsRedo: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to view all media items in a group from the context menu
	 */
	viewMediaItemGroup: (group: GroupInternal) => void;

	/**
	 * Callback to close the media item context menu
	 */
	closeMediaItemMenu: () => void;

	/**
	 * Callback to refresh the media items list
	 */
	refreshMediaItems: () => void;

	/**
	 * Callback to open filter modal
	 */
	openFilters: () => void;

	/**
	 * Callback to exit the current view-group mode
	 */
	exitViewGroupMode: () => void;
}
