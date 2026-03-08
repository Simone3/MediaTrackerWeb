import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		borderRadius: 2,
		
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		marginTop: 5,
		marginBottom: 5
	},
	iconContainer: {
		flex: 0,
		alignSelf: 'center',
		alignItems: 'center',
		paddingLeft: 18
	},
	icon: {
		width: 30,
		height: 30,
		marginRight: 18
	},
	nameContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	name: {
		color: config.ui.colors.colorContrastText,
		flex: 0,
		fontSize: 20
	},
	contextButtonContainer: {
		flex: 0,

		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 18,
		paddingRight: 18
	},
	contextButton: {
		width: 15,
		height: 15
	}
});
