import React, { ForwardedRef, ReactElement, forwardRef } from 'react';

export type PillButtonTone = 'primary' | 'secondary' | 'danger';
export type PillButtonSize = 'default' | 'compact';
export type PillButtonAppearance = 'default' | 'subtle';

/**
 * All props of PillButtonComponent
 */
export type PillButtonComponentProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	tone?: PillButtonTone;
	size?: PillButtonSize;
	appearance?: PillButtonAppearance;
	loadingVisible?: boolean;
};

const PillButtonComponentImplementation = (
	props: PillButtonComponentProps,
	ref: ForwardedRef<HTMLButtonElement>
): ReactElement => {
	const {
		tone = 'primary',
		size = 'default',
		appearance = 'default',
		loadingVisible = false,
		className,
		children,
		type = 'button',
		...otherProps
	} = props;
	const sizeClassName = size === 'compact' ? ' pill-button-compact' : '';
	const appearanceClassName = appearance === 'subtle' ? ' pill-button-subtle' : '';
	const loadingClassName = loadingVisible ? ' pill-button-loading' : '';
	const baseClassName = `pill-button pill-button-${tone}${sizeClassName}${appearanceClassName}${loadingClassName}`;
	const resolvedClassName = className ? `${baseClassName} ${className}` : baseClassName;

	return (
		<button
			{...otherProps}
			ref={ref}
			type={type}
			className={resolvedClassName}
			aria-busy={loadingVisible}>
			<span className='pill-button-content'>
				<span className='pill-button-label'>
					{children}
				</span>
				{loadingVisible &&
					<span className='pill-button-spinner' aria-hidden='true' />}
			</span>
		</button>
	);
};

/**
 * Shared pill-shaped action button used across forms and dialogs
 */
export const PillButtonComponent = forwardRef<HTMLButtonElement, PillButtonComponentProps>(PillButtonComponentImplementation);

PillButtonComponent.displayName = 'PillButtonComponent';
