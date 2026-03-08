import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { TextInputComponent, TextInputComponentInput } from 'app/components/presentational/form/components/text-input';

/**
 * Formik wrapper of TextInputComponent
 */
export class TextInputFieldComponent extends Component<TextInputFieldComponentInput> {
	
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
						<TextInputComponent
							{...this.props}
							status={status}
							currentText={field.value}
							onTextChange={field.setValue}
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
 * TextInputFieldComponent's input props
 */
export type TextInputFieldComponentInput = Omit<TextInputComponentInput, 'currentText' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}
