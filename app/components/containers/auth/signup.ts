import { UserSignupScreenComponent, UserSignupScreenComponentInput, UserSignupScreenComponentOutput } from 'app/components/presentational/auth/signup/screen';
import { signUserUp } from 'app/redux/actions/user/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): UserSignupScreenComponentInput => {
	
	return {
		isLoading: state.userOperations.signupStatus === 'IN_PROGRESS'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): UserSignupScreenComponentOutput => {

	return {
		signup: (user) => {
			dispatch(signUserUp(user));
		}
	};
};

/**
 * Container component that handles Redux state for UserSignupScreenComponent
 */
export const UserSignupScreenContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(UserSignupScreenComponent);
