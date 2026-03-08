import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { ColorPickerComponent, ColorPickerComponentInput } from 'app/components/presentational/form/components/color-picker';

/**
 * Formik wrapper of ColorPickerComponent
 */
export class ColorPickerFieldComponent extends Component<ColorPickerFieldComponentInput> {

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
						<ColorPickerComponent
							{...this.props}
							status={status}
							currentColor={field.value}
							onSelectColor={field.setValue}
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
 * ColorPickerFieldComponent's input props
 */
export type ColorPickerFieldComponentInput = Omit<ColorPickerComponentInput, 'currentColor' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}
