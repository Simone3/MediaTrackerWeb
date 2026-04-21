import { ReactElement } from 'react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';

/**
 * Presentational component to display a simple confirmation dialog
 * @param props the input props
 * @returns the component
 */
export const ConfirmDialogComponent = (props: ConfirmDialogComponentProps): ReactElement | null => {
	if(!props.visible) {
		return null;
	}

	return (
		<div className='confirm-dialog-overlay' role='presentation'>
			<div className='confirm-dialog' role='dialog' aria-modal={true} aria-labelledby='confirm-dialog-title'>
				<h2 id='confirm-dialog-title' className='confirm-dialog-title'>{props.title}</h2>
				<p className='confirm-dialog-message'>{props.message}</p>
				<div className='confirm-dialog-actions'>
					<PillButtonComponent tone='secondary' size='compact' onClick={props.onCancel}>
						{props.cancelLabel}
					</PillButtonComponent>
					<PillButtonComponent tone='primary' size='compact' onClick={props.onConfirm}>
						{props.confirmLabel}
					</PillButtonComponent>
				</div>
			</div>
		</div>
	);
};

/**
 * ConfirmDialogComponent input props
 */
export type ConfirmDialogComponentProps = {
	/**
	 * Dialog visibility
	 */
	visible: boolean;

	/**
	 * Dialog title
	 */
	title: string;

	/**
	 * Dialog message
	 */
	message: string;

	/**
	 * Confirm button label
	 */
	confirmLabel: string;

	/**
	 * Cancel button label
	 */
	cancelLabel: string;

	/**
	 * Callback invoked when user confirms
	 */
	onConfirm: () => void;

	/**
	 * Callback invoked when user cancels
	 */
	onCancel: () => void;
};
