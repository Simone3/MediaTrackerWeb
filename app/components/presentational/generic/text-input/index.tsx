import React, { ChangeEvent, ForwardedRef, ReactElement, forwardRef } from 'react';

const TEXT_INPUT_VARIANT_CLASS_NAMES = {
	auth: 'auth-input',
	categoryDetails: 'category-details-input',
	entityDetails: 'entity-details-input',
	mediaItemDetails: 'media-item-details-input',
	mediaItemsListSearch: 'media-items-list-search-input'
} as const;

/**
 * Supported style variants for the shared text input
 */
export type TextInputComponentVariant = keyof typeof TEXT_INPUT_VARIANT_CLASS_NAMES;

/**
 * All props of TextInputComponent
 */
export type TextInputComponentProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
	variant: TextInputComponentVariant;
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
	const variantClassName = TEXT_INPUT_VARIANT_CLASS_NAMES[variant];
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
