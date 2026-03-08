import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderColor: config.ui.colors.separator
	},
	primaryIconContainer: {
		flex: 0
	},
	dataContainer: {
		flex: 1,
		marginRight: 10,
		marginLeft: 10
	},
	secondaryIconsContainer: {
		flex: 0
	}
});
