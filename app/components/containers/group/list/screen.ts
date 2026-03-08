import { GroupsListScreenComponent, GroupsListScreenComponentInput, GroupsListScreenComponentOutput } from 'app/components/presentational/group/list/screen';
import { fetchGroups, loadNewGroupDetails } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): GroupsListScreenComponentInput => {
	
	const listState = state.groupsList;

	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): GroupsListScreenComponentOutput => {

	return {
		fetchGroups: () => {
			dispatch(fetchGroups());
		},
		loadNewGroupDetails: () => {
			dispatch(loadNewGroupDetails());
		}
	};
};

/**
 * Container component that handles Redux state for GroupsListScreenComponent
 */
export const GroupsListScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupsListScreenComponent);
