import { HeaderIconComponent, HeaderIconComponentInput, HeaderIconComponentOutput } from 'app/components/presentational/generic/header-icon';
import { requestCategorySave } from 'app/redux/actions/category/generators';
import { State } from 'app/redux/state/state';
import { images } from 'app/utilities/images';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): HeaderIconComponentInput => {
	
	return {
		source: images.saveButton(),
		clickStatus: state.categoryDetails.valid && state.categoryDetails.saveStatus !== 'SAVING' ? 'ENABLED' : 'DISABLED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): HeaderIconComponentOutput => {
	
	return {
		onClick: () => {
			dispatch(requestCategorySave());
		}
	};
};

/**
 * Container component that handles Redux state for HeaderIconComponent
 */
export const CategoryDetailsHeaderSaveIconContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderIconComponent);
