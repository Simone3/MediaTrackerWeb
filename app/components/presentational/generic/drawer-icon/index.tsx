import { styles } from 'app/components/presentational/generic/drawer-icon/styles';
import React, { Component, ReactNode } from 'react';
import { ImageRequireSource } from 'react-native';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { config } from 'app/config/config';

/**
 * Presentational component to display a drawer icon (icon displayed next to each drawer item)
 */
export class DrawerIconComponent extends Component<DrawerIconComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			source,
			color
		} = this.props;

		const iconColor = color ? color : config.ui.colors.black;

		return (
			<ImageComponent
				source={source}
				tintColor={iconColor}
				style={styles.icon}
			/>
		);
	}
}

/**
 * React Navigation Drawer Icon props
 */
export type DrawerIconProps = {
	color: string;
};

/**
 * DrawerIconComponent's props
 */
export type DrawerIconComponentProps = DrawerIconProps & {

	/**
	 * The icon source
	 */
	source: ImageRequireSource;
}

/**
 * Helper to build the component callback used in the drawer settings
 * @param source the image source
 * @returns the callback to pass to the drawer settings
 */
export const drawerIconBuilder = (source: ImageRequireSource) => {
	
	// eslint-disable-next-line react/display-name
	return (props: DrawerIconProps): ReactNode => {

		return <DrawerIconComponent {...props} source={source} />;
	};
};
