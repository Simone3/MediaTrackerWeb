import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 2,
		
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		paddingLeft: 10,
		
		marginTop: 5,
		marginBottom: 5
	},
	nameContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginLeft: 15
	},
	name: {
		flex: 0,
		fontSize: 20
	},
	contextButtonContainer: {
		flex: 0,
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		paddingRight: 10
	},
	contextButton: {
		width: 15,
		height: 15
	}
});
