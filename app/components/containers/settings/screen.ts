import { SettingsScreenComponent, SettingsScreenComponentInput, SettingsScreenComponentOutput } from 'app/components/presentational/settings/screen';
import { logUserOut } from 'app/redux/actions/user/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): SettingsScreenComponentInput => {
	return {
		isLoading: state.userOperations.logoutStatus === 'IN_PROGRESS',
		user: state.userGlobal.user
	};
};

const mapDispatchToProps = (dispatch: Dispatch): SettingsScreenComponentOutput => {
	return {
		logout: () => {
			dispatch(logUserOut());
		}
	};
};

/**
 * Container component that handles Redux state for SettingsScreenComponent
 */
export const UserSettingsScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SettingsScreenComponent);
