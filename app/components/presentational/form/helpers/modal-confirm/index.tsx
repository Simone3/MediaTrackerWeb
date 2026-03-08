import { styles } from 'app/components/presentational/form/helpers/modal-confirm/styles';
import React, { ReactNode, Component } from 'react';
import { View, TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display a confirm button for a modal-based field
 */
export class ModalInputConfirmComponent extends Component<ModalInputConfirmComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			valid,
			onConfirm
		} = this.props;

		return (
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					disabled={!valid}
					onPress={onConfirm}>
					<Text style={!valid ? [ styles.button, styles.buttonDisabled ] : styles.button }>
						{i18n.t('common.alert.default.okButton')}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

/**
 * ModalInputConfirmComponent's input props
 */
export type ModalInputConfirmComponentInput = {

	/**
	 * If the field modal inputs are valid, and therefore the confirm button is enabled
	 */
	valid: boolean;
}

/**
 * ModalInputConfirmComponent's output props
 */
export type ModalInputConfirmComponentOutput = {
	
	/**
	 * Callback for user click on the enabled button
	 */
	onConfirm: (event: GestureResponderEvent) => void;
};

/**
 * ModalInputConfirmComponent's props
 */
export type ModalInputConfirmComponentProps = ModalInputConfirmComponentInput & ModalInputConfirmComponentOutput;
