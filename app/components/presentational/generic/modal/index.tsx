import { styles } from 'app/components/presentational/generic/modal/styles';
import React, { Component, ReactNode } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback, StyleProp, ViewStyle, StyleSheet } from 'react-native';

/**
 * Presentational component to display a modal dialog
 */
export class ModalComponent extends Component<ModalComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			onClose,
			visible,
			children,
			transparentBackground,
			modalContainerStyle
		} = this.props;

		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={visible}
				onRequestClose={() => {
					if(onClose) {
						onClose();
					}
				}}>
				<TouchableOpacity
					style={StyleSheet.compose<ViewStyle, ViewStyle, ViewStyle>(StyleSheet.compose<ViewStyle, ViewStyle, ViewStyle>(styles.container, transparentBackground ? null : styles.containerGrayed), this.getContainerPositionStyle())}
					activeOpacity={1}
					onPressOut={() => {
						if(onClose) {
							onClose();
						}
					}}>
					<TouchableWithoutFeedback>
						<View style={[ styles.contentContainer, modalContainerStyle ] }>
							{children}
						</View>
					</TouchableWithoutFeedback>
				</TouchableOpacity>
			</Modal>
		);
	}

	/**
	 * Helper to get the style for the modal position
	 * @returns the view style
	 */
	private getContainerPositionStyle(): StyleProp<ViewStyle> {

		const hp = this.props.horizontalPosition;
		const vp = this.props.verticalPosition;
		
		let alignItems: 'center' | 'flex-start' | 'flex-end';
		if(!hp || hp === 'center') {
			alignItems = 'center';
		}
		else if(hp === 'left') {
			alignItems = 'flex-start';
		}
		else {
			alignItems = 'flex-end';
		}

		let justifyContent: 'center' | 'flex-start' | 'flex-end';
		if(!vp || vp === 'center') {
			justifyContent = 'center';
		}
		else if(vp === 'top') {
			justifyContent = 'flex-start';
		}
		else {
			justifyContent = 'flex-end';
		}

		return {
			alignItems: alignItems,
			justifyContent: justifyContent
		};
	}
}

/**
 * ModalComponent's input props
 */
export type ModalComponentInput = {

	/**
	 * Child components are the contents of the modal
	 */
	children?: React.ReactNode;

	/**
	 * Modal dialog visibility
	 */
	visible: boolean;

	/**
	 * Horizontal position of the modal
	 */
	horizontalPosition?: 'center' | 'left' | 'right';

	/**
	 * Vertical position of the modal
	 */
	verticalPosition?: 'center' | 'top' | 'bottom';

	/**
	 * Extra styles for the modal container
	 */
	modalContainerStyle?: ViewStyle;

	/**
	 * Whether the area outside the modal should be transparent or the default grayed-out
	 */
	transparentBackground?: boolean;
}

/**
 * ModalComponent's output props
 */
export type ModalComponentOutput = {

	/**
	 * Called when the modal requests itself to be closed, e.g. when the user clicks outside the content.
	 * It's up to the parents to decide whether to trigger the visibility change or not (via "visible" prop).
	 */
	onClose?: () => void;
}

/**
 * ModalComponent's props
 */
export type ModalComponentProps = ModalComponentInput & ModalComponentOutput;
