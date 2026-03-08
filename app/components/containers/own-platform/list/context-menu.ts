import { OwnPlatformContextMenuComponent, OwnPlatformContextMenuComponentInput, OwnPlatformContextMenuComponentOutput } from 'app/components/presentational/own-platform/list/context-menu';
import { deleteOwnPlatform, loadOwnPlatformDetails, removeOwnPlatformHighlight } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): OwnPlatformContextMenuComponentInput => {
	
	return {
		ownPlatform: state.ownPlatformsList.highlightedOwnPlatform
	};
};

const mapDispatchToProps = (dispatch: Dispatch): OwnPlatformContextMenuComponentOutput => {

	return {
		delete: (ownPlatform) => {
			dispatch(deleteOwnPlatform(ownPlatform));
		},
		edit: (ownPlatform) => {
			dispatch(loadOwnPlatformDetails(ownPlatform));
		},
		close: () => {
			dispatch(removeOwnPlatformHighlight());
		}
	};
};

/**
 * Container component that handles Redux state for OwnPlatformContextMenuComponent
 */
export const OwnPlatformContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OwnPlatformContextMenuComponent);
