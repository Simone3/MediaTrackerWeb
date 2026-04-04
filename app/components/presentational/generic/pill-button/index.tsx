import React, { ForwardedRef, ReactElement, forwardRef } from 'react';

export type PillButtonTone = 'primary' | 'secondary' | 'danger';
export type PillButtonSize = 'default' | 'compact';

/**
 * All props of PillButtonComponent
 */
export type PillButtonComponentProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	tone?: PillButtonTone;
	size?: PillButtonSize;
};

const PillButtonComponentImplementation = (
	props: PillButtonComponentProps,
	ref: ForwardedRef<HTMLButtonElement>
): ReactElement => {
	const {
		tone = 'primary',
		size = 'default',
		className,
		type = 'button',
		...otherProps
	} = props;
	const sizeClassName = size === 'compact' ? ' pill-button-compact' : '';
	const baseClassName = `pill-button pill-button-${tone}${sizeClassName}`;
	const resolvedClassName = className ? `${baseClassName} ${className}` : baseClassName;

	return (
		<button
			{...otherProps}
			ref={ref}
			type={type}
			className={resolvedClassName}
		/>
	);
};

/**
 * Shared pill-shaped action button used across forms and dialogs
 */
export const PillButtonComponent = forwardRef<HTMLButtonElement, PillButtonComponentProps>(PillButtonComponentImplementation);

PillButtonComponent.displayName = 'PillButtonComponent';
