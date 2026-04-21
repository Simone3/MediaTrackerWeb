import { Component, ReactNode, useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
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
