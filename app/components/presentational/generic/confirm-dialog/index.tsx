import React, { ReactElement } from 'react';

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
					<button type='button' className='confirm-dialog-button confirm-dialog-button-secondary' onClick={props.onCancel}>
						{props.cancelLabel}
					</button>
					<button type='button' className='confirm-dialog-button confirm-dialog-button-primary' onClick={props.onConfirm}>
						{props.confirmLabel}
					</button>
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
