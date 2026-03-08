import { TvShowSeasonsListComponent, TvShowSeasonsListComponentInput, TvShowSeasonsListComponentOutput } from 'app/components/presentational/tv-show-season/list/list';
import { highlightTvShowSeason, loadTvShowSeasonDetails } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): TvShowSeasonsListComponentInput => {
	
	return {
		tvShowSeasons: state.tvShowSeasonsList.tvShowSeasons
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowSeasonsListComponentOutput => {

	return {
		selectTvShowSeason: (tvShowSeason) => {
			dispatch(loadTvShowSeasonDetails(tvShowSeason));
		},
		highlightTvShowSeason: (tvShowSeason) => {
			dispatch(highlightTvShowSeason(tvShowSeason));
		}
	};
};

/**
 * Container component that handles Redux state for TvShowSeasonsListComponent
 */
export const TvShowSeasonsListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowSeasonsListComponent);
