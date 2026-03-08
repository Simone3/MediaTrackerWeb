import { TvShowSeasonDetailsScreenComponent, TvShowSeasonDetailsScreenComponentInput } from 'app/components/presentational/tv-show-season/details/screen';
import { connect } from 'react-redux';

const mapStateToProps = (): TvShowSeasonDetailsScreenComponentInput => {
	
	return {};
};

/**
 * Container component that handles Redux state for TvShowSeasonDetailsScreenComponent
 */
export const TvShowSeasonDetailsScreenContainer = connect(
	mapStateToProps,
	null
)(TvShowSeasonDetailsScreenComponent);
