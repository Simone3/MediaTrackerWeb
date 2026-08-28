import { Component, ReactNode, useEffect } from 'react';
import { BrowserRouter, NavigationType, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { ConnectedAuthenticationNavigator } from 'app/components/containers/navigation/authentication-navigator';
import { navigationService } from 'app/utilities/navigation-service';

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
				<ConnectedAuthenticationNavigator />
			</BrowserRouter>
		);
	}
}
