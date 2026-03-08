import React, { Component, ReactNode } from 'react';
import { AppError } from 'app/data/models/internal/error';
import FlashMessage from 'react-native-flash-message';
import { View } from 'react-native';
import { styles } from 'app/components/presentational/generic/error-handler/styles';
import { i18n } from 'app/utilities/i18n';
import { FlashError } from 'app/components/presentational/generic/error-flash';

/**
 * Simple wrapper presentational component that handles global errors
 */
export class ErrorHandlerComponent extends Component<ErrorHandlerComponentProps> {
	
	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		const {
			error
		} = this.props;

		if(error) {

			console.log('ErrorHandlerComponent: error intercepted');
			console.log(error);

			const messageDescription = typeof error === 'string' ? error : this.getAppErrorDescription(error);

			FlashError.showError(messageDescription);

			this.props.clearError();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View style={styles.container}>
				{this.props.children}
				<FlashMessage position='bottom' />
			</View>
		);
	}

	/**
	 * Helper to extract the correct description from an AppError object
	 * @param error the source error
	 * @returns the description to be shown
	 */
	private getAppErrorDescription(error: AppError): string {
		
		let originalAppError: AppError = error;

		while(originalAppError.errorDetails && originalAppError.errorDetails instanceof AppError) {

			originalAppError = originalAppError.errorDetails;
		}

		return i18n.t(originalAppError.errorDescription);
	}
}

/**
 * ErrorHandlerComponent's input props
 */
export type ErrorHandlerComponentInput = {

	/**
	 * The error to be displayed, if any
	 */
	error?: AppError | string;

	/**
	 * Single component as child
	 */
	children: ReactNode;
};

/**
 * ErrorHandlerComponent's output props
 */
export type ErrorHandlerComponentOutput = {

	/**
	 * Callback to clear the error from the global state
	 */
	clearError: () => void;
};

/**
 * ErrorHandlerComponent's props
 */
export type ErrorHandlerComponentProps = ErrorHandlerComponentInput & ErrorHandlerComponentOutput;
