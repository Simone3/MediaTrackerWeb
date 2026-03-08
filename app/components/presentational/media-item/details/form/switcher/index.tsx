import React, { Component, ReactNode } from 'react';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { BookFormContainer } from 'app/components/containers/media-item/details/form/book';
import { MovieFormContainer } from 'app/components/containers/media-item/details/form/movie';
import { TvShowFormContainer } from 'app/components/containers/media-item/details/form/tv-show';
import { VideogameFormContainer } from 'app/components/containers/media-item/details/form/videogame';

/**
 * Presentational component that switches on the correct media item form container based on its media type
 */
export class MediaItemFormSwitcherComponent extends Component<MediaItemFormSwitcherComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<MediaTypeSwitcherComponent
				discriminator={this.props.mediaItem}
				book={<BookFormContainer />}
				movie={<MovieFormContainer />}
				tvShow={<TvShowFormContainer />}
				videogame={<VideogameFormContainer />}
			/>
		);
	}
}

/**
 * MediaItemFormContainer's input props
 */
export type MediaItemFormSwitcherComponentInput = {

	mediaItem: MediaItemInternal;
};

/**
 * MediaItemFormContainer's props
 */
export type MediaItemFormSwitcherComponentProps = MediaItemFormSwitcherComponentInput;
