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
		this.props.fetchLoginStatus();
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
 * AuthLoadingScreenComponent's input props: the screen reads nothing from the state.
 * Empty rather than `Record<string, never>`, whose index signature would type every
 * output prop as `never` once the two are intersected below.
 */
export type AuthLoadingScreenComponentInput = {

};

/**
 * AuthLoadingScreenComponent's output props
 */
export type AuthLoadingScreenComponentOutput = {
	/**
	 * Callback to request the user login status
	 */
	fetchLoginStatus: () => void;
};

/**
 * AuthLoadingScreenComponent's props
 */
export type AuthLoadingScreenComponentProps = AuthLoadingScreenComponentInput & AuthLoadingScreenComponentOutput;
