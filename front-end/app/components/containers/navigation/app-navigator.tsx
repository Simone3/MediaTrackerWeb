import { Component, ReactElement, ReactNode, useEffect } from 'react';
import { BrowserRouter, NavigationType, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { ConnectedAuthenticationNavigator } from 'app/components/containers/navigation/authentication-navigator';
import { ErrorBoundaryComponent } from 'app/components/presentational/generic/error-boundary';
import { navigationService } from 'app/utilities/navigation-service';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppSections } from 'app/utilities/screens';

const homePath = screenToPath(AppSections.Media);

const NavigationServiceBridge = (): null => {
	const navigate = useNavigate();

	useEffect(() => {
		navigationService.initialize({
			navigate: (path: string) => {
				void navigate(path);
			},
			back: () => {
				void navigate(-1);
			}
		});
	}, [ navigate ]);

	return null;
};

/**
 * Scrolls the window back to the top whenever a new screen is opened. Backwards navigation is deliberately excluded, so that
 * the browser's own scroll restoration can put the previous screen back where the user left it.
 * @returns nothing, the component renders no markup
 */
const ScrollToTopOnNewScreen = (): null => {
	const { key } = useLocation();
	const navigationType = useNavigationType();

	useEffect(() => {
		if(navigationType !== NavigationType.Pop) {
			window.scrollTo(0, 0);
		}
	}, [ key, navigationType ]);

	return null;
};

/**
 * Wraps the app screens with the error boundary, giving it the router handles it needs: the location key tells it when a new
 * screen has been opened, so that the error of the previous one is cleared, and the recovery callback leaves the failed screen.
 * @param props the input props
 * @returns the component
 */
const ScreenErrorBoundary = (props: ScreenErrorBoundaryProps): ReactElement => {
	const { key } = useLocation();
	const navigate = useNavigate();

	return (
		<ErrorBoundaryComponent
			resetKey={key}
			recover={() => {
				void navigate(homePath);
			}}>
			{props.children}
		</ErrorBoundaryComponent>
	);
};

/**
 * ScreenErrorBoundary's props
 */
type ScreenErrorBoundaryProps = {
	children: ReactNode;
};

/**
 * The root container that wraps the navigation logic
 */
export class AppNavigationContainer extends Component {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<BrowserRouter>
				<NavigationServiceBridge />
				<ScrollToTopOnNewScreen />
				<ScreenErrorBoundary>
					<ConnectedAuthenticationNavigator />
				</ScreenErrorBoundary>
			</BrowserRouter>
		);
	}
}
