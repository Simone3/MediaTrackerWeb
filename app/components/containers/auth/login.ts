import { UserLoginScreenComponent, UserLoginScreenComponentInput, UserLoginScreenComponentOutput } from 'app/components/presentational/auth/login/screen';
import { logUserIn } from 'app/redux/actions/user/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): UserLoginScreenComponentInput => {
	
	return {
		isLoading: state.userOperations.loginStatus === 'IN_PROGRESS'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): UserLoginScreenComponentOutput => {

	return {
		login: (user) => {
			dispatch(logUserIn(user));
		}
	};
};

/**
 * Container component that handles Redux state for UserLoginScreenComponent
 */
export const UserLoginScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UserLoginScreenComponent);
