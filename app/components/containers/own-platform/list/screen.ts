import { OwnPlatformsListScreenComponent, OwnPlatformsListScreenComponentInput, OwnPlatformsListScreenComponentOutput } from 'app/components/presentational/own-platform/list/screen';
import { fetchOwnPlatforms, loadNewOwnPlatformDetails } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): OwnPlatformsListScreenComponentInput => {
	
	const listState = state.ownPlatformsList;

	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): OwnPlatformsListScreenComponentOutput => {

	return {
		fetchOwnPlatforms: () => {
			dispatch(fetchOwnPlatforms());
		},
		loadNewOwnPlatformDetails: () => {
			dispatch(loadNewOwnPlatformDetails());
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
