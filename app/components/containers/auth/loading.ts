import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AuthLoadingScreenComponent, AuthLoadingScreenComponentOutput } from 'app/components/presentational/auth/loading/screen';
import { checkUserLoginStatus } from 'app/redux/actions/user/generators';

const mapDispatchToProps = (dispatch: Dispatch): AuthLoadingScreenComponentOutput => {
	return {
		fetchLoginStatus: () => {
			dispatch(checkUserLoginStatus());
		}
	};
};

/**
 * Container component that handles Redux state for AuthLoadingScreenComponent
 */
export const AuthLoadingScreenContainer = connect(
	null,
	mapDispatchToProps
)(AuthLoadingScreenComponent);
