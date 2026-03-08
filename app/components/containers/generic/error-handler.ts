import { ErrorHandlerComponent, ErrorHandlerComponentInput, ErrorHandlerComponentOutput, ErrorHandlerComponentProps } from 'app/components/presentational/generic/error-handler';
import { clearError } from 'app/redux/actions/error/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State, ownProps: ErrorHandlerContainerProps): ErrorHandlerComponentInput => {
	
	return {
		error: state.error.error,
		children: ownProps.children
	};
};

const mapDispatchToProps = (dispatch: Dispatch): ErrorHandlerComponentOutput => {

	return {
		clearError: () => {
			dispatch(clearError());
		}
	};
};

/**
 * Container component that handles Redux state for ErrorHandlerComponent
 */
export const ErrorHandlerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ErrorHandlerComponent);

/**
 * ErrorHandlerComponent's props
 */
export type ErrorHandlerContainerProps = Omit<ErrorHandlerComponentProps, 'error' | 'clearError'>;

