import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: config.ui.colors.white,
		paddingTop: 20,
		flex: 1,
		alignItems: 'center'
	}
});
