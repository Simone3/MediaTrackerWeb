
import { GroupFormComponent, GroupFormComponentInput, GroupFormComponentOutput } from 'app/components/presentational/group/details/form/wrapper';
import { AppError } from 'app/data/models/internal/error';
import { saveGroup, setGroupFormStatus } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): GroupFormComponentInput => {
	
	if(!state.groupDetails.group) {

		throw AppError.GENERIC.withDetails('App navigated to the details screen with undefined details');
	}
	
	return {
		initialValues: state.groupDetails.group,
		saveRequested: state.groupDetails.saveStatus === 'REQUESTED',
		sameNameConfirmationRequested: state.groupDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): GroupFormComponentOutput => {

	return {
		saveGroup: (group, confirmSameName) => {
			dispatch(saveGroup(group, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setGroupFormStatus(valid, dirty));
		}
	};
};

/**
 * Container component that handles Redux state for GroupFormComponent
 */
export const GroupFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupFormComponent);
