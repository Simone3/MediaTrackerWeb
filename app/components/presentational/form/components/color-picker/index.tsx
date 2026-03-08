import React, { ReactNode, Component } from 'react';
import { styles } from 'app/components/presentational/form/components/color-picker/styles';
import { View, TouchableOpacity, Text } from 'react-native';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { FormInputComponent, FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';

/**
 * Presentational component to display a color picker
 */
export class ColorPickerComponent extends Component<ColorPickerComponentProps, ColorPickerComponentState> {
	
	public state: ColorPickerComponentState = { open: false };

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View>
				{this.renderInput()}
				{this.renderModal()}
			</View>
		);
	}

	/**
	 * Helper to render the main input
	 * @returns the component
	 */
	private renderInput(): ReactNode {

		const {
			currentColor,
			onFocus,
			disabled
		} = this.props;

		return (
			<FormInputComponent {...this.props}>
				<TouchableOpacity
					style={styles.nameCicleIconContainer}
					disabled={disabled}
					onPress={(event) => {
						this.setState({ open: true });
						onFocus(event);
					}}>
					<Text style={styles.colorName}>
						{currentColor ? currentColor.toUpperCase() : ''}
					</Text>
					<View
						style={[ styles.colorCircleIcon, { backgroundColor: currentColor || 'white' }]}
					/>
				</TouchableOpacity>
			</FormInputComponent>
		);
	}

	/**
	 * Helper to render the modal
	 * @returns the component
	 */
	private renderModal(): ReactNode {

		const {
			colors,
			onBlur,
			onSelectColor
		} = this.props;

		return (
			<ModalComponent
				visible={this.state.open}
				onClose={() => {
					onBlur(undefined);
					this.setState({ open: false });
				}}>
				<View style={styles.modalContent}>
					<View style={styles.colorCirclesGrid}>
						{colors.map((color) => {
							return (
								<TouchableOpacity
									key={color}
									onPress={(event) => {
										onSelectColor(color);
										onBlur(event);
										this.setState({ open: false });
									}}>
									<View
										style={[ styles.colorCircleButton, { backgroundColor: color }]}
									/>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			</ModalComponent>
		);
	}
}

/**
 * ColorPickerComponent's input props
 */
export type ColorPickerComponentInput = FormInputComponentInput & {

	/**
	 * The currently selected color
	 */
	currentColor: string | undefined;

	/**
	 * List of selectable colors (hex format)
	 */
	colors: string[];
}

/**
 * ColorPickerComponent's output props
 */
export type ColorPickerComponentOutput = FormInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onSelectColor: (color: string) => void;
}

/**
 * ColorPickerComponent's props
 */
export type ColorPickerComponentProps = ColorPickerComponentInput & ColorPickerComponentOutput;

/**
 * ColorPickerComponent's state
 */
export type ColorPickerComponentState = {

	/**
	 * If the modal is open
	 */
	open: boolean;
}
