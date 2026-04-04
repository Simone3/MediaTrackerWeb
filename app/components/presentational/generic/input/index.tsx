import React, { ChangeEvent, ForwardedRef, ReactElement, forwardRef } from 'react';

/**
 * All props of InputComponent
 */
export type InputComponentProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
	variant?: 'auth';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onChangeValue?: (value: string) => void;
	secureTextEntry?: boolean;
};

const InputComponentImplementation = (
	props: InputComponentProps,
	ref: ForwardedRef<HTMLInputElement>
): ReactElement => {
	const {
		onChangeValue,
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
				if (otherProps.onChange) {
					otherProps.onChange(event);
				}
				if (onChangeValue) {
					onChangeValue(event.target.value);
				}
			}}
		/>
	);
};

/**
 * Shared input component used by single-line native inputs across the app
 */
export const InputComponent = forwardRef<HTMLInputElement, InputComponentProps>(InputComponentImplementation);

InputComponent.displayName = 'InputComponent';
