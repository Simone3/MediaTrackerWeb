import { ReactElement } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { i18n } from 'app/utilities/i18n';

/**
 * Shared edge-trigger helper for duplicated-name confirmation requests.
 * @param previousRequested previous prop value
 * @param nextRequested current prop value
 * @returns true when the dialog should open
 */
export const shouldOpenSameNameConfirmation = (previousRequested: boolean, nextRequested: boolean): boolean => {
	return !previousRequested && nextRequested;
};

/**
 * Shared duplicated-name confirmation dialog.
 * @param props the input props
 * @returns the component
 */
export const SameNameConfirmationDialogComponent = (props: SameNameConfirmationDialogComponentProps): ReactElement | null => {
	return (
		<ConfirmDialogComponent
			visible={props.visible}
			title={props.title}
			message={props.message}
			confirmLabel={i18n.t('common.alert.default.okButton')}
			cancelLabel={i18n.t('common.alert.default.cancelButton')}
			onConfirm={props.onConfirm}
			onCancel={props.onCancel}
		/>
	);
};

type SameNameConfirmationDialogComponentProps = {
	visible: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
};
