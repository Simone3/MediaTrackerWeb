import { createStackNavigator } from '@react-navigation/stack';
import { CreditsScreenComponent } from 'app/components/presentational/credits/screen';
import { HeaderComponent } from 'app/components/presentational/generic/header';
import { HeaderHamburgerComponent } from 'app/components/presentational/generic/header-hamburger';
import { i18n } from 'app/utilities/i18n';
import { AppScreens } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { defaultScreenOptions } from 'app/components/containers/navigation/global';

const CreditsStack = createStackNavigator();

/**
 * The navigator for the credits section of the app
 */
export class CreditsNavigator extends Component {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<CreditsStack.Navigator
				initialRouteName={AppScreens.Credits}
				screenOptions={defaultScreenOptions}>
				<CreditsStack.Screen
					name={AppScreens.Credits}
					component={CreditsScreenComponent}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<HeaderComponent
										title={i18n.t('credits.screen.title')}
										componentsLeft={<HeaderHamburgerComponent navigationScreenProps={navigationScreenProps} />}
									/>
								);
							}
						};
					}}
				/>
			</CreditsStack.Navigator>
		);
	}
}
