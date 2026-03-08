import { styles } from 'app/components/presentational/form/helpers/multiple-input/styles';
import { GenericMultipleInputComponent } from 'app/components/presentational/form/helpers/multiple-input';
import React, { ReactNode, Component } from 'react';
import { TextInput, KeyboardTypeOptions } from 'react-native';
import { i18n } from 'app/utilities/i18n';
import { FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';

/**
 * Presentational component to display a multiple text input (result is array of user-defined strings)
 */
export class MultiTextInputComponent extends Component<MultiTextInputComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<GenericMultipleInputComponent<string>
				{...this.props}
				defaultInputValue=''
				onValidityCheck={this.onValidityCheck}
				onBuildDisplayString={this.onBuildDisplayString}
				onBuildInput={this.onBuildInput.bind(this)}
			/>
		);
	}

	private onValidityCheck(values: string[]): boolean {

		return values.length === 1 || !values.some((value) => {
			return !value || value.trim().length === 0;
		});
	}

	private onBuildDisplayString(values: string[]): string {

		return values.join(', ');
	}

	private onBuildInput(value: string, onValueChange: (newValue: string) => void): ReactNode {
		
		const {
			keyboardType
		} = this.props;

		return (
			<TextInput
				style={styles.modalInput}
				keyboardType={keyboardType}
				placeholder={i18n.t('common.form.input.multiText.placeholder')}
				value={value}
				onChangeText={onValueChange}
			/>
		);
	}
}

/**
 * MultiTextInputComponent's input props
 */
export type MultiTextInputComponentInput = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentValues: string[] | undefined;

	/**
	 * The text placeholder
	 */
	placeholder: string;

	/**
	 * The keyboard type
	 */
	keyboardType?: KeyboardTypeOptions;
}

/**
 * MultiTextInputComponent's output props
 */
export type MultiTextInputComponentOutput = FormInputComponentOutput;

/**
 * MultiTextInputComponent's props
 */
export type MultiTextInputComponentProps = MultiTextInputComponentInput & MultiTextInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onValuesChange: (values: string[]) => void;
}

