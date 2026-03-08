import React, { ChangeEvent, Component, ReactNode } from 'react';
import { Field, FieldProps } from 'formik';
import { NativeSyntheticEvent } from 'react-native';

/**
 * Wrapper of Formik <Field> that:
 * - Handles focused state (input is currently active) since base <Field> does not at the moment
 * - Computes the current status of the component
 */
export class FieldComponent extends Component<FieldComponentInput, FieldComponentState> {
	
	public state: FieldComponentState = { focused: false };

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			name
		} = this.props;

		return (
			<Field name={name}>
				{(formikProps: FieldProps) => {

					const field: FieldData = {
						onChange: (event) => {
							formikProps.field.onChange(name)(event);
						},
						onFocus: () => {
							this.toggleFocus(true);
						},
						onBlur: (event) => {
							this.toggleFocus(false);
							const fieldOnBlur = formikProps.field.onBlur(name);
							fieldOnBlur({
								event: event,
								target: name
							});
						},
						value: formikProps.field.value,
						setValue: (value) => {
							formikProps.form.setFieldValue(name, value);
						}
					};

					return this.props.children(field, this.getFieldStatus(formikProps));
				}}
			</Field>
		);
	}
	
	/**
	 * Helper to get current field status
	 * @param formikProps Formik data
	 * @returns the container style(s)
	 */
	private getFieldStatus(formikProps: FieldProps): FieldComponentStatus {

		const {
			name
		} = this.props;

		const {
			form
		} = formikProps;

		const isError = form.touched[name] && form.errors[name];
		const isFocus = this.state.focused;

		if(isFocus) {

			return 'FOCUSED';
		}
		else if(isError) {

			return 'ERROR';
		}
		else {

			return 'DEFAULT';
		}
	}

	/**
	 * Helper to toggle the focus state
	 * @param focused new focus state
	 */
	private toggleFocus(focused: boolean): void {

		this.setState({ focused: focused });
	}
}

/**
 * Field data that children can access to get or notify form changes
 */
type FieldData = {

	/**
	 * Allows children to notify input change
	 */
	onChange: (event: string | ChangeEvent<unknown>) => void;

	/**
	 * Allows children to notify input focus (input is currently active)
	 */
	onFocus: (event: NativeSyntheticEvent<unknown> | undefined) => void;
	
	/**
	 * Allows children to notify input blur (input is no longer active)
	 */
	onBlur: (event: NativeSyntheticEvent<unknown> | undefined) => void;

	/**
	 * Allows children to get the input value
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;

	/**
	 * Allows children that use custom components to set the input value
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setValue: (value: any) => void;
};

/**
 * FieldComponent's input props
 */
export type FieldComponentInput = {

	/**
	 * The input name (unique in the form)
	 */
	name: string;

	/**
	 * The component's child must be a function (render prop)
	 */
	children: (field: FieldData, status: FieldComponentStatus) => ReactNode;
}

/**
 * FieldComponent's state
 */
export type FieldComponentState = {

	/**
	 * If the component is currently focused
	 */
	focused: boolean;
}

/**
 * Describes the current status of the field
 */
export type FieldComponentStatus = 'FOCUSED' | 'ERROR' | 'DEFAULT';
