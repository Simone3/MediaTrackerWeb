import { HeaderIconComponent, HeaderIconComponentInput, HeaderIconComponentOutput } from 'app/components/presentational/generic/header-icon';
import { requestMediaItemSave } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { images } from 'app/utilities/images';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): HeaderIconComponentInput => {
	
	return {
		source: images.saveButton(),
		clickStatus: state.mediaItemDetails.valid && state.mediaItemDetails.saveStatus !== 'SAVING' ? 'ENABLED' : 'DISABLED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): HeaderIconComponentOutput => {
	
	return {
		onClick: () => {
			dispatch(requestMediaItemSave());
		}
	};
};

/**
 * Container component that handles Redux state for HeaderIconComponent
 */
export const MediaItemDetailsHeaderSaveIconContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderIconComponent);
