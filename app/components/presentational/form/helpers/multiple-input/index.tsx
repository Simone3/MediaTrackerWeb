import { styles } from 'app/components/presentational/form/helpers/multiple-input/styles';
import React, { ReactNode, Component } from 'react';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { FormInputComponent, FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';
import { ModalInputConfirmComponent } from 'app/components/presentational/form/helpers/modal-confirm';
import { PlaceholderTextComponent } from 'app/components/presentational/generic/placeholder-text';

/**
 * Presentational component to display a multiplegeneric input (result is an array of input values)
 * @template I the single input type
 */
export class GenericMultipleInputComponent<I> extends Component<GenericMultipleInputComponentProps<I>, GenericMultipleInputComponentState<I>> {
	
	public state: GenericMultipleInputComponentState<I> = { open: false, currentTemporaryValues: [] };

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<FormInputComponent {...this.props}>
				{this.renderInput()}
				{this.renderModal()}
			</FormInputComponent>
		);
	}

	/**
	 * Helper to render the visibile form field
	 * @returns the component
	 */
	private renderInput(): ReactNode {

		const {
			placeholder,
			currentValues,
			onFocus,
			defaultInputValue,
			onBuildDisplayString,
			disabled
		} = this.props;

		const textValue = currentValues ? onBuildDisplayString(currentValues) : '';

		return (
			<TouchableOpacity
				style={styles.inputContainer}
				disabled={disabled}
				onPress={(event) => {

					this.setState({
						open: true,
						currentTemporaryValues: currentValues && currentValues.length > 0 ? currentValues : [ defaultInputValue ]
					});
					onFocus(event);
				}}>
				<PlaceholderTextComponent
					style={styles.input}
					placeholder={placeholder}>
					{textValue}
				</PlaceholderTextComponent>
			</TouchableOpacity>
		);
	}

	/**
	 * Helper to render the modal
	 * @returns the component
	 */
	private renderModal(): ReactNode {

		const {
			onBlur
		} = this.props;

		return (
			<ModalComponent
				visible={this.state.open}
				onClose={() => {

					onBlur(undefined);
					this.setState({ open: false });
				}}>
				<View style={styles.modalContent}>
					{this.renderModalContent()}
				</View>
			</ModalComponent>
		);
	}

	/**
	 * Helper to render the modal content
	 * @returns the component
	 */
	private renderModalContent(): ReactNode {

		return (
			<View>
				<View style={styles.modalInputsContainer}>
					{this.renderModalInputs()}
				</View>
				{this.renderModalConfirmButton()}
			</View>
		);
	}

	/**
	 * Helper to render the modal list of inputs
	 * @returns the component
	 */
	private renderModalInputs(): ReactNode {

		const {
			currentTemporaryValues
		} = this.state;

		const {
			onBuildInput
		} = this.props;

		return (
			<FlatList
				style={styles.modalInputsList}
				data={currentTemporaryValues}
				renderItem={(info) => {

					return (
						<View
							style={styles.modalInputContainer}>
							{onBuildInput(info.item, (newValue) => {

								const newTempValues = currentTemporaryValues.slice(0);
								newTempValues[info.index] = newValue;
								this.setState({ currentTemporaryValues: newTempValues });
							})}
							{this.renderModalInputIcon(info.index)}
						</View>
					);
				}}
				keyExtractor={(_, index) => {
					return String(index);
				}}
			/>
		);
	}

	/**
	 * Helper to render a modal input icon
	 * @param index the input index
	 * @returns the component
	 */
	private renderModalInputIcon(index: number): ReactNode {
		
		const {
			currentTemporaryValues
		} = this.state;

		const {
			defaultInputValue
		} = this.props;

		let onClick;
		let text;
		let style;
		if(index === 0) {

			onClick = () => {

				const newTempValues = currentTemporaryValues.slice(0);
				newTempValues.push(defaultInputValue);
				this.setState({ currentTemporaryValues: newTempValues });
			};

			text = '+';

			style = styles.modalInputAddText;
		}
		else {

			onClick = () => {

				const newTempValues = currentTemporaryValues.slice(0);
				newTempValues.splice(index, 1);
				this.setState({ currentTemporaryValues: newTempValues });
			};

			text = 'x';

			style = styles.modalInputRemoveText;
		}

		return (
			<TouchableOpacity
				style={styles.modalInputButton}
				onPress={onClick}>
				<Text style={[ styles.modalInputText, style ]}>{text}</Text>
			</TouchableOpacity>
		);
	}

	/**
	 * Helper to render the modal confirm button
	 * @returns the component
	 */
	private renderModalConfirmButton(): ReactNode {

		const {
			currentTemporaryValues
		} = this.state;

		const {
			onValuesChange,
			onBlur,
			onValidityCheck
		} = this.props;

		const valid = onValidityCheck(currentTemporaryValues);

		return (
			<ModalInputConfirmComponent
				valid={valid}
				onConfirm={(event) => {

					const fieldValue = currentTemporaryValues.length === 1 && !currentTemporaryValues[0] ? [] : currentTemporaryValues;

					onValuesChange(fieldValue);
					onBlur(event);
					this.setState({ open: false });
				}}
			/>
		);
	}
}

/**
 * GenericMultipleInputComponent's input props
 */
export type GenericMultipleInputComponentInput<I> = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentValues: I[] | undefined;

	/**
	 * The default value of an input
	 */
	defaultInputValue: I;

	/**
	 * The text placeholder
	 */
	placeholder: string;
}

/**
 * GenericMultipleInputComponent's output props
 */
export type GenericMultipleInputComponentOutput<I> = FormInputComponentOutput & {

	/**
	 * Callback to notify input value change
	 */
	onValuesChange: (values: I[]) => void;

	/**
	 * Callback to check if the current values are valid
	 */
	onValidityCheck: (values: I[]) => boolean;

	/**
	 * Callback to build the displayed string in the main input
	 */
	onBuildDisplayString: (values: I[]) => string;

	/**
	 * Callback to build the single specific input component
	 */
	onBuildInput: (value: I, onValueChange: (newValue: I) => void) => ReactNode;
}

/**
 * GenericMultipleInputComponent's props
 */
export type GenericMultipleInputComponentProps<I> = GenericMultipleInputComponentInput<I> & GenericMultipleInputComponentOutput<I>;

/**
 * GenericMultipleInputComponent's state
 */
type GenericMultipleInputComponentState<I> = {

	/**
	 * If the modal is open
	 */
	open: boolean;

	/**
	 * The current modal values (not yet submitted)
	 */
	currentTemporaryValues: I[];
}

