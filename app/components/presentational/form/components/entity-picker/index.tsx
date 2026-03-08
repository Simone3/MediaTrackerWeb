import React, { ReactNode, Component } from 'react';
import { styles } from 'app/components/presentational/form/components/entity-picker/styles';
import { FormInputComponentInput, FormInputComponentOutput, FormInputComponent } from 'app/components/presentational/form/components/generic';
import { PlaceholderTextComponent } from 'app/components/presentational/generic/placeholder-text';
import { TouchableOpacity } from 'react-native';

/**
 * Presentational component to display a generic entity picker, with the possibility to open a selection screen on click
 */
export class GenericEntityPickerComponent extends Component<GenericEntityPickerComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<FormInputComponent {...this.props}>
				{this.renderInput()}
			</FormInputComponent>
		);
	}

	/**
	 * Helper to render the visibile form field
	 * @returns the component
	 */
	private renderInput(): ReactNode {

		const {
			currentEntity,
			disabled,
			placeholder,
			requestEntitySelection
		} = this.props;

		const textValue = currentEntity ? currentEntity.name : '';

		return (
			<TouchableOpacity
				style={styles.inputContainer}
				disabled={disabled}
				onPress={requestEntitySelection}>
				<PlaceholderTextComponent
					style={styles.input}
					placeholder={placeholder}>
					{textValue}
				</PlaceholderTextComponent>
			</TouchableOpacity>
		);
	}
}

/**
 * GenericEntityPickerComponent's input props
 */
export type GenericEntityPickerComponentInput = FormInputComponentInput & {

	/**
	 * The current entity name, if any
	 */
	currentEntity: { id: string; name: string } | undefined;

	/**
	 * The input placeholder
	 */
	placeholder: string;
}

/**
 * GenericEntityPickerComponent's output props
 */
export type GenericEntityPickerComponentOutput = FormInputComponentOutput & {

	/**
	 * Callback to request the actual entity selection screen
	 */
	requestEntitySelection: () => void;
}

/**
 * GenericEntityPickerComponent's props
 */
export type GenericEntityPickerComponentProps = GenericEntityPickerComponentInput & GenericEntityPickerComponentOutput;
