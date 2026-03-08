
import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { TvShowFormComponent, TvShowFormComponentInput, TvShowFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/tv-show';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): TvShowFormComponentInput => {
	
	return {
		...commonMediaItemFormMapStateToProps(state),
		loadSeasons: state.tvShowSeasonsList.tvShowSeasons,
		loadSeasonsTimestamp: state.tvShowSeasonsList.completeHandlingTimestamp
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowFormComponentOutput => {

	return {
		...commonMediaItemFormMapDispatchToProps(dispatch)
	};
};

/**
 * Container component that handles Redux state for TvShowFormComponent
 */
export const TvShowFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TvShowFormComponent);
