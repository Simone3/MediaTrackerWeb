import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { OwnPlatformsListScreenComponent, OwnPlatformsListScreenComponentInput, OwnPlatformsListScreenComponentOutput } from 'app/components/presentational/own-platform/list/screen';
import { deleteOwnPlatform, fetchOwnPlatforms, loadNewOwnPlatformDetails, loadOwnPlatformDetails, selectOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const selectInput = (state: State): OwnPlatformsListScreenComponentInput => {
	const listState = state.ownPlatformsList;

	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH',
		ownPlatforms: listState.ownPlatforms,
		selectedOwnPlatformId: state.ownPlatformGlobal.selectedOwnPlatform?.id,
		showEmptyState: listState.status === 'FETCHED' && listState.ownPlatforms.length === 0,
		showSkeletons: listState.ownPlatforms.length === 0 && (listState.status === 'REQUIRES_FETCH' || listState.status === 'FETCHING')
	};
};

const buildOutput = (dispatch: Dispatch): OwnPlatformsListScreenComponentOutput => {
	return {
		fetchOwnPlatforms: () => {
			dispatch(fetchOwnPlatforms());
		},
		loadNewOwnPlatformDetails: () => {
			dispatch(loadNewOwnPlatformDetails());
		},
		selectOwnPlatform: (ownPlatform) => {
			dispatch(selectOwnPlatform(ownPlatform));
		},
		editOwnPlatform: (ownPlatform) => {
			dispatch(loadOwnPlatformDetails(ownPlatform));
		},
		deleteOwnPlatform: (ownPlatform) => {
			dispatch(deleteOwnPlatform(ownPlatform));
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for OwnPlatformsListScreenComponent
 * @returns the connected own platforms list screen
 */
export const OwnPlatformsListScreenContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <OwnPlatformsListScreenComponent {...input} {...output} />;
};
