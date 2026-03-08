import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { ToggleComponent, ToggleComponentInput } from 'app/components/presentational/form/components/toggle-input';

/**
 * Formik wrapper of ToggleComponent
 */
export class ToggleFieldComponent extends Component<ToggleFieldComponentInput> {
	
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
						<ToggleComponent
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
 * ToggleFieldComponent's input props
 */
export type ToggleFieldComponentInput = Omit<ToggleComponentInput, 'currentValue' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}
