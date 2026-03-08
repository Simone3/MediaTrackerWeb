import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 0,
		borderBottomWidth: 1,
		borderColor: config.ui.colors.colorFormInputs,
		marginBottom: 10
	},
	containerError: {
		borderColor: 'red'
	},
	containerFocus: {
		borderColor: config.ui.colors.colorAccent
	},
	content: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	icon: {
		padding: 10,
		width: 25,
		height: 25
	}
});
