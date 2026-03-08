import { Navigation } from 'app/components/containers/navigation/global';
import { HeaderFormExitBackComponent, HeaderFormExitBackComponentInput } from 'app/components/presentational/generic/header-form-exit-back';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: TvShowSeasonDetailsHeaderBackButtonContainerProps): HeaderFormExitBackComponentInput => {
	
	return {
		disabled: false,
		dirtyForm: state.tvShowSeasonDetails.dirty,
		navigation: ownProps.navigation
	};
};

/**
 * Container component that handles Redux state for HeaderFormExitBackComponent
 */
export const TvShowSeasonDetailsHeaderBackButtonContainer = connect(
	mapStateToProps
)(HeaderFormExitBackComponent);

/**
 * TvShowSeasonDetailsHeaderBackButtonContainer's props
 */
export type TvShowSeasonDetailsHeaderBackButtonContainerProps = {
	
	/**
	 * The navigation data
	 */
	navigation: Navigation;
}

