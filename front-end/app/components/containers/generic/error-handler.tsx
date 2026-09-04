import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { ErrorHandlerComponent, ErrorHandlerComponentOutput, ErrorHandlerComponentProps } from 'app/components/presentational/generic/error-handler';
import { clearError } from 'app/redux/actions/error/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

type ErrorHandlerContainerInput = Pick<ErrorHandlerComponentProps, 'error'>;

const selectInput = (state: State): ErrorHandlerContainerInput => {
	return {
		error: state.error.error
	};
};

const buildOutput = (dispatch: Dispatch): ErrorHandlerComponentOutput => {
	return {
		clearError: () => {
			dispatch(clearError());
		}
	};
};

/**
 * Container component that handles Redux state for ErrorHandlerComponent
 * @param props the container props
 * @returns the connected error handler wrapped around its children
 */
export const ErrorHandlerContainer = (props: ErrorHandlerContainerProps): ReactElement => {
	const {
		children
	} = props;
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <ErrorHandlerComponent {...input} {...output}>{children}</ErrorHandlerComponent>;
};

/**
 * ErrorHandlerComponent's props
 */
export type ErrorHandlerContainerProps = Omit<ErrorHandlerComponentProps, 'error' | 'clearError'>;
