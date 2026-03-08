import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: config.ui.colors.colorModalBackground,

		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	},
	titleSectionContainer: {
		marginTop: 10,
		marginBottom: 10,

		height: 50
	},
	list: {
		marginTop: 20,
		marginBottom: 20
	},
	rowContainer: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 20,
		marginRight: 20,

		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	rowIconContainer: {
		flex: 0,
		alignSelf: 'center',
		alignItems: 'center'
	},
	rowIcon: {
		width: 20,
		height: 20,
		marginRight: 18
	},
	rowIconDisabled: {
		opacity: 0.4
	},
	rowLabelContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start'
	},
	rowLabel: {
		color: config.ui.colors.colorModalContent,
		flex: 0,
		fontSize: 15
	},
	rowLabelDisabled: {
		opacity: 0.4
	}
});
