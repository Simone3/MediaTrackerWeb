import { OwnPlatformsListScreenComponent, OwnPlatformsListScreenComponentInput, OwnPlatformsListScreenComponentOutput } from 'app/components/presentational/own-platform/list/screen';
import { deleteOwnPlatform, fetchOwnPlatforms, invalidateOwnPlatforms, loadNewOwnPlatformDetails, loadOwnPlatformDetails, selectOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): OwnPlatformsListScreenComponentInput => {
	const listState = state.ownPlatformsList;
	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH',
		ownPlatforms: listState.ownPlatforms,
		selectedOwnPlatformId: state.ownPlatformGlobal.selectedOwnPlatform?.id
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
		refreshOwnPlatforms: () => {
			dispatch(invalidateOwnPlatforms());
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
