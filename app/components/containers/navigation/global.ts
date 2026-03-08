import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { config } from 'app/config/config';

/**
 * Helper type for navigation properties
 */
export type Navigation = NavigationHelpers<ParamListBase>;

/**
 * Default screen options
 */
export const defaultScreenOptions: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: config.ui.colors.colorPrimary
	},
	headerTintColor: config.ui.colors.colorContrastText,
	headerTitleStyle: {
		fontWeight: 'bold'
	},
	headerLeft: () => {
		return null;
	}
};
