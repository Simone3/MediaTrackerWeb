import { config } from 'app/config/config';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	inputContainer: {
		flex: 1,
		padding: 5
	},
	input: {
		padding: Platform.OS === 'ios' ? 15 : 10,
		paddingLeft: 10,
		fontSize: 15,
		color: config.ui.colors.colorFormInputs
	}
});
