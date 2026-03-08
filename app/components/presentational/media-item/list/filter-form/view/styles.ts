import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	submitContainer: {
		marginTop: 20,
		marginBottom: 10
	},
	submitText: {
		textTransform: 'uppercase',
		color: config.ui.colors.colorModalButton,
		textAlign: 'right',
		marginRight: 5
	},
	submitTextDisabled: {
		color: config.ui.colors.colorModalButtonDisabled
	}
});
