import { Component, ReactNode } from 'react';
import { AppError } from 'app/data/models/internal/error';
import { i18n } from 'app/utilities/i18n';

/**
 * Simple wrapper presentational component that handles global errors
 */
export class ErrorHandlerComponent extends Component<ErrorHandlerComponentProps, ErrorHandlerComponentState> {
	public state: ErrorHandlerComponentState = {
		visibleError: undefined
	};

	private clearTimeoutId?: ReturnType<typeof setTimeout>;

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<ErrorHandlerComponentProps>): void {
		const {
			error
		} = this.props;

		if(!error || error === prevProps.error) {
			return;
		}

		const messageDescription = typeof error === 'string' ? error : this.getAppErrorDescription(error);
		this.setState({
			visibleError: messageDescription
		});
		this.props.clearError();

		if(this.clearTimeoutId) {
			clearTimeout(this.clearTimeoutId);
		}

		this.clearTimeoutId = setTimeout(() => {
			this.setState({
				visibleError: undefined
			});
		}, 3000);
	}

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		if(this.clearTimeoutId) {
			clearTimeout(this.clearTimeoutId);
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			visibleError
		} = this.state;

		return (
			<div className='error-handler-container'>
				{this.props.children}
				{visibleError ?
					(
						<div className='error-handler-toast' role='alert'>
							<strong className='error-handler-toast-title'>{i18n.t('error.flash.title')}</strong>
							<span className='error-handler-toast-description'>{visibleError}</span>
						</div>
					) :
					null}
			</div>
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

/**
 * ErrorHandlerComponent's state
 */
type ErrorHandlerComponentState = {
	visibleError?: string;
};
