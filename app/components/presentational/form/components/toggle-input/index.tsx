import { styles } from 'app/components/presentational/form/components/toggle-input/styles';
import React, { ReactNode, Component } from 'react';
import { Switch, TouchableWithoutFeedback, Text, View } from 'react-native';
import { FormInputComponent, FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';

/**
 * Presentational component to display a text input
 */
export class ToggleComponent extends Component<ToggleComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			currentValue,
			placeholder,
			onValueChange,
			disabled
		} = this.props;

		return (
			<FormInputComponent {...this.props}>
				<TouchableWithoutFeedback
					onPress={() => {
						onValueChange(!currentValue);
					}}>
					<View style={styles.container}>
						<Text style={styles.placeholder}>{placeholder}</Text>
						<Switch
							style={styles.input}
							onValueChange={onValueChange}
							value={currentValue}
							disabled={disabled}
						/>
					</View>
				</TouchableWithoutFeedback>
			</FormInputComponent>
		);
	}
}

/**
 * ToggleComponent's input props
 */
export type ToggleComponentInput = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentValue: boolean | undefined;

	/**
	 * The text placeholder
	 */
	placeholder: string;
}

/**
 * ToggleComponent's output props
 */
export type ToggleComponentOutput = FormInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onValueChange: (value: boolean) => void;
}

/**
 * ToggleComponent's props
 */
export type ToggleComponentProps = ToggleComponentInput & ToggleComponentOutput;
