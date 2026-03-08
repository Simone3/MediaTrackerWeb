import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: config.ui.colors.white,
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 10,
		paddingRight: 10,
		flex: 1
	}
});
