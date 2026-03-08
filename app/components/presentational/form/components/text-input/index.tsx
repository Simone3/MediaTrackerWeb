import { styles } from 'app/components/presentational/form/components/text-input/styles';
import React, { ReactNode, Component } from 'react';
import { TextInput, KeyboardTypeOptions } from 'react-native';
import { FormInputComponent, FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';

/**
 * Presentational component to display a text input
 */
export class TextInputComponent extends Component<TextInputComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			placeholder,
			keyboardType,
			currentText,
			onFocus,
			onBlur,
			onTextChange,
			disabled,
			multiline
		} = this.props;

		return (
			<FormInputComponent {...this.props}>
				<TextInput
					onChangeText={onTextChange}
					onFocus={onFocus}
					onBlur={onBlur}
					editable={!disabled}
					value={currentText ? String(currentText) : ''}
					placeholder={placeholder}
					keyboardType={keyboardType}
					multiline={multiline}
					style={styles.input}
				/>
			</FormInputComponent>
		);
	}
}

/**
 * TextInputComponent's input props
 */
export type TextInputComponentInput = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentText: string | undefined;

	/**
	 * The text placeholder
	 */
	placeholder: string;

	/**
	 * The keyboard type
	 */
	keyboardType?: KeyboardTypeOptions;

	/**
	 * If the input is multiline
	 */
	multiline?: boolean;
}

/**
 * TextInputComponent's output props
 */
export type TextInputComponentOutput = FormInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onTextChange: (text: string) => void;
}

/**
 * TextInputComponent's props
 */
export type TextInputComponentProps = TextInputComponentInput & TextInputComponentOutput;
