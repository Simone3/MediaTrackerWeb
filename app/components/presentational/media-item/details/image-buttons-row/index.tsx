import React, { Component, ReactNode } from 'react';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { BookImageButtonsRowComponent } from 'app/components/presentational/media-item/details/image-buttons-row/book';
import { MovieImageButtonsRowComponent } from 'app/components/presentational/media-item/details/image-buttons-row/movie';
import { TvShowImageButtonsRowComponent } from 'app/components/presentational/media-item/details/image-buttons-row/tv-show';
import { VideogameImageButtonsRowComponent } from 'app/components/presentational/media-item/details/image-buttons-row/videogame';

/**
 * Presentational component to display the media item image with the search/download/etc. buttons
 */
export class MediaItemImageButtonsRowComponent extends Component<MediaItemImageButtonsRowComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
	
		return (
			<MediaTypeSwitcherComponent
				discriminator={this.props.mediaItem}
				book={<BookImageButtonsRowComponent {...this.props}/>}
				movie={<MovieImageButtonsRowComponent {...this.props}/>}
				tvShow={<TvShowImageButtonsRowComponent {...this.props}/>}
				videogame={<VideogameImageButtonsRowComponent {...this.props}/>}
			/>
		);
	}
}

/**
 * MediaItemImageButtonsRowComponent's input props
 */
export type MediaItemImageButtonsRowComponentInput = {

	/**
	 * The source media item image URL
	 */
	mediaItem: MediaItemInternal;
}

/**
 * MediaItemImageButtonsRowComponent's output props
 */
export type MediaItemImageButtonsRowComponentOutput = {

	/**
	 * The callback to reload the catalog details
	 */
	onReloadCatalog: (catalogId: string) => void;
}

/**
 * MediaItemImageButtonsRowComponent's props
 */
export type MediaItemImageButtonsRowComponentProps = MediaItemImageButtonsRowComponentInput & MediaItemImageButtonsRowComponentOutput;
