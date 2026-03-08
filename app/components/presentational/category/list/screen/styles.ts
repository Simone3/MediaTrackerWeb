import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: config.ui.colors.white,
		padding: 15,
		flex: 1,
		alignItems: 'flex-start',
		justifyContent: 'flex-start'
	},
	text: {
		fontSize: 15
	}
});
