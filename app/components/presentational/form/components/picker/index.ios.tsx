import { styles } from 'app/components/presentational/form/components/picker/styles';
import React, { ReactNode, Component } from 'react';
import { CommonPickerComponent, PickerComponentProps } from 'app/components/presentational/form/components/picker/common';
import { FormInputComponent } from 'app/components/presentational/form/components/generic';
import { View, TouchableOpacity, Text } from 'react-native';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { ModalInputConfirmComponent } from 'app/components/presentational/form/helpers/modal-confirm';

/**
 * Presentational component to display a picker (iOS version)
 */
export class PickerComponent extends Component<PickerComponentProps> {
	
	public state: PickerComponentState = { open: false, currentTemporaryItem: '' };

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
			icon,
			items,
			currentItem,
			onFocus,
			disabled
		} = this.props;

		const selectedItem = items.find((item) => {
			return currentItem === item.value;
		});

		const displayedIcon = selectedItem && selectedItem.icon ? selectedItem.icon : icon;

		const displayedText = selectedItem ? selectedItem.label : '';

		return (
			<FormInputComponent {...this.props} icon={displayedIcon}>
				<TouchableOpacity
					style={styles.iosInputContainer}
					disabled={disabled}
					onPress={(event) => {
						
						this.setState({
							open: true,
							currentTemporaryItem: currentItem
						});
						onFocus(event);
					}}>
					<Text style={styles.iosInputText}>
						{displayedText}
					</Text>
					<View
						style={disabled ? [ styles.iosInputTriangle, styles.iosInputTriangleDisabled ] : [ styles.iosInputTriangle ] }
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
			onBlur,
			prompt
		} = this.props;

		const {
			currentTemporaryItem
		} = this.state;

		return (
			<ModalComponent
				visible={this.state.open}
				onClose={() => {
					onBlur(undefined);
					this.setState({ open: false });
				}}>
				<View style={styles.iosModalContent}>
					<Text style={styles.iosModalTitle}>{prompt}</Text>
					<CommonPickerComponent
						{...this.props}
						currentItem={currentTemporaryItem}
						onSelectItem={(item) => {
							this.setState({ currentTemporaryItem: item });
						}}/>
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
			currentTemporaryItem
		} = this.state;

		const {
			onSelectItem,
			onBlur
		} = this.props;

		return (
			<ModalInputConfirmComponent
				valid={true}
				onConfirm={(event) => {

					onSelectItem(currentTemporaryItem);
					onBlur(event);
					this.setState({ open: false });
				}}
			/>
		);
	}
}

/**
 * PickerComponent's state
 */
export type PickerComponentState = {

	/**
	 * If the modal is open
	 */
	open: boolean;

	/**
	 * Currently selected value in the modal, not yet confirmed
	 */
	currentTemporaryItem: string;
}
