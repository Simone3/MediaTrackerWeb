import React, { ChangeEvent, ForwardedRef, ReactElement, forwardRef } from 'react';

/**
 * All props of TextInputComponent
 */
export type TextInputComponentProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
	variant?: 'auth';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onChangeText?: (value: string) => void;
	secureTextEntry?: boolean;
};

const TextInputComponentImplementation = (
	props: TextInputComponentProps,
	ref: ForwardedRef<HTMLInputElement>
): ReactElement => {
	const {
		onChangeText,
		secureTextEntry,
		className,
		type,
		variant,
		...otherProps
	} = props;
	const resolvedType = secureTextEntry ? 'password' : type || 'text';
	const variantClassName = variant === 'auth' ? 'text-input text-input-auth' : 'text-input';
	const resolvedClassName = className ? `${variantClassName} ${className}` : variantClassName;

	return (
		<input
			{...otherProps}
			ref={ref}
			type={resolvedType}
			className={resolvedClassName}
			onChange={(event: ChangeEvent<HTMLInputElement>) => {
				if(otherProps.onChange) {
					otherProps.onChange(event);
				}
				if(onChangeText) {
					onChangeText(event.target.value);
				}
			}}
		/>
	);
};

/**
 * Shared input component used by text-like fields across the app
 */
export const TextInputComponent = forwardRef<HTMLInputElement, TextInputComponentProps>(TextInputComponentImplementation);

TextInputComponent.displayName = 'TextInputComponent';
