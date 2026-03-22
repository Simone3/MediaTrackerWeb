import { ConnectedAuthenticationNavigator } from 'app/components/containers/navigation/authentication-navigator';
import { navigationService } from 'app/utilities/navigation-service';
import { Component, ReactNode, useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

const NavigationServiceBridge = (): null => {
	const navigate = useNavigate();

	useEffect(() => {
		navigationService.initialize({
			navigate: (path: string) => {
				navigate(path);
			},
			back: () => {
				navigate(-1);
			}
		});
	}, [ navigate ]);

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
				<ConnectedAuthenticationNavigator />
			</BrowserRouter>
		);
	}
}
