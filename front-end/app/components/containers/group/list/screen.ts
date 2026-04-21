import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GroupsListScreenComponent, GroupsListScreenComponentInput, GroupsListScreenComponentOutput } from 'app/components/presentational/group/list/screen';
import { deleteGroup, fetchGroups, loadGroupDetails, loadNewGroupDetails, selectGroup } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const mapStateToProps = (state: State): GroupsListScreenComponentInput => {
	const listState = state.groupsList;

	return {
		isLoading: listState.status === 'FETCHING' || listState.status === 'DELETING',
		requiresFetch: listState.status === 'REQUIRES_FETCH',
		groups: listState.groups,
		selectedGroupId: state.groupGlobal.selectedGroup?.id,
		showEmptyState: listState.status === 'FETCHED' && listState.groups.length === 0,
		showSkeletons: listState.groups.length === 0 && (listState.status === 'REQUIRES_FETCH' || listState.status === 'FETCHING')
	};
};

const mapDispatchToProps = (dispatch: Dispatch): GroupsListScreenComponentOutput => {
	return {
		fetchGroups: () => {
			dispatch(fetchGroups());
		},
		loadNewGroupDetails: () => {
			dispatch(loadNewGroupDetails());
		},
		selectGroup: (group) => {
			dispatch(selectGroup(group));
		},
		editGroup: (group) => {
			dispatch(loadGroupDetails(group));
		},
		deleteGroup: (group) => {
			dispatch(deleteGroup(group));
		},
		goBack: () => {
			navigationService.back();
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
