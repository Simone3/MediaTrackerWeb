import { ReactElement } from 'react';
import { BookFilterFormComponent } from './book';
import { MovieFilterFormComponent } from './movie';
import { TvShowFilterFormComponent } from './tv-show';
import { VideogameFilterFormComponent } from './videogame';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaItemFilterFormOption } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { CategoryInternal } from 'app/data/models/internal/category';

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

	/**
	 * The options of the group filter input
	 */
	groupOptions: MediaItemFilterFormOption[];

	/**
	 * The options of the own platform filter input
	 */
	ownPlatformOptions: MediaItemFilterFormOption[];

	/**
	 * If the groups are being fetched
	 */
	groupsLoading: boolean;

	/**
	 * If the own platforms are being fetched
	 */
	ownPlatformsLoading: boolean;
};

/**
 * MediaItemFilterFormComponent's output props
 */
export type MediaItemFilterFormComponentOutput = {
	/**
	 * Callback to submit the filter options
	 */
	submitFilter: (filter: MediaItemFilterInternal, sortBy: MediaItemSortByInternal[]) => void;

	/**
	 * Callback to reset the filter options to the defaults
	 */
	clearFilter: () => void;

	/**
	 * Callback when the form requests to be closed
	 */
	close: () => void;
};

/**
 * MediaItemFilterFormComponent's props
 */
export type MediaItemFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
