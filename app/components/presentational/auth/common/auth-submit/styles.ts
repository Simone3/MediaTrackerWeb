import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	submit: {
		fontSize: 20,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 25,
		paddingRight: 25,
		borderWidth: 1,
		borderRadius: 25,
		textAlign: 'center',
		color: config.ui.colors.white,
		backgroundColor: config.ui.colors.colorAccent,
		borderColor: config.ui.colors.colorAccent,
		marginBottom: 20
	},
	submitDisabled: {
		opacity: 0.5
	}
});
