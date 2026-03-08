import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	input: {
		flex: 1,
		padding: 10,
		fontSize: 15
	},
	iosInputContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	iosInputText: {
		fontSize: 15,
		flex: 1,
		alignSelf: 'center',
		margin: 10,
		color: config.ui.colors.colorFormInputs
	},
	iosInputTriangle: {
		width: 10,
		height: 10,
		margin: 20,
		alignSelf: 'flex-end',
		borderTopWidth: 6,
		borderRightWidth: 5,
		borderBottomWidth: 0,
		borderLeftWidth: 5,
		borderTopColor: config.ui.colors.black,
		borderRightColor: 'transparent',
		borderBottomColor: 'transparent',
		borderLeftColor: 'transparent'
	},
	iosInputTriangleDisabled: {
		borderTopColor: config.ui.colors.grey
	},
	iosModalContent: {
		width: 260,
		height: 300,
		backgroundColor: config.ui.colors.colorModalBackground
	},
	iosModalTitle: {
		fontSize: 20,
		paddingTop: 25,
		textAlign: 'center',
		fontWeight: 'bold'
	}
});
