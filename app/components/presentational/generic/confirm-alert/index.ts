import { i18n } from 'app/utilities/i18n';
import { Alert, AlertButton, AlertOptions } from 'react-native';

/**
 * Simple helper to show a confirm alter with Cancel/OK options
 */
export class ConfirmAlert {

	/**
	 * Shows the alert
	 * @param title the title
	 * @param message the message
	 * @param onConfirm on "OK" click callback
	 * @param okButtonLabel optional "OK" button label
	 * @param cancelButtonLabel optional "Cancel" button label
	 */
	public static alert(title: string, message: string, onConfirm: () => void, okButtonLabel?: string, cancelButtonLabel?: string): void {

		const cancelButton: AlertButton = {
			text: okButtonLabel ? okButtonLabel : i18n.t('common.alert.default.cancelButton'),
			style: 'cancel'
		};

		const okButton: AlertButton = {
			text: cancelButtonLabel ? cancelButtonLabel : i18n.t('common.alert.default.okButton'),
			onPress: onConfirm
		};

		const options: AlertOptions = {
			cancelable: false
		};

		Alert.alert(title, message, [ cancelButton, okButton ], options);
	}
}
