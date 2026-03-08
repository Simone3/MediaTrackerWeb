import React, { Component, ReactNode } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { styles } from 'app/components/presentational/media-item/list/row/styles';
import { MediaItemOwnPlatformIconComponent } from 'app/components/presentational/media-item/common/own-platform-icon';
import { MediaItemRowDataComponent } from 'app/components/presentational/media-item/list/row-data';
import { MediaItemRowIconsComponent } from 'app/components/presentational/media-item/list/row-icons';

/**
 * Presentational component to display a media item row
 */
export class MediaItemRowComponent extends Component<MediaItemRowComponentInput & MediaItemRowComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			showOptionsMenu,
			mediaItem,
			open
		} = this.props;

		return (
			<TouchableWithoutFeedback
				onPress={open}
				onLongPress={showOptionsMenu}>
				<View style={styles.container}>
					<View style={styles.primaryIconContainer}>
						<MediaItemOwnPlatformIconComponent ownPlatform={mediaItem.ownPlatform} />
					</View>
					<View style={styles.dataContainer}>
						<MediaItemRowDataComponent mediaItem={mediaItem} />
					</View>
					<View style={styles.secondaryIconsContainer}>
						<MediaItemRowIconsComponent mediaItem={mediaItem} showOptionsMenu={showOptionsMenu} />
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

/**
 * MediaItemRowComponent's input props
 */
export type MediaItemRowComponentInput = {
	
	/**
	 * The media item to be displayed
	 */
	mediaItem: MediaItemInternal;
};

/**
 * MediaItemRowComponent's output props
 */
export type MediaItemRowComponentOutput = {

	/**
	 * Callback to open the media item details
	 */
	open: () => void;

	/**
	 * Callback to open the options context menu (with e.g. the edit button)
	 */
	showOptionsMenu: () => void;
};

