import React, { Component, ReactNode } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from 'app/components/presentational/settings/row-clickable/styles';

/**
 * Presentational component to display a clickable settings row
 */
export class ClickableSettingsRowComponent extends Component<ClickableSettingsRowComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			title,
			subtitle,
			separator,
			onPress
		} = this.props;

		return (
			<TouchableOpacity
				onPress={onPress}
				style={separator ? [ styles.container, styles.containerSeparator ] : styles.container}>
				<View>
					<Text style={styles.title}>
						{title}
					</Text>
				</View>
				{subtitle ?
					(
						<View>
							<Text style={styles.subtitle}>
								{subtitle}
							</Text>
						</View>
					) :
					null}
			</TouchableOpacity>
		);
	}
}

/**
 * ClickableSettingsRowComponent's input props
 */
export type ClickableSettingsRowComponentInput = {
	
	/**
	 * The setting title
	 */
	title: string;

	/**
	 * The setting description
	 */
	subtitle?: string;

	/**
	 * If a separator below the row should be displayed
	 */
	separator?: boolean;
};

/**
 * ClickableSettingsRowComponent's output props
 */
export type ClickableSettingsRowComponentOutput = {

	/**
	 * Callback for the user click
	 */
	onPress: () => void;
};

/**
 * ClickableSettingsRowComponent's props
 */
export type ClickableSettingsRowComponentProps = ClickableSettingsRowComponentInput & ClickableSettingsRowComponentOutput
