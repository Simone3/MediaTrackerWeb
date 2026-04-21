import React, { ChangeEvent, ForwardedRef, ReactElement, forwardRef } from 'react';

/**
 * All props of TextareaComponent
 */
export type TextareaComponentProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onChangeValue?: (value: string) => void;
};

const TextareaComponentImplementation = (
	props: TextareaComponentProps,
	ref: ForwardedRef<HTMLTextAreaElement>
): ReactElement => {
	const {
		onChangeValue,
		className,
		...otherProps
	} = props;
	const resolvedClassName = className ? `textarea-input ${className}` : 'textarea-input';

	return (
		<textarea
			{...otherProps}
			ref={ref}
			className={resolvedClassName}
			onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
				if(otherProps.onChange) {
					otherProps.onChange(event);
				}
				if(onChangeValue) {
					onChangeValue(event.target.value);
				}
			}}
		/>
	);
};

/**
 * Shared textarea component used across forms
 */
export const TextareaComponent = forwardRef<HTMLTextAreaElement, TextareaComponentProps>(TextareaComponentImplementation);

TextareaComponent.displayName = 'TextareaComponent';
