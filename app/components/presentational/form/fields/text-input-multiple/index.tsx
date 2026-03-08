import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { MultiTextInputComponent, MultiTextInputComponentInput } from 'app/components/presentational/form/components/text-input-multiple';

/**
 * Formik wrapper of MultiTextInputComponent
 */
export class MultiTextInputFieldComponent extends Component<MultiTextInputFieldComponentInput> {
	
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
						<MultiTextInputComponent
							{...this.props}
							status={status}
							currentValues={field.value}
							onValuesChange={field.setValue}
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
 * MultiTextInputFieldComponent's input props
 */
export type MultiTextInputFieldComponentInput = Omit<MultiTextInputComponentInput, 'currentValues' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}

