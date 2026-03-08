import { createDrawerNavigator } from '@react-navigation/drawer';
import { CreditsNavigator } from 'app/components/containers/navigation/credits-navigator';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { SettingsNavigator } from 'app/components/containers/navigation/settings-navigator';
import { drawerIconBuilder } from 'app/components/presentational/generic/drawer-icon';
import { drawerLabelBuilder } from 'app/components/presentational/generic/drawer-label';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { AppSections } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';

const AuthenticatedDrawer = createDrawerNavigator();

/**
 * The navigator to switch between the main authenticated app sections via drawer
 */
export class AuthenticatedNavigator extends Component {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<AuthenticatedDrawer.Navigator
				initialRouteName={AppSections.Media}
				screenOptions={{
					headerShown: false,
					unmountOnBlur: true
				}}>
				<AuthenticatedDrawer.Screen
					name={AppSections.Media}
					component={MediaNavigator}
					options={{
						drawerLabel: drawerLabelBuilder(i18n.t('common.drawer.home')),
						drawerIcon: drawerIconBuilder(images.home())
					}}
				/>
				<AuthenticatedDrawer.Screen
					name={AppSections.Settings}
					component={SettingsNavigator}
					options={{
						drawerLabel: drawerLabelBuilder(i18n.t('common.drawer.settings')),
						drawerIcon: drawerIconBuilder(images.settings())
					}}
				/>
				<AuthenticatedDrawer.Screen
					name={AppSections.Credits}
					component={CreditsNavigator}
					options={{
						drawerLabel: drawerLabelBuilder(i18n.t('common.drawer.credits')),
						drawerIcon: drawerIconBuilder(images.credits())
					}}
				/>
			</AuthenticatedDrawer.Navigator>
		);
	}
}
