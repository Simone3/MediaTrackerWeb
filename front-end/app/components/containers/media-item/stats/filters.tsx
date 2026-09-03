import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { MediaItemsStatsFiltersComponent, MediaItemsStatsFiltersComponentInput, MediaItemsStatsFiltersComponentOutput } from 'app/components/presentational/media-item/stats/filters';
import { AppError } from 'app/data/models/internal/error';
import { fetchGroups } from 'app/redux/actions/group/generators';
import { setMediaItemsStatsFilter } from 'app/redux/actions/media-item/generators';
import { fetchOwnPlatforms } from 'app/redux/actions/own-platform/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): MediaItemsStatsFiltersComponentInput => {
	const category = state.categoryGlobal.selectedCategory;
	if(!category) {
		throw AppError.GENERIC.withDetails('App navigated to the media items stats screen without category data');
	}

	const stats = state.mediaItemsStats.stats;
	const groupsStatus = state.groupsList.status;
	const ownPlatformsStatus = state.ownPlatformsList.status;

	return {
		category: category,
		filter: state.mediaItemsStats.filter,
		groups: state.groupsList.groups,
		ownPlatforms: state.ownPlatformsList.ownPlatforms,
		groupsLoaded: groupsStatus === 'FETCHED',
		ownPlatformsLoaded: ownPlatformsStatus === 'FETCHED',
		groupsLoading: groupsStatus === 'FETCHING',
		ownPlatformsLoading: ownPlatformsStatus === 'FETCHING',

		// A failed load is retried the next time the screen opens, which is the only explicit request the user can make here
		groupsRequireFetch: groupsStatus === 'REQUIRES_FETCH' || groupsStatus === 'FETCH_FAILED',
		ownPlatformsRequireFetch: ownPlatformsStatus === 'REQUIRES_FETCH' || ownPlatformsStatus === 'FETCH_FAILED',

		// Both counts come from the same response, so the summary can never report one against a stale other
		filteredCount: stats ? stats.mediaItems.filtered : undefined,
		totalCount: stats ? stats.mediaItems.total : undefined
	};
};

const buildOutput = (dispatch: Dispatch): MediaItemsStatsFiltersComponentOutput => {
	return {
		setFilter: (filter) => {
			dispatch(setMediaItemsStatsFilter(filter));
		},
		fetchGroups: () => {
			dispatch(fetchGroups());
		},
		fetchOwnPlatforms: () => {
			dispatch(fetchOwnPlatforms());
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemsStatsFiltersComponent
 * @returns the connected media items stats filters
 */
export const MediaItemsStatsFiltersContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <MediaItemsStatsFiltersComponent {...input} {...output} />;
};
