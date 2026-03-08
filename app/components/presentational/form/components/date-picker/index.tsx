import React, { ReactNode, Component } from 'react';
import { styles } from 'app/components/presentational/form/components/date-picker/styles';
import { View, TouchableOpacity, Platform } from 'react-native';
import { FormInputComponent, FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PlaceholderTextComponent } from 'app/components/presentational/generic/placeholder-text';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { ModalInputConfirmComponent } from 'app/components/presentational/form/helpers/modal-confirm';
import { config } from 'app/config/config';
import { format } from 'date-fns';

/**
 * Presentational component to display a date picker
 */
export class DatePickerComponent extends Component<DatePickerComponentProps, DatePickerComponentState> {
	
	public state: DatePickerComponentState = { open: false, currentTemporaryDate: undefined };

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
	 * Helper to render the main input (full)
	 * @returns the component
	 */
	private renderInput(): ReactNode {

		const {
			hideIconAndStatus
		} = this.props;

		if(hideIconAndStatus) {

			return this.renderInputInternal();
		}
		else {

			return (
				<FormInputComponent {...this.props}>
					{this.renderInputInternal()}
				</FormInputComponent>
			);
		}
	}

	/**
	 * Helper to render the main input (internal part)
	 * @returns the component
	 */
	private renderInputInternal(): ReactNode {

		const {
			currentDate,
			placeholder,
			onFocus,
			disabled
		} = this.props;

		return (
			<TouchableOpacity
				style={styles.inputContainer}
				disabled={disabled}
				onPress={(event) => {
					this.setState({ open: true, currentTemporaryDate: currentDate });
					onFocus(event);
				}}>
				<PlaceholderTextComponent
					style={styles.input}
					placeholder={placeholder}>
					{currentDate ? format(currentDate, config.ui.dateFormat) : ''}
				</PlaceholderTextComponent>
			</TouchableOpacity>
		);
	}

	/**
	 * Helper to render the modal
	 * @returns the component
	 */
	private renderModal(): ReactNode {

		if(this.state.open) {

			if(Platform.OS === 'ios') {

				return this.renderIOSModal();
			}
			else {
				
				return this.renderAndroidModal();
			}
		}

		return undefined;
	}

	/**
	 * Helper to render the Android modal
	 * @returns the component
	 */
	private renderAndroidModal(): ReactNode {

		// On Android, the picker is natively in a modal, no need for extra components
		return this.renderPicker('calendar');
	}

	/**
	 * Helper to render the iOS modal
	 * @returns the component
	 */
	private renderIOSModal(): ReactNode {

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
				<View style={styles.iosModalContent}>
					{this.renderPicker('spinner')}
					{this.renderModalConfirmButton()}
				</View>
			</ModalComponent>
		);
	}

	/**
	 * Helper to render the modal confirm button
	 * @returns the component
	 */
	private renderModalConfirmButton(): ReactNode {

		const {
			currentTemporaryDate
		} = this.state;

		const {
			onSelectDate,
			onBlur
		} = this.props;

		return (
			<ModalInputConfirmComponent
				valid={true}
				onConfirm={(event) => {

					onSelectDate(currentTemporaryDate);
					onBlur(event);
					this.setState({ open: false });
				}}
			/>
		);
	}

	/**
	 * Helper to render the actual date picker
	 * @param display display mode
	 * @returns the component
	 */
	private renderPicker(display: 'spinner' | 'default' | 'calendar'): ReactNode {

		const {
			currentTemporaryDate
		} = this.state;

		const {
			onBlur,
			onSelectDate
		} = this.props;

		return (
			<DateTimePicker
				value={currentTemporaryDate || new Date()}
				mode={'date'}
				is24Hour={true}
				display={display}
				onChange={(event: DateTimePickerEvent, newValue?: Date) => {

					if(event.type === 'dismissed') {
						
						this.setState({ open: false });
						onBlur(undefined);
					}
					else if(event.type === 'set') {

						this.setState({ open: false });
						onSelectDate(newValue);
						onBlur(undefined);
					}
					else {

						this.setState({ currentTemporaryDate: newValue });
					}
				}}
			/>
		);
	}
}

/**
 * DatePickerComponent's input props
 */
export type DatePickerComponentInput = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentDate: Date | undefined;

	/**
	 * The input placeholder
	 */
	placeholder: string;

	/**
	 * If true, the icon and status underline are not displayed
	 */
	hideIconAndStatus?: boolean;
}

/**
 * DatePickerComponent's output props
 */
export type DatePickerComponentOutput = FormInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onSelectDate: (date: Date | undefined) => void;
}

/**
 * DatePickerComponent's props
 */
export type DatePickerComponentProps = DatePickerComponentInput & DatePickerComponentOutput;

/**
 * DatePickerComponent's state
 */
export type DatePickerComponentState = {

	/**
	 * If the modal is open
	 */
	open: boolean;

	/**
	 * The current unconfirmed value (used on iOS only at the moment)
	 */
	currentTemporaryDate: Date | undefined;
}
