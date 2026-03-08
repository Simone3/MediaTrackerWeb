import { createStackNavigator } from '@react-navigation/stack';
import { UserSettingsScreenContainer } from 'app/components/containers/settings/screen';
import { HeaderComponent } from 'app/components/presentational/generic/header';
import { HeaderHamburgerComponent } from 'app/components/presentational/generic/header-hamburger';
import { i18n } from 'app/utilities/i18n';
import { AppScreens } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { defaultScreenOptions } from 'app/components/containers/navigation/global';

const SettingsStack = createStackNavigator();

/**
 * The navigator for the settings section of the app
 */
export class SettingsNavigator extends Component {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<SettingsStack.Navigator
				initialRouteName={AppScreens.Settings}
				screenOptions={defaultScreenOptions}>
				<SettingsStack.Screen
					name={AppScreens.Settings}
					component={UserSettingsScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<HeaderComponent
										title={i18n.t('settings.screen.title')}
										componentsLeft={<HeaderHamburgerComponent navigationScreenProps={navigationScreenProps} />}
									/>
								);
							}
						};
					}}
				/>
			</SettingsStack.Navigator>
		);
	}
}
