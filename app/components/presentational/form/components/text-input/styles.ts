import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	input: {
		flex: 1,
		padding: Platform.OS === 'ios' ? 15 : 10,
		paddingLeft: 10,
		fontSize: 15
	}
});
