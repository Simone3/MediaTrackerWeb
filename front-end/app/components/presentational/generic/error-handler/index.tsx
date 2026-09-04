import { Component, ReactNode } from 'react';
import { AppError } from 'app/data/models/internal/error';
import { ErrorHint } from 'app/utilities/error-hint';
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

		const messageDescription = typeof error === 'string' ? error : this.getAppErrorMessage(error);
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
	 * Helper to build the message to be shown for an AppError object: the description of the operation that failed,
	 * followed by the hint of the innermost error that carries one, if any
	 * @param error the source error
	 * @returns the message to be shown
	 */
	private getAppErrorMessage(error: AppError): string {
		const description = i18n.t(error.errorDescription);
		const hint = this.getAppErrorHint(error);

		if(!hint) {
			return description;
		}

		const hintDescription = hint.params ? i18n.t(hint.key, hint.params) : i18n.t(hint.key);

		return i18n.t('error.flash.messageWithHint', {
			message: description,
			hint: hintDescription
		});
	}

	/**
	 * Helper to extract the most specific hint from the chain of nested AppError objects
	 * @param error the source error
	 * @returns the deepest available hint, if any
	 */
	private getAppErrorHint(error: AppError): ErrorHint | undefined {
		let currentAppError: AppError = error;
		let deepestHint = currentAppError.userHint;

		while(currentAppError.errorDetails && currentAppError.errorDetails instanceof AppError) {
			currentAppError = currentAppError.errorDetails;

			if(currentAppError.userHint) {
				deepestHint = currentAppError.userHint;
			}
		}

		return deepestHint;
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
