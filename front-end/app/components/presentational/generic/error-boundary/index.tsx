import { Component, ErrorInfo, ReactNode } from 'react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that catches the rendering errors of its subtree, e.g. the containers that throw when the global
 * context they require is missing, and shows a recoverable error screen instead of letting React unmount the whole app
 */
export class ErrorBoundaryComponent extends Component<ErrorBoundaryComponentProps, ErrorBoundaryComponentState> {
	public state: ErrorBoundaryComponentState = {
		hasError: false
	};

	/**
	 * @override
	 */
	public static getDerivedStateFromError(): ErrorBoundaryComponentState {
		return {
			hasError: true
		};
	}

	/**
	 * @override
	 */
	public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.log(`Unhandled rendering error: ${error} ${errorInfo.componentStack}`);
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<ErrorBoundaryComponentProps>): void {
		const {
			resetKey
		} = this.props;

		// Every new screen gets a new chance to render: the previous error belonged to the screen the user has just left
		if(this.state.hasError && prevProps.resetKey !== resetKey) {
			this.setState({
				hasError: false
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			children,
			recover
		} = this.props;

		if(!this.state.hasError) {
			return children;
		}

		return (
			<div className='error-boundary-screen'>
				<div className='error-boundary-panel' role='alert'>
					<h1 className='error-boundary-title'>{i18n.t('error.boundary.title')}</h1>
					<p className='error-boundary-message'>{i18n.t('error.boundary.message')}</p>
					<PillButtonComponent
						className='error-boundary-button'
						onClick={recover}>
						{i18n.t('error.boundary.recoverButton')}
					</PillButtonComponent>
				</div>
			</div>
		);
	}
}

/**
 * ErrorBoundaryComponent's input props
 */
export type ErrorBoundaryComponentInput = {

	/**
	 * The value that identifies the current screen: the boundary clears the error whenever it changes
	 */
	resetKey: string;

	/**
	 * Single component as child
	 */
	children: ReactNode;
};

/**
 * ErrorBoundaryComponent's output props
 */
export type ErrorBoundaryComponentOutput = {

	/**
	 * Callback to leave the screen that failed to render
	 */
	recover: () => void;
};

/**
 * ErrorBoundaryComponent's props
 */
export type ErrorBoundaryComponentProps = ErrorBoundaryComponentInput & ErrorBoundaryComponentOutput;

/**
 * ErrorBoundaryComponent's state
 */
export type ErrorBoundaryComponentState = {

	/**
	 * True if the subtree threw while rendering
	 */
	hasError: boolean;
};
