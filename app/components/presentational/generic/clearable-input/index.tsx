import React, { ForwardedRef, ReactElement, forwardRef } from 'react';
import { InputComponent, InputComponentProps } from 'app/components/presentational/generic/input';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { i18n } from 'app/utilities/i18n';

/**
 * All props of ClearableInputComponent
 */
export type ClearableInputComponentProps = InputComponentProps & {
	containerClassName?: string;
	clearButtonClassName?: string;
	clearLabel?: string;
	onClear: () => void;
	showClearButton?: boolean;
};

const ClearableInputComponentImplementation = (
	props: ClearableInputComponentProps,
	ref: ForwardedRef<HTMLInputElement>
): ReactElement => {
	const {
		containerClassName,
		clearButtonClassName,
		clearLabel = i18n.t('common.buttons.clear'),
		onClear,
		showClearButton = true,
		disabled,
		...inputProps
	} = props;
	const resolvedContainerClassName = containerClassName ? `clearable-input ${containerClassName}` : 'clearable-input';
	const resolvedClearButtonClassName = clearButtonClassName ? `clearable-input-clear-button ${clearButtonClassName}` : 'clearable-input-clear-button';

	return (
		<div className={resolvedContainerClassName}>
			<InputComponent
				{...inputProps}
				ref={ref}
				disabled={disabled}
			/>
			{showClearButton && (
				<PillButtonComponent
					tone='secondary'
					size='compact'
					appearance='subtle'
					className={resolvedClearButtonClassName}
					disabled={disabled}
					onClick={onClear}>
					{clearLabel}
				</PillButtonComponent>
			)}
		</div>
	);
};

/**
 * Shared clearable input wrapper used when a native input needs an explicit app-owned reset action.
 */
export const ClearableInputComponent = forwardRef<HTMLInputElement, ClearableInputComponentProps>(ClearableInputComponentImplementation);

ClearableInputComponent.displayName = 'ClearableInputComponent';
