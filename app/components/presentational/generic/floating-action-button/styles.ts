import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	fab: {
		height: 50,
		width: 50,
		borderRadius: 200,
		position: 'absolute',
		bottom: 20,
		right: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: config.ui.colors.colorAccent
	},
	text: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 30,
		color: config.ui.colors.colorContrastText,
		marginBottom: 4
	}
});
