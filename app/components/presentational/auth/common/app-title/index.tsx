import { styles } from 'app/components/presentational/auth/common/app-title/styles';
import React, { ReactNode, Component } from 'react';
import { View, Image, Text, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { images } from 'app/utilities/images';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the app title with the app logo
 */
export class AppTitleComponent extends Component<AppTitleComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View
				{...this.props}
				style={StyleSheet.compose<ViewStyle, ViewStyle, ViewStyle>(styles.container, this.props.style)}>
				<View style={styles.logoContainer}>
					<Image
						source={images.appLogo()}
						style={styles.logo}
					/>
				</View>
				<View style={styles.titleContainer}>
					<Text style={styles.title}>
						{i18n.t('common.app.name')}
					</Text>
				</View>
			</View>
		);
	}
}

/**
 * AppTitleComponent's props
 */
export type AppTitleComponentProps = ViewProps;
