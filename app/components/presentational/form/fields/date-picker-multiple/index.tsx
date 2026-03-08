import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { MultiDateInputComponent, MultiDateInputComponentInput } from 'app/components/presentational/form/components/date-picker-multiple';

/**
 * Formik wrapper of MultiDateInputComponent
 */
export class MultiDateInputFieldComponent extends Component<MultiDateInputFieldComponentInput> {
	
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
						<MultiDateInputComponent
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
 * MultiDateInputFieldComponent's input props
 */
export type MultiDateInputFieldComponentInput = Omit<MultiDateInputComponentInput, 'currentValues' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}

