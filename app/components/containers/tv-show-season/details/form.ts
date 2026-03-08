
import { TvShowSeasonFormComponent, TvShowSeasonFormComponentInput, TvShowSeasonFormComponentOutput } from 'app/components/presentational/tv-show-season/details/form/wrapper';
import { AppError } from 'app/data/models/internal/error';
import { saveTvShowSeason, setTvShowSeasonFormStatus } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): TvShowSeasonFormComponentInput => {
	
	if(!state.tvShowSeasonDetails.tvShowSeason) {

		throw AppError.GENERIC.withDetails('App navigated to the details screen with undefined details');
	}
	
	return {
		initialValues: state.tvShowSeasonDetails.tvShowSeason,
		saveRequested: state.tvShowSeasonDetails.saveStatus === 'REQUESTED',
		addingNewSeason: state.tvShowSeasonDetails.formMode === 'NEW'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowSeasonFormComponentOutput => {

	return {
		saveTvShowSeason: (tvShowSeason) => {
			dispatch(saveTvShowSeason(tvShowSeason));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setTvShowSeasonFormStatus(valid, dirty));
		}
	};
};

/**
 * Container component that handles Redux state for TvShowSeasonFormComponent
 */
export const TvShowSeasonFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowSeasonFormComponent);
