import { ReactElement } from 'react';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { BookFormContainer } from 'app/components/containers/media-item/details/form/book';
import { MovieFormContainer } from 'app/components/containers/media-item/details/form/movie';
import { TvShowFormContainer } from 'app/components/containers/media-item/details/form/tv-show';
import { VideogameFormContainer } from 'app/components/containers/media-item/details/form/videogame';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * Presentational component that switches on the correct media item form based on its media type
 * @param props the component props
 * @returns the component
 */
export const MediaItemFormSwitcherComponent = (props: MediaItemFormSwitcherComponentProps): ReactElement => {
	return (
		<MediaTypeSwitcherComponent
			discriminator={props.mediaItem}
			book={
				<BookFormContainer/>
			}
			movie={
				<MovieFormContainer/>
			}
			tvShow={
				<TvShowFormContainer/>
			}
			videogame={
				<VideogameFormContainer/>
			}
		/>
	);
};

/**
 * MediaItemFormSwitcherComponent's props
 */
export type MediaItemFormSwitcherComponentProps = {
	/**
	 * Media item used to select the correct form container
	 */
	mediaItem: MediaItemInternal;
};
