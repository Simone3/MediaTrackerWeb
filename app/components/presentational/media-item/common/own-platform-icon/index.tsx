import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from 'app/components/presentational/media-item/common/own-platform-icon/styles';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { images } from 'app/utilities/images';
import { config } from 'app/config/config';

/**
 * Presentational component to display an icon for the media item own platform
 */
export class MediaItemOwnPlatformIconComponent extends Component<MediaItemOwnPlatformIconComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			ownPlatform
		} = this.props;

		if(ownPlatform) {
		
			return (
				<View style={styles.container}>
					<ImageComponent
						style={styles.icon}
						source={images.ownPlatform(ownPlatform.icon)}
						tintColor={ownPlatform.color}
					/>
				</View>
			);
		}
		else {

			return (
				<View style={styles.container}>
					<ImageComponent
						style={styles.icon}
						source={images.none()}
						tintColor={config.ui.colors.grey}
					/>
				</View>
			);
		}
	}
}

/**
 * MediaItemOwnPlatformIconComponent's input props
 */
export type MediaItemOwnPlatformIconComponentInput = {

	/**
	 * The platform to be displayed. If undefined, a default platform (none) is displayed
	 */
	ownPlatform?: OwnPlatformInternal;
};

