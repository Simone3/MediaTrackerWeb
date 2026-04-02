import { ReactElement } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { BookFilterFormComponent } from './book';
import { MovieFilterFormComponent } from './movie';
import { TvShowFilterFormComponent } from './tv-show';
import { VideogameFilterFormComponent } from './videogame';

/**
 * Presentational component that switches on the correct media item filter form component based on its media type
 * @param props the component props
 * @returns the component
 */
export const MediaItemFilterFormComponent = (props: MediaItemFilterFormComponentProps): ReactElement => {
	return (
		<MediaTypeSwitcherComponent
			discriminator={props.category}
			book={<BookFilterFormComponent {...props} />}
			movie={<MovieFilterFormComponent {...props} />}
			tvShow={<TvShowFilterFormComponent {...props} />}
			videogame={<VideogameFilterFormComponent {...props} />}
		/>
	);
};

/**
 * MediaItemFilterFormComponent's input props
 */
export type MediaItemFilterFormComponentInput = {
	/**
	 * The initial filter values for the form inputs
	 */
	initialFilter: MediaItemFilterInternal;

	/**
	 * The initial sort values for the form inputs
	 */
	initialSortBy: MediaItemSortByInternal[];

	/**
	 * The linked category
	 */
	category: CategoryInternal;
}

/**
 * MediaItemFilterFormComponent's output props
 */
export type MediaItemFilterFormComponentOutput = {
	/**
	 * Callback to submit the filter options
	 */
	submitFilter: (filter: MediaItemFilterInternal, sortBy: MediaItemSortByInternal[]) => void;

	/**
	 * Callback when the form requests to be closed
	 */
	close: () => void;
}

/**
 * MediaItemFilterFormComponent's props
 */
export type MediaItemFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
