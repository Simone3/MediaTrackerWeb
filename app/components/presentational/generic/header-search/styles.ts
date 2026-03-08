import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	searchModeContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignContent: 'center',

		marginLeft: -15,
		marginRight: -15
	},
	backContainer: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignContent: 'center',
		marginLeft: 5
	},
	searchContainer: {
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 10
	},
	searchBarInput: {
		color: config.ui.colors.colorContrastText
	}
});
