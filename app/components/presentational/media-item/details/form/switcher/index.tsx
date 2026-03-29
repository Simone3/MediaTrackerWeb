import { ReactElement } from 'react';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { BookFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/book';
import { MovieFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/movie';
import { TvShowFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/tv-show';
import { VideogameFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/videogame';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';

/**
 * Presentational component that switches on the correct media item form based on its media type
 * @param props the component props
 * @returns the component
 */
export const MediaItemFormSwitcherComponent = (props: MediaItemFormSwitcherComponentProps): ReactElement => {
	return (
		<MediaTypeSwitcherComponent
			discriminator={props.initialValues}
			book={<BookFormComponent {...props} />}
			movie={<MovieFormComponent {...props} />}
			tvShow={
				<TvShowFormComponent
					{...props}
					loadSeasons={props.tvShowSeasons}
					loadSeasonsTimestamp={props.tvShowSeasonsLoadTimestamp}
				/>
			}
			videogame={<VideogameFormComponent {...props} />}
		/>
	);
};

/**
 * MediaItemFormSwitcherComponent's props
 */
export type MediaItemFormSwitcherComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput & {
	/**
	 * TV show seasons loaded from seasons flow
	 */
	tvShowSeasons: TvShowSeasonInternal[];

	/**
	 * Timestamp updated when seasons flow is completed
	 */
	tvShowSeasonsLoadTimestamp: Date | undefined;
};
