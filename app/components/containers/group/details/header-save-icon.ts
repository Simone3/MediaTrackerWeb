import { HeaderIconComponent, HeaderIconComponentInput, HeaderIconComponentOutput } from 'app/components/presentational/generic/header-icon';
import { requestGroupSave } from 'app/redux/actions/group/generators';
import { State } from 'app/redux/state/state';
import { images } from 'app/utilities/images';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): HeaderIconComponentInput => {
	
	return {
		source: images.saveButton(),
		clickStatus: state.groupDetails.valid && state.groupDetails.saveStatus !== 'SAVING' ? 'ENABLED' : 'DISABLED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): HeaderIconComponentOutput => {
	
	return {
		onClick: () => {
			dispatch(requestGroupSave());
		}
	};
};

/**
 * Container component that handles Redux state for HeaderIconComponent
 */
export const GroupDetailsHeaderSaveIconContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderIconComponent);
