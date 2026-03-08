import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	loadingIcon: {
		padding: 10,
		width: 30,
		height: 30
	},
	clearIcon: {
		marginRight: 10,
		width: 15,
		height: 15
	},
	input: {
		flex: 1,
		fontSize: 15
	}
});
