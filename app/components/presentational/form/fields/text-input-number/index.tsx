import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { NumericTextInputComponent, NumericTextInputComponentInput } from 'app/components/presentational/form/components/text-input-number';

/**
 * Formik wrapper of NumericTextInputComponent
 */
export class NumericTextInputFieldComponent extends Component<NumericTextInputFieldComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			name
		} = this.props;

		return (
			<FieldComponent name={name}>
				{(field, status) => {
					return (
						<NumericTextInputComponent
							{...this.props}
							status={status}
							currentValue={field.value}
							onValueChange={field.setValue}
							onFocus={field.onFocus}
							onBlur={field.onBlur}
						/>
					);
				}}
			</FieldComponent>
		);
	}
}

/**
 * NumericTextInputFieldComponent's input props
 */
export type NumericTextInputFieldComponentInput = Omit<NumericTextInputComponentInput, 'currentValue' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}
