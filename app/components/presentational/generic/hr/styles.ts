import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		borderBottomColor: config.ui.colors.separator,
		borderBottomWidth: 1
	}
});
