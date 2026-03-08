import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingTop: 5,
		paddingLeft: 10,
		paddingRight: 10,
		width: '100%'
	},
	title: {
		fontSize: 15,
		color: config.ui.colors.colorPrimary,
		fontWeight: 'bold'
	}
});
