import { SettingsScreenComponent, SettingsScreenComponentInput, SettingsScreenComponentOutput } from 'app/components/presentational/settings/screen';
import { importOldAppExport } from 'app/redux/actions/import-export/generators';
import { logUserOut } from 'app/redux/actions/user/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): SettingsScreenComponentInput => {
	
	return {
		isLoading: state.userOperations.logoutStatus === 'IN_PROGRESS' || state.importExport.status === 'IN_PROGRESS',
		user: state.userGlobal.user
	};
};

const mapDispatchToProps = (dispatch: Dispatch): SettingsScreenComponentOutput => {

	return {
		logout: () => {
			dispatch(logUserOut());
		},
		importOldAppExport: (oldAppExport) => {
			dispatch(importOldAppExport(oldAppExport));
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
