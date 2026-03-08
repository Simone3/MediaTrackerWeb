import { i18n } from 'app/utilities/i18n';
import { showMessage } from 'react-native-flash-message';

/**
 * Simple helper that displays error messages to the user.
 * Only works with a "ErrorHandlerComponent" component in the current tree.
 */
export class FlashError {
	
	/**
	 * Displays an error with a flash message
	 * @param error the error message to display
	 */
	public static showError(error: string): void {

		showMessage({
			message: i18n.t('error.flash.title'),
			description: error,
			type: 'danger',
			duration: 3000
		});
	}
}

