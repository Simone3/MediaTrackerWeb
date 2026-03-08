import React, { Component, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { styles } from 'app/components/presentational/settings/section-title/styles';

/**
 * Presentational component to display a settings section title
 */
export class SettingsSectionTitleComponent extends Component<SettingsSectionTitleComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			title
		} = this.props;

		return (
			<View
				style={styles.container}>
				<Text style={styles.title}>
					{title}
				</Text>
			</View>
		);
	}
}

/**
 * SettingsSectionTitleComponent's input props
 */
export type SettingsSectionTitleComponentInput = {
	
	/**
	 * The setting title
	 */
	title: string;
};

/**
 * SettingsSectionTitleComponent's props
 */
export type SettingsSectionTitleComponentProps = SettingsSectionTitleComponentInput
