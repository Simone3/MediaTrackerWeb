import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	outerCircle: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 10000,
		width: 18 + 8,
		height: 18 + 8,
		borderColor: config.ui.colors.colorPrimaryDark
	},
	outerCircleActive: {
		
	},
	innerCircle: {
		borderRadius: 10000,
		width: 18,
		height: 18
	},
	innerCircleActive: {
		backgroundColor: config.ui.colors.colorPrimary
	}
});
