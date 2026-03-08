import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { ConnectedAuthenticationNavigator } from 'app/components/containers/navigation/authentication-navigator';
import { navigationService } from 'app/utilities/navigation-service';
import React, { Component, ReactNode } from 'react';

/**
 * The root container that wraps the navigation logic
 */
export class AppNavigationContainer extends Component {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<NavigationContainer
				ref={(navigatorRef: NavigationContainerRef<ParamListBase>) => {
					if(!navigatorRef) {
						return;
					}
					navigationService.initialize(navigatorRef);
				}}>
				<ConnectedAuthenticationNavigator />
			</NavigationContainer>
		);
	}
}
