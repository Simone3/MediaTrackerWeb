import React, { ReactElement } from 'react';
import { BookMediaItemRowComponent } from 'app/components/presentational/media-item/list/row/book';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { MovieMediaItemRowComponent } from 'app/components/presentational/media-item/list/row/movie';
import { TvShowMediaItemRowComponent } from 'app/components/presentational/media-item/list/row/tv-show';
import { VideogameMediaItemRowComponent } from 'app/components/presentational/media-item/list/row/videogame';
import { MediaItemRowComponentProps } from 'app/components/presentational/media-item/list/row/view/media-item';

/**
 * Presentational component to display the correct media item row based on media type
 * @param props the input/output props
 * @returns the component
 */
export const MediaItemRowComponent = (props: MediaItemRowComponentProps): ReactElement => {
	return (
		<MediaTypeSwitcherComponent
			discriminator={props.mediaItem}
			book={<BookMediaItemRowComponent {...props} />}
			movie={<MovieMediaItemRowComponent {...props} />}
			tvShow={<TvShowMediaItemRowComponent {...props} />}
			videogame={<VideogameMediaItemRowComponent {...props} />}
		/>
	);
};
