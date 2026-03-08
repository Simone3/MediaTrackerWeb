import { TvShowSeasonContextMenuComponent, TvShowSeasonContextMenuComponentInput, TvShowSeasonContextMenuComponentOutput } from 'app/components/presentational/tv-show-season/list/context-menu';
import { deleteTvShowSeason, inlineUpdateTvShowSeason, loadTvShowSeasonDetails, removeTvShowSeasonHighlight } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): TvShowSeasonContextMenuComponentInput => {
	
	return {
		tvShowSeason: state.tvShowSeasonsList.highlightedTvShowSeason
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowSeasonContextMenuComponentOutput => {

	return {
		delete: (tvShowSeason) => {
			dispatch(deleteTvShowSeason(tvShowSeason));
		},
		edit: (tvShowSeason) => {
			dispatch(loadTvShowSeasonDetails(tvShowSeason));
		},
		complete: (tvShowSeason) => {
			tvShowSeason = {
				...tvShowSeason,
				watchedEpisodesNumber: tvShowSeason.episodesNumber
			};
			dispatch(inlineUpdateTvShowSeason(tvShowSeason));
		},
		close: () => {
			dispatch(removeTvShowSeasonHighlight());
		}
	};
};

/**
 * Container component that handles Redux state for TvShowSeasonContextMenuComponent
 */
export const TvShowSeasonContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowSeasonContextMenuComponent);
