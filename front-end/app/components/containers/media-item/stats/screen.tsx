import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { MediaItemsStatsScreenComponent, MediaItemsStatsScreenComponentInput, MediaItemsStatsScreenComponentOutput } from 'app/components/presentational/media-item/stats/screen';
import { AppError } from 'app/data/models/internal/error';
import { fetchMediaItemsStats } from 'app/redux/actions/media-item/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const selectInput = (state: State): MediaItemsStatsScreenComponentInput => {
	const statsState = state.mediaItemsStats;
	const category = state.categoryGlobal.selectedCategory;
	if(!category) {
		throw AppError.GENERIC.withDetails('App navigated to the media items stats screen without category data');
	}

	return {
		category: category,
		stats: statsState.stats,
		ownPlatforms: state.ownPlatformsList.ownPlatforms,
		isLoading: statsState.status === 'FETCHING',
		requiresFetch: statsState.status === 'REQUIRES_FETCH',
		showFetchError: statsState.status === 'FETCH_FAILED'
	};
};

const buildOutput = (dispatch: Dispatch): MediaItemsStatsScreenComponentOutput => {
	return {
		fetchStats: () => {
			dispatch(fetchMediaItemsStats());
		},

		// Leaving is a plain navigation and not a saga: there is no state to settle first, exactly as on the credits screen
		back: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemsStatsScreenComponent
 * @returns the connected media items stats screen
 */
export const MediaItemsStatsScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <MediaItemsStatsScreenComponent {...input} {...output} />;
};
