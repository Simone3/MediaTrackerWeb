import React, { ChangeEvent, ForwardedRef, ReactElement, forwardRef } from 'react';

/**
 * All props of SelectComponent
 */
export type SelectComponentProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
	onChange?: React.ChangeEventHandler<HTMLSelectElement>;
	onChangeValue?: (value: string) => void;
};

const SelectComponentImplementation = (
	props: SelectComponentProps,
	ref: ForwardedRef<HTMLSelectElement>
): ReactElement => {
	const {
		onChangeValue,
		className,
		...otherProps
	} = props;
	const resolvedClassName = className ? `select-input ${className}` : 'select-input';

	return (
		<select
			{...otherProps}
			ref={ref}
			className={resolvedClassName}
			onChange={(event: ChangeEvent<HTMLSelectElement>) => {
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
 * Shared select component used across forms and filters
 */
export const SelectComponent = forwardRef<HTMLSelectElement, SelectComponentProps>(SelectComponentImplementation);

SelectComponent.displayName = 'SelectComponent';
