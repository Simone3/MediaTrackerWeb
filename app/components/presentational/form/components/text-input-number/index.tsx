import React, { ReactNode, Component } from 'react';
import { TextInputComponentInput, TextInputComponentOutput, TextInputComponent } from 'app/components/presentational/form/components/text-input';

/**
 * Presentational component to display a numeric text input
 */
export class NumericTextInputComponent extends Component<NumericTextInputComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			currentValue,
			onValueChange
		} = this.props;

		return (
			<TextInputComponent
				keyboardType='number-pad'
				{...this.props}
				currentText={currentValue === undefined || currentValue === null ? '' : String(currentValue)}
				onTextChange={(text) => {

					if(text && text.trim()) {

						const parsed = Number(text);
						onValueChange(Number.isNaN(parsed) ? undefined : parsed);
					}
					else {

						onValueChange(undefined);
					}
				}}
			/>
		);
	}
}

/**
 * NumericTextInputComponent's input props
 */
export type NumericTextInputComponentInput = Omit<TextInputComponentInput, 'currentText'> & {

	/**
	 * The current value
	 */
	currentValue: number | undefined;
}

/**
 * NumericTextInputComponent's output props
 */
export type NumericTextInputComponentOutput = Omit<TextInputComponentOutput, 'onTextChange'> & {

	/**
	 * Notifies input value change
	 */
	onValueChange: (value: number | undefined) => void;
}

/**
 * NumericTextInputComponent's props
 */
export type NumericTextInputComponentProps = NumericTextInputComponentInput & NumericTextInputComponentOutput;
