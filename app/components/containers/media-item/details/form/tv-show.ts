import { TvShowFormComponent, TvShowFormComponentProps } from 'app/components/presentational/media-item/details/form/wrapper/tv-show';
import { startTvShowSeasonsHandling } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): Pick<TvShowFormComponentProps, 'loadSeasons' | 'loadSeasonsTimestamp'> => {
	return {
		loadSeasons: state.tvShowSeasonsList.tvShowSeasons,
		loadSeasonsTimestamp: state.tvShowSeasonsList.completeHandlingTimestamp
	};
};

const mapDispatchToProps = (dispatch: Dispatch): Pick<TvShowFormComponentProps, 'handleTvShowSeasons'> => {
	return {
		handleTvShowSeasons: (currentSeasons) => {
			dispatch(startTvShowSeasonsHandling(currentSeasons || []));
		}
	};
};

/**
 * Container component that injects TV-show-specific seasons state into the generic media-item details flow
 */
export const TvShowFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowFormComponent);
