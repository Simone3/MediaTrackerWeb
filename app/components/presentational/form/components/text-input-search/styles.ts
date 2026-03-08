import { config } from 'app/config/config';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	inputContainer: {
		flex: 1
	},
	input: {
		flex: 1,
		fontSize: 15,
		padding: Platform.OS === 'ios' ? 15 : 10,
		paddingLeft: 10
	},
	suggestionsContainer: {
		maxHeight: '90%',
		padding: 10,
		backgroundColor: config.ui.colors.colorModalBackground,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5
	},
	suggestionText: {
		fontSize: 15,
		padding: 10
	}
});
