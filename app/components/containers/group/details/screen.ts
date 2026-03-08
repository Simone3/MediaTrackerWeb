import { GroupDetailsScreenComponent, GroupDetailsScreenComponentInput } from 'app/components/presentational/group/details/screen';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State): GroupDetailsScreenComponentInput => {
	
	return {
		isLoading: state.groupDetails.saveStatus === 'SAVING'
	};
};

/**
 * Container component that handles Redux state for GroupDetailsScreenComponent
 */
export const GroupDetailsScreenContainer = connect(
	mapStateToProps,
	null
)(GroupDetailsScreenComponent);
