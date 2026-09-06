import React, { ForwardedRef, ReactElement, forwardRef, useEffect, useRef, useState } from 'react';
import { InputComponent, InputComponentProps } from 'app/components/presentational/generic/input';

/**
 * Matches a decimal value while it is being typed: digits with at most one decimal separator, which
 * may be a comma because that is the only separator a mobile decimal keypad offers in many locales
 */
const DECIMAL_INPUT_VALUE_REGEX = /^\d*(?:[.,]\d*)?$/;

/**
 * Converts an optional number to a decimal input value
 * @param value number
 * @returns input value
 */
export const numberToDecimalInputValue = (value?: number): string => {
	return value === undefined ? '' : String(value);
};

/**
 * Converts a decimal input value to optional number, treating a comma as a decimal separator
 * @param value input string
 * @returns number or undefined
 */
export const decimalInputValueToNumber = (value: string): number | undefined => {
	if(!value) {
		return undefined;
	}

	const parsed = Number(value.replace(',', '.'));
	return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * All props of DecimalInputComponent
 */
export type DecimalInputComponentProps = Omit<InputComponentProps, 'type' | 'inputMode' | 'value' | 'onChange'> & {
	value?: number;
	onChange: (newValue: number | undefined) => void;
};

const DecimalInputComponentImplementation = (
	props: DecimalInputComponentProps,
	ref: ForwardedRef<HTMLInputElement>
): ReactElement => {
	const {
		value,
		onChange,
		...inputProps
	} = props;
	const [ inputValue, setInputValue ] = useState(() => {
		return numberToDecimalInputValue(value);
	});
	const inputValueRef = useRef(inputValue);

	useEffect(() => {
		inputValueRef.current = inputValue;
	}, [ inputValue ]);

	useEffect(() => {
		if(value === decimalInputValueToNumber(inputValueRef.current)) {
			return;
		}

		const nextInputValue = numberToDecimalInputValue(value);

		inputValueRef.current = nextInputValue;
		setInputValue(nextInputValue);
	}, [ value ]);

	return (
		<InputComponent
			{...inputProps}
			ref={ref}
			type='text'
			inputMode='decimal'
			value={inputValue}
			onChange={(event) => {
				const nextInputValue = event.target.value;

				if(!DECIMAL_INPUT_VALUE_REGEX.test(nextInputValue)) {
					return;
				}

				inputValueRef.current = nextInputValue;
				setInputValue(nextInputValue);
				onChange(decimalInputValueToNumber(nextInputValue));
			}}
		/>
	);
};

/**
 * Shared decimal input used when a number field must survive a mobile decimal keypad. It is a text input
 * rather than a number input because the keypad types the locale decimal separator, and a number input
 * drops the whole value when that separator is a comma. It keeps the raw text while it is being typed,
 * ignores anything that is not digits plus at most one separator, and reports both separators as a number
 */
export const DecimalInputComponent = forwardRef<HTMLInputElement, DecimalInputComponentProps>(DecimalInputComponentImplementation);

DecimalInputComponent.displayName = 'DecimalInputComponent';
