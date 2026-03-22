import { Component, ReactNode } from 'react';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';

/**
 * Presentational component that contains the app landing page that checks for user authentication and then redirects to the correct flow
 */
export class AuthLoadingScreenComponent extends Component<AuthLoadingScreenComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		document.body.classList.add('app-dark-screen-active');
		this.props.fetchLoginStatus();
	}

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<LoadingIndicatorComponent
				visible={true}
				fullScreen={true}
			/>
		);
	}
}

/**
 * AuthLoadingScreenComponent's input props
 */
export type AuthLoadingScreenComponentInput = Record<string, never>;

/**
 * AuthLoadingScreenComponent's output props
 */
export type AuthLoadingScreenComponentOutput = {
	/**
	 * Callback to request the user login status
	 */
	fetchLoginStatus: () => void;
}

/**
 * AuthLoadingScreenComponent's props
 */
export type AuthLoadingScreenComponentProps = AuthLoadingScreenComponentInput & AuthLoadingScreenComponentOutput;
