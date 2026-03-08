import React, { Component, ReactNode } from 'react';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { styles } from 'app/components/presentational/generic/selection-row/styles';
import { RadioButtonComponent } from 'app/components/presentational/form/components/radio';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { images } from 'app/utilities/images';
import { config } from 'app/config/config';

/**
 * Presentational component to display a generic selection row, i.e. a clickable label with optional radio button and context menu
 */
export class SelectionRowComponent extends Component<SelectionRowComponentInput & SelectionRowComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			select,
			openOptionsMenu,
			enabled
		} = this.props;
		
		return (
			<TouchableWithoutFeedback
				disabled={!enabled}
				onPress={select}
				onLongPress={openOptionsMenu}>
				<View style={styles.container}>
					{this.renderRadioButton()}
					{this.renderLabel()}
					{this.renderContextButton()}
				</View>
			</TouchableWithoutFeedback>
		);
	}

	/**
	 * Renders the radio button
	 * @returns the component
	 */
	private renderRadioButton(): ReactNode {

		const {
			selected,
			showRadioButton
		} = this.props;

		if(showRadioButton) {

			return (
				<RadioButtonComponent
					selected={selected}
					onSelect={() => {
						/* Do nothing here */
					}}
				/>
			);
		}
		else {

			return null;
		}
	}

	/**
	 * Renders the row label
	 * @returns the component
	 */
	private renderLabel(): ReactNode {

		const {
			label
		} = this.props;

		return (
			<View style={styles.nameContainer}>
				<Text style={styles.name} numberOfLines={1}>
					{label}
				</Text>
			</View>
		);
	}

	/**
	 * Renders the context menu button
	 * @returns the component
	 */
	private renderContextButton(): ReactNode {

		const {
			openOptionsMenu
		} = this.props;

		if(openOptionsMenu) {

			return (
				<TouchableOpacity
					style={styles.contextButtonContainer}
					onPress={openOptionsMenu}>
					<ImageComponent
						style={styles.contextButton}
						source={images.menuButton()}
						tintColor={config.ui.colors.black}
					/>
				</TouchableOpacity>
			);
		}
		else {

			return (
				<View style={styles.contextButtonContainer}>
					<View style={styles.contextButton} />
				</View>
			);
		}
	}
}

/**
 * SelectionRowComponent's input props
 */
export type SelectionRowComponentInput = {

	/**
	 * The label to be displayed
	 */
	label: string;

	/**
	 * If the row is the currently selected one
	 */
	selected: boolean;

	/**
	 * If the row is the currently enabled
	 */
	enabled: boolean;

	/**
	 * If true, the row will show a radio button
	 */
	showRadioButton?: boolean;
};

/**
 * SelectionRowComponent's output props
 */
export type SelectionRowComponentOutput = {

	/**
	 * Callback to select the row
	 */
	select: () => void;

	/**
	 * Callback to open the options context menu.
	 * Undefined means that no context menu will be shown.
	 */
	openOptionsMenu?: () => void;
};

