import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { DatePickerComponent, DatePickerComponentInput } from 'app/components/presentational/form/components/date-picker';

/**
 * Formik wrapper of DatePickerComponent
 */
export class DatePickerFieldComponent extends Component<DatePickerFieldComponentInput> {
	
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
						<DatePickerComponent
							{...this.props}
							status={status}
							currentDate={field.value}
							onSelectDate={field.setValue}
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
 * DatePickerFieldComponent's input props
 */
export type DatePickerFieldComponentInput = Omit<DatePickerComponentInput, 'currentDate' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}

