import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TvShowSeasonDetailsScreenComponent, TvShowSeasonDetailsScreenComponentInput, TvShowSeasonDetailsScreenComponentOutput } from 'app/components/presentational/tv-show-season/details/screen';
import { DEFAULT_TV_SHOW_SEASON } from 'app/data/models/internal/media-items/tv-show';
import { saveTvShowSeason, setTvShowSeasonFormStatus } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const mapStateToProps = (state: State): TvShowSeasonDetailsScreenComponentInput => {
	return {
		tvShowSeason: state.tvShowSeasonDetails.tvShowSeason || DEFAULT_TV_SHOW_SEASON,
		addingNewSeason: state.tvShowSeasonDetails.formMode === 'NEW'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowSeasonDetailsScreenComponentOutput => {
	return {
		saveTvShowSeason: (tvShowSeason) => {
			dispatch(saveTvShowSeason(tvShowSeason));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setTvShowSeasonFormStatus(valid, dirty));
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for TvShowSeasonDetailsScreenComponent
 */
export const TvShowSeasonDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowSeasonDetailsScreenComponent);
