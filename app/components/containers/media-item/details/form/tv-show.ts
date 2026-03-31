import { commonMediaItemFormMapDispatchToProps, commonMediaItemFormMapStateToProps } from 'app/components/containers/media-item/details/form/media-item';
import { TvShowFormComponent, TvShowFormComponentProps } from 'app/components/presentational/media-item/details/form/wrapper/tv-show';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { startTvShowSeasonsHandling } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

type TvShowFormContainerStateProps = CommonMediaItemFormComponentInputMain<TvShowInternal> & Pick<TvShowFormComponentProps, 'loadSeasons' | 'loadSeasonsTimestamp'>;
type TvShowFormContainerDispatchProps = CommonMediaItemFormComponentOutput & Pick<TvShowFormComponentProps, 'handleTvShowSeasons'>;

const mapStateToProps = (state: State): TvShowFormContainerStateProps => {
	const commonProps = commonMediaItemFormMapStateToProps(state);

	return {
		...commonProps,
		initialValues: commonProps.initialValues as TvShowInternal,
		restoredDraft: commonProps.restoredDraft as TvShowInternal | undefined,
		loadSeasons: state.tvShowSeasonsList.tvShowSeasons,
		loadSeasonsTimestamp: state.tvShowSeasonsList.completeHandlingTimestamp
	};
};

const mapDispatchToProps = (dispatch: Dispatch): TvShowFormContainerDispatchProps => {
	return {
		...commonMediaItemFormMapDispatchToProps(dispatch),
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
