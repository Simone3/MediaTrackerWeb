import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { buildCommonMediaItemFormOutput, useCommonMediaItemFormInput } from 'app/components/containers/media-item/details/form/media-item';
import { TvShowFormComponent, TvShowFormComponentProps } from 'app/components/presentational/media-item/details/form/wrapper/tv-show';
import { CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { startTvShowSeasonsHandling } from 'app/redux/actions/tv-show-season/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

type TvShowFormContainerInput = Pick<TvShowFormComponentProps, 'loadSeasons' | 'loadSeasonsTimestamp'>;
type TvShowFormContainerOutput = CommonMediaItemFormComponentOutput & Pick<TvShowFormComponentProps, 'handleTvShowSeasons'>;

const selectSeasonsInput = (state: State): TvShowFormContainerInput => {
	return {
		loadSeasons: state.tvShowSeasonsList.tvShowSeasons,
		loadSeasonsTimestamp: state.tvShowSeasonsList.completeHandlingTimestamp
	};
};

const buildOutput = (dispatch: Dispatch): TvShowFormContainerOutput => {
	return {
		...buildCommonMediaItemFormOutput(dispatch),
		handleTvShowSeasons: (currentSeasons) => {
			dispatch(startTvShowSeasonsHandling(currentSeasons || []));
		}
	};
};

/**
 * Container component that injects TV-show-specific seasons state into the generic media-item details flow
 * @returns the connected TV show form
 */
export const TvShowFormContainer = (): ReactElement => {
	const input = useCommonMediaItemFormInput();
	const seasonsInput = useContainerInput(selectSeasonsInput);
	const output = useContainerOutput(buildOutput);

	return <TvShowFormComponent {...input} {...seasonsInput} {...output} />;
};
