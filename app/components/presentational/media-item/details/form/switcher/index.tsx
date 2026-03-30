import { ReactElement } from 'react';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { BookFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/book';
import { MovieFormComponent } from 'app/components/presentational/media-item/details/form/wrapper/movie';
import { TvShowFormContainer } from 'app/components/containers/media-item/details/form/tv-show';
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
			book={
				<BookFormComponent
					{...props}
				/>
			}
			movie={
				<MovieFormComponent
					{...props}
				/>
			}
			tvShow={
				<TvShowFormContainer
					{...props}
				/>
			}
			videogame={
				<VideogameFormComponent
					{...props}
				/>
			}
		/>
	);
};

/**
 * MediaItemFormSwitcherComponent's props
 */
export type MediaItemFormSwitcherComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput;
