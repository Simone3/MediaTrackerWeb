import { TvShowSeasonHandlerFieldComponent, TvShowSeasonHandlerFieldComponentInput, TvShowSeasonHandlerFieldComponentOutput } from 'app/components/presentational/form/fields/tv-show-season-handler';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { startTvShowSeasonsHandling } from 'app/redux/actions/tv-show-season/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch, ownProps: TvShowSeasonHandlerFieldContainerProps): TvShowSeasonHandlerFieldComponentOutput => {

	return {
		...ownProps,
		requestSeasonHandling: (currentSeasons?: TvShowSeasonInternal[]) => {
			dispatch(startTvShowSeasonsHandling(currentSeasons ? currentSeasons : []));
		}
	};
};

/**
 * Container component that handles Redux state for TvShowSeasonHandlerFieldComponent
 */
export const TvShowSeasonHandlerFieldContainer = connect(
	null,
	mapDispatchToProps
)(TvShowSeasonHandlerFieldComponent);

/**
 * TvShowSeasonHandlerFieldContainer's input props
 */
export type TvShowSeasonHandlerFieldContainerInput = TvShowSeasonHandlerFieldComponentInput;

/**
 * TvShowSeasonHandlerFieldContainer's props
 */
export type TvShowSeasonHandlerFieldContainerProps = TvShowSeasonHandlerFieldContainerInput;
