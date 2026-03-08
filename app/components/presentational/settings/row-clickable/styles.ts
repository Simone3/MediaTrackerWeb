import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		width: '100%',
		minHeight: 50
	},
	containerSeparator: {
		borderBottomWidth: 1,
		borderColor: config.ui.colors.separator
	},
	title: {
		fontSize: 18
	},
	subtitle: {
		
	}
});
