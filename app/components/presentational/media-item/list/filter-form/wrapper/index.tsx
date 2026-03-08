import React, { Component, ReactNode } from 'react';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaTypeSwitcherComponent } from 'app/components/presentational/generic/media-switcher';
import { MovieFilterFormComponent } from 'app/components/presentational/media-item/list/filter-form/wrapper/movie';
import { BookFilterFormComponent } from 'app/components/presentational/media-item/list/filter-form/wrapper/book';
import { TvShowFilterFormComponent } from 'app/components/presentational/media-item/list/filter-form/wrapper/tv-show';
import { VideogameFilterFormComponent } from 'app/components/presentational/media-item/list/filter-form/wrapper/videogame';

/**
 * Presentational component that switches on the correct media item filter form component based on its media type.
 * This is the entry point of the media item filter form.
 */
export class MediaItemFilterFormComponent extends Component<MediaItemFilterFormComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<MediaTypeSwitcherComponent
				discriminator={this.props.category}
				book={<BookFilterFormComponent {...this.props}/>}
				movie={<MovieFilterFormComponent {...this.props}/>}
				tvShow={<TvShowFilterFormComponent {...this.props}/>}
				videogame={<VideogameFilterFormComponent {...this.props}/>}
			/>
		);
	}
}

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
}

/**
 * MediaItemFilterFormComponent's output props
 */
export type MediaItemFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
