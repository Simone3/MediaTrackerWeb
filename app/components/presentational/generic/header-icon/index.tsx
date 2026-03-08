import { styles } from 'app/components/presentational/generic/header-icon/styles';
import React, { Component, ReactNode } from 'react';
import { TouchableOpacity, ImageRequireSource } from 'react-native';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { config } from 'app/config/config';

/**
 * Presentational component to display an header icon, optionally clickable
 */
export class HeaderIconComponent extends Component<HeaderIconComponentInput & HeaderIconComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			source,
			clickStatus,
			onClick,
			tintColor
		} = this.props;

		const iconColor = tintColor ? tintColor : config.ui.colors.colorContrastText;

		if(clickStatus === 'NOT_CLICKABLE') {

			return (
				<ImageComponent
					source={source}
					tintColor={iconColor}
					style={styles.icon}
				/>
			);
		}
		else {

			const iconClickEnabled = clickStatus === 'ENABLED';

			return (
				<TouchableOpacity
					style={styles.container}
					onPress={onClick}
					disabled={!iconClickEnabled}>
					<ImageComponent
						source={source}
						tintColor={iconColor}
						style={iconClickEnabled ? styles.icon : [ styles.icon, styles.iconDisabled ]}
					/>
				</TouchableOpacity>
			);
		}
	}
}

/**
 * HeaderIconComponent's input props
 */
export type HeaderIconComponentInput = {

	/**
	 * The icon source
	 */
	source: ImageRequireSource;

	/**
	 * The icon color
	 */
	tintColor?: string;

	/**
	 * The icon clickable status
	 */
	clickStatus: 'NOT_CLICKABLE' | 'ENABLED' | 'DISABLED';
}

/**
 * HeaderIconComponent's output props
 */
export type HeaderIconComponentOutput = {

	/**
	 * The icon click callback, called only if clickable and enabled
	 */
	onClick?: () => void;
}
