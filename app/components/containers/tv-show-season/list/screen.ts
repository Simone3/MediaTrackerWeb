import { TvShowSeasonsListScreenComponent, TvShowSeasonsListScreenComponentInput, TvShowSeasonsListScreenComponentOutput } from 'app/components/presentational/tv-show-season/list/screen';
import { loadNewTvShowSeasonDetails } from 'app/redux/actions/tv-show-season/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (): TvShowSeasonsListScreenComponentInput => {
	
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowSeasonsListScreenComponentOutput => {

	return {
		loadNewTvShowSeasonDetails: () => {
			dispatch(loadNewTvShowSeasonDetails());
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
