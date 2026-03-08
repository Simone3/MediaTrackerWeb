import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	buttonContainer: {
		height: 60,
		padding: 20
	},
	button: {
		textTransform: 'uppercase',
		color: config.ui.colors.colorModalButton,
		textAlign: 'right',
		marginRight: 5
	},
	buttonDisabled: {
		color: config.ui.colors.colorModalButtonDisabled
	}
});
