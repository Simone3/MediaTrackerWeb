import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	logoContainer: {
		flex: 0,
		alignSelf: 'center',
		alignItems: 'flex-end',
		marginRight: 7
	},
	logo: {
		flex: 0,
		width: 50,
		height: 50
	},
	titleContainer: {
		flex: 0,
		marginLeft: 7
	},
	title: {
		fontSize: 35,
		textAlign: 'left',
		fontWeight: 'bold',
		color: config.ui.colors.colorPrimary
	}
});
