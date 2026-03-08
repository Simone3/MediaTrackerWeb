import { SelectionListComponent, SelectionListComponentInput, SelectionListComponentOutput, SelectionListComponentProps } from 'app/components/presentational/generic/selection-list';
import { GroupInternal } from 'app/data/models/internal/group';
import { highlightGroup, invalidateGroups, selectGroup } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State, ownProps: GroupsListContainerProps): SelectionListComponentInput<GroupInternal> => {
	
	return {
		...ownProps,
		entities: state.groupsList.groups,
		currentEntity: state.groupGlobal.selectedGroup
	};
};

const mapDispatchToProps = (dispatch: Dispatch): SelectionListComponentOutput<GroupInternal> => {

	return {
		selectRow: (group) => {
			dispatch(selectGroup(group));
		},
		highlightRow: (group) => {
			dispatch(highlightGroup(group));
		},
		refreshEntities: () => {
			dispatch(invalidateGroups());
		}
	};
};

/**
 * Container component that handles Redux state for SelectionListComponent
 */
export const GroupsListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SelectionListComponent);

/**
 * GroupsListContainer's props
 */
export type GroupsListContainerProps = Omit<SelectionListComponentProps<GroupInternal>, 'entities' | 'currentEntity' | 'selectRow' | 'highlightRow' | 'refreshEntities'>

