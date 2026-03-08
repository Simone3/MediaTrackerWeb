import { styles } from 'app/components/presentational/generic/buttons-list/styles';
import React, { Component, ReactNode } from 'react';
import { View, ImageRequireSource, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { HrComponent } from 'app/components/presentational/generic/hr';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { config } from 'app/config/config';

/**
 * Presentational component to display a title and a list of buttons with icons
 */
export class ButtonsListComponent extends Component<ButtonsListComponentInput & ButtonsListComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			buttons,
			title,
			titleIcon
		} = this.props;

		return (
			<View style={[ styles.container, { width: Dimensions.get('window').width }]}>
				<View style={styles.titleSectionContainer}>
					{this.renderRow(title, titleIcon, config.ui.colors.colorModalContent, false)}
				</View>
				<HrComponent/>
				<FlatList
					style={styles.list}
					data={buttons}
					renderItem={({ item }) => {
						return (
							<TouchableOpacity onPress={item.onClick} disabled={item.disabled}>
								{this.renderRow(item.label, item.icon, item.iconTintColor, item.disabled)}
							</TouchableOpacity>
						);
					}}
					keyExtractor={(item) => {
						return item.label;
					}}
				/>
			</View>
		);
	}

	/**
	 * Helper to render a row
	 * @param label the text label
	 * @param icon the icon
	 * @param iconTintColor the icon tint color
	 * @param disabled the disabled status
	 * @returns the rendered component
	 */
	private renderRow(label: string, icon: ImageRequireSource, iconTintColor: string | undefined, disabled: boolean | undefined): ReactNode {

		return (
			<View style={styles.rowContainer}>
				<View style={styles.rowIconContainer}>
					<ImageComponent
						source={icon}
						tintColor={iconTintColor}
						style={disabled ? [ styles.rowIcon, styles.rowIconDisabled ] : styles.rowIcon }
						resizeMode='center'
					/>
				</View>
				<View style={styles.rowLabelContainer}>
					<Text
						style={disabled ? [ styles.rowLabel, styles.rowLabelDisabled ] : styles.rowLabel }
						numberOfLines={1}>
						{label}
					</Text>
				</View>
			</View>
		);
	}
}

/**
 * ButtonsListComponent's input props
 */
export type ButtonsListComponentInput = {

	/**
	 * Modal title label
	 */
	title: string;

	/**
	 * Modal title icon
	 */
	titleIcon: ImageRequireSource;

	/**
	 * The list of buttons descriptors to display
	 */
	buttons: ButtonsListComponentButton[];
}

/**
 * ButtonsListComponent's output props
 */
export type ButtonsListComponentOutput = {

}

/**
 * ButtonsListComponent's button descriptor
 */
export type ButtonsListComponentButton = {

	/**
	 * Button label
	 */
	label: string;

	/**
	 * Button icon
	 */
	icon: ImageRequireSource;

	/**
	 * Button icon tint color
	 */
	iconTintColor?: string;

	/**
	 * If the button is currently disabled
	 */
	disabled?: boolean;

	/**
	 * Button click callback
	 */
	onClick: () => void;
}
