import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		backgroundColor: config.ui.colors.white,
		paddingTop: 10,
		paddingBottom: 10,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%'
	},
	formContainer: {
		width: '100%',
		padding: 40
	},
	titleSectionContainer: {
		marginBottom: 50
	},
	inputsContainer: {
		marginBottom: 30
	},
	submitContainer: {
		
	}
});
