import React, { ReactNode, Component } from 'react';
import { FieldComponent } from 'app/components/presentational/form/fields/generic';
import { GenericEntityPickerComponent, GenericEntityPickerComponentInput, GenericEntityPickerComponentOutput } from 'app/components/presentational/form/components/entity-picker';

/**
 * Formik wrapper of GenericEntityPickerComponent
 */
export class EntityPickerFieldComponent extends Component<EntityPickerFieldComponentProps> {
	
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
						<GenericEntityPickerComponent
							{...this.props}
							status={status}
							currentEntity={field.value}
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
 * EntityPickerFieldComponent's input props
 */
export type EntityPickerFieldComponentInput = Omit<GenericEntityPickerComponentInput, 'currentEntity' | 'status'> & {

	/**
	 * The input name (unique in the form)
	 */
	name: string;
}

/**
 * EntityPickerFieldComponent's output props
 */
export type EntityPickerFieldComponentOutput = Omit<GenericEntityPickerComponentOutput, 'onFocus' | 'onBlur'>;

/**
 * EntityPickerFieldComponent's props
 */
export type EntityPickerFieldComponentProps = EntityPickerFieldComponentInput & EntityPickerFieldComponentOutput;

