import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { TvShowSeasonsListScreenComponent, TvShowSeasonsListScreenComponentInput, TvShowSeasonsListScreenComponentOutput } from 'app/components/presentational/tv-show-season/list/screen';
import { completeTvShowSeasonsHandling, deleteTvShowSeason, inlineUpdateTvShowSeason, loadNewTvShowSeasonDetails, loadTvShowSeasonDetails } from 'app/redux/actions/tv-show-season/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const selectInput = (state: State): TvShowSeasonsListScreenComponentInput => {
	return {
		tvShowSeasons: state.tvShowSeasonsList.tvShowSeasons
	};
};

const buildOutput = (dispatch: Dispatch): TvShowSeasonsListScreenComponentOutput => {
	return {
		loadNewTvShowSeasonDetails: () => {
			dispatch(loadNewTvShowSeasonDetails());
		},
		editTvShowSeason: (tvShowSeason) => {
			dispatch(loadTvShowSeasonDetails(tvShowSeason));
		},
		deleteTvShowSeason: (tvShowSeason) => {
			dispatch(deleteTvShowSeason(tvShowSeason));
		},
		completeTvShowSeason: (tvShowSeason) => {
			dispatch(inlineUpdateTvShowSeason({
				...tvShowSeason,
				watchedEpisodesNumber: tvShowSeason.episodesNumber
			}));
		},
		completeHandling: () => {
			dispatch(completeTvShowSeasonsHandling());
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for TvShowSeasonsListScreenComponent
 * @returns the connected TV show seasons list screen
 */
export const TvShowSeasonsListScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <TvShowSeasonsListScreenComponent {...input} {...output} />;
};
