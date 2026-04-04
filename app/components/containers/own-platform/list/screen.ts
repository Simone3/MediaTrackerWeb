import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { OwnPlatformsListScreenComponent, OwnPlatformsListScreenComponentInput, OwnPlatformsListScreenComponentOutput } from 'app/components/presentational/own-platform/list/screen';
import { deleteOwnPlatform, fetchOwnPlatforms, loadNewOwnPlatformDetails, loadOwnPlatformDetails, selectOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const mapStateToProps = (state: State): OwnPlatformsListScreenComponentInput => {
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

const mapDispatchToProps = (dispatch: Dispatch): OwnPlatformsListScreenComponentOutput => {
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
 */
export const OwnPlatformsListScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnPlatformsListScreenComponent);
