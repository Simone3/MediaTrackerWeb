import { SelectionListComponent, SelectionListComponentInput, SelectionListComponentOutput, SelectionListComponentProps } from 'app/components/presentational/generic/selection-list';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { highlightOwnPlatform, invalidateOwnPlatforms, selectOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State, ownProps: OwnPlatformsListContainerProps): SelectionListComponentInput<OwnPlatformInternal> => {
	
	return {
		...ownProps,
		entities: state.ownPlatformsList.ownPlatforms,
		currentEntity: state.ownPlatformGlobal.selectedOwnPlatform
	};
};

const mapDispatchToProps = (dispatch: Dispatch): SelectionListComponentOutput<OwnPlatformInternal> => {

	return {
		selectRow: (ownPlatform) => {
			dispatch(selectOwnPlatform(ownPlatform));
		},
		highlightRow: (ownPlatform) => {
			dispatch(highlightOwnPlatform(ownPlatform));
		},
		refreshEntities: () => {
			dispatch(invalidateOwnPlatforms());
		}
	};
};

/**
 * Container component that handles Redux state for SelectionListComponent
 */
export const OwnPlatformsListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SelectionListComponent);

/**
 * OwnPlatformsListContainer's props
 */
export type OwnPlatformsListContainerProps = Omit<SelectionListComponentProps<OwnPlatformInternal>, 'entities' | 'currentEntity' | 'selectRow' | 'highlightRow' | 'refreshEntities'>

