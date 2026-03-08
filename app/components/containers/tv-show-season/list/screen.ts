import { TvShowSeasonsListScreenComponent, TvShowSeasonsListScreenComponentInput, TvShowSeasonsListScreenComponentOutput } from 'app/components/presentational/tv-show-season/list/screen';
import { completeTvShowSeasonsHandling, deleteTvShowSeason, inlineUpdateTvShowSeason, loadNewTvShowSeasonDetails, loadTvShowSeasonDetails } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): TvShowSeasonsListScreenComponentInput => {
	return {
		tvShowSeasons: state.tvShowSeasonsList.tvShowSeasons
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowSeasonsListScreenComponentOutput => {
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
 */
export const TvShowSeasonsListScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowSeasonsListScreenComponent);
