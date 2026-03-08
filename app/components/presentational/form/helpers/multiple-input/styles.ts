import { config } from 'app/config/config';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	inputContainer: {
		flex: 1
	},
	input: {
		padding: 15,
		paddingLeft: 10,
		fontSize: 15,
		color: config.ui.colors.colorFormInputs
	},
	modalContent: {
		width: 260,
		height: 350,
		backgroundColor: config.ui.colors.colorModalBackground
	},
	modalInputsContainer: {
		height: 290
	},
	modalInputsList: {
		padding: 20
	},
	modalInputContainer: {
		flex: 1,
		flexDirection: 'row',
		alignContent: 'flex-start',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: config.ui.colors.colorFormInputs,
		marginBottom: 10
	},
	modalInput: {
		flex: 1,
		padding: 10
	},
	modalInputButton: {
		flex: 0,
		marginRight: 5
	},
	modalInputText: {
		fontSize: 20
	},
	modalInputAddText: {
		color: config.ui.colors.green
	},
	modalInputRemoveText: {
		color: config.ui.colors.red
	}
});
