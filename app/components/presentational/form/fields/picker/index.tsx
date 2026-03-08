import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { PickerComponent } from 'app/components/presentational/form/components/picker';
import { PickerComponentInput } from 'app/components/presentational/form/components/picker/common';

/**
 * Formik wrapper of PickerComponent
 */
export class PickerFieldComponent extends Component<PickerFieldComponentInput> {
	
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
						<PickerComponent
							{...this.props}
							status={status}
							currentItem={field.value}
							onSelectItem={field.setValue}
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
 * PickerFieldComponent's input props
 */
export type PickerFieldComponentInput = Omit<PickerComponentInput, 'currentItem' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}
