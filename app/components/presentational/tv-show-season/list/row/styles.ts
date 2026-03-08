import { config } from 'app/config/config';
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
	labelsContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start',
		marginLeft: 15,
		marginTop: 10,
		marginBottom: 10
	},
	mainLabel: {
		flex: 1,
		fontSize: 20
	},
	secondaryLabel: {
		flex: 1,
		fontSize: 16
	},
	normalLabel: {
		color: config.ui.colors.black
	},
	completedLabel: {
		color: config.ui.colors.grey
	},
	invalidLabel: {
		color: config.ui.colors.red
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
