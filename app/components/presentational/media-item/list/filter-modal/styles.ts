import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: config.ui.colors.colorModalBackground,
		padding: 15
	},
	titleContainer: {

	},
	title: {
		color: config.ui.colors.colorModalContent,
		fontSize: 22,
		marginBottom: 10,
		fontWeight: 'bold',
		textAlign: 'center'
	}
});
