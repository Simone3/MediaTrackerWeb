import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { GroupDetailsScreenComponent, GroupDetailsScreenComponentInput, GroupDetailsScreenComponentOutput } from 'app/components/presentational/group/details/screen';
import { DEFAULT_GROUP } from 'app/data/models/internal/group';
import { saveGroup, setGroupFormStatus } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { navigationService } from 'app/utilities/navigation-service';

const mapStateToProps = (state: State): GroupDetailsScreenComponentInput => {
	return {
		isLoading: state.groupDetails.saveStatus === 'SAVING',
		group: state.groupDetails.group || DEFAULT_GROUP,
		sameNameConfirmationRequested: state.groupDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): GroupDetailsScreenComponentOutput => {
	return {
		saveGroup: (group, confirmSameName) => {
			dispatch(saveGroup(group, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setGroupFormStatus(valid, dirty));
		},
		goBack: () => {
			navigationService.back();
		}
	};
};

/**
 * Container component that handles Redux state for GroupDetailsScreenComponent
 */
export const GroupDetailsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupDetailsScreenComponent);
