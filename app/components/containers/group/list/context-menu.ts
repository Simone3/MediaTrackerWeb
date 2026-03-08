import { GroupContextMenuComponent, GroupContextMenuComponentInput, GroupContextMenuComponentOutput } from 'app/components/presentational/group/list/context-menu';
import { deleteGroup, loadGroupDetails, removeGroupHighlight } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): GroupContextMenuComponentInput => {
	
	return {
		group: state.groupsList.highlightedGroup
	};
};

const mapDispatchToProps = (dispatch: Dispatch): GroupContextMenuComponentOutput => {

	return {
		delete: (group) => {
			dispatch(deleteGroup(group));
		},
		edit: (group) => {
			dispatch(loadGroupDetails(group));
		},
		close: () => {
			dispatch(removeGroupHighlight());
		}
	};
};

/**
 * Container component that handles Redux state for GroupContextMenuComponent
 */
export const GroupContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupContextMenuComponent);
