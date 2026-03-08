import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	nameCicleIconContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	colorName: {
		fontSize: 15,
		flex: 1,
		alignSelf: 'center',
		margin: 10,
		color: config.ui.colors.colorFormInputs
	},
	colorCircleIcon: {
		borderRadius: 50,
		width: 30,
		height: 30,
		margin: 10,
		alignSelf: 'flex-end'
	},
	modalContent: {
		width: 260,
		height: 140,
		backgroundColor: config.ui.colors.colorModalBackground,
		borderRadius: 20
	},
	colorCirclesGrid: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		padding: 10
	},
	colorCircleButton: {
		borderRadius: 50,
		width: 40,
		height: 40,
		margin: 10
	}
});
