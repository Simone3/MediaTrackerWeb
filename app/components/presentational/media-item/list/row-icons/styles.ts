import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	iconsContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	statusCircle: {
		flex: 0,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 50,
		width: 25,
		height: 25,
		margin: 5,
		marginBottom: 10,
		borderWidth: 1
	},
	statusIcon: {
		width: 15,
		height: 15
	},
	optionsContainer: {
		flex: 0,
		padding: 10
	},
	optionsIcon: {
		width: 15,
		height: 15
	}
});
