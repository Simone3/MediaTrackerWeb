import React, { Component, ReactNode } from 'react';
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
			selectMediaItem,
			highlightMediaItem
		} = this.props;
		const emptyMessage = i18n.t(`mediaItem.list.empty.${category.mediaType}`);

		return (
			<section className='media-items-list'>
				<div className='media-items-list-header'>
					<h2 className='media-items-list-title'>{i18n.t(`category.mediaTypes.${category.mediaType}`)}</h2>
					<button type='button' className='media-items-list-refresh' onClick={refreshMediaItems}>
						Refresh
					</button>
				</div>
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
	 * Callback to refresh the media items list
	 */
	refreshMediaItems: () => void;
}
