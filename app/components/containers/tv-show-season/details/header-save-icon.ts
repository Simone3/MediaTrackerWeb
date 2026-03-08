import { HeaderIconComponent, HeaderIconComponentInput, HeaderIconComponentOutput } from 'app/components/presentational/generic/header-icon';
import { requestTvShowSeasonSave } from 'app/redux/actions/tv-show-season/generators';
import { State } from 'app/redux/state/state';
import { images } from 'app/utilities/images';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): HeaderIconComponentInput => {
	
	return {
		source: images.saveButton(),
		clickStatus: state.tvShowSeasonDetails.valid ? 'ENABLED' : 'DISABLED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): HeaderIconComponentOutput => {
	
	return {
		onClick: () => {
			dispatch(requestTvShowSeasonSave());
		}
	};
};

/**
 * Container component that handles Redux state for HeaderIconComponent
 */
export const TvShowSeasonDetailsHeaderSaveIconContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(HeaderIconComponent);
