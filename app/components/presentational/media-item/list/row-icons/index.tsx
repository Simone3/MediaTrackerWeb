import React, { Component, ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { styles } from 'app/components/presentational/media-item/list/row-icons/styles';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { images } from 'app/utilities/images';
import { config } from 'app/config/config';
import { AppError } from 'app/data/models/internal/error';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

/**
 * Presentational component to display the set of secondary icons portion of the list row
 */
export class MediaItemRowIconsComponent extends Component<MediaItemRowIconsComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			mediaItem,
			showOptionsMenu
		} = this.props;

		const colors = this.getStatusIconsColors(mediaItem);
		const colorsStyle = {
			backgroundColor: colors.background,
			borderColor: colors.border
		};

		return (
			<View style={styles.iconsContainer}>
				<View style={[ styles.statusCircle, colorsStyle ]}>
					<ImageComponent
						style={styles.statusIcon}
						source={images.mediaItemStatus(mediaItem)}
						tintColor={colors.icon}
					/>
				</View>
				<TouchableOpacity
					style={styles.optionsContainer}
					onPress={showOptionsMenu}>
					<ImageComponent
						style={styles.optionsIcon}
						source={images.menuButton()}
						tintColor={config.ui.colors.black}
					/>
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 * Helper to define the icon colors
	 * @param mediaItem the media item
	 * @returns the icon colors
	 */
	private getStatusIconsColors(mediaItem: MediaItemInternal): IconColors {

		switch(mediaItem.status) {

			case 'ACTIVE':

				if(mediaItem.mediaType === 'TV_SHOW') {

					const tvShow = mediaItem as TvShowInternal;
					if(mediaItemUtils.getTvShowCounters(tvShow.seasons).episodesToWatchNumber <= 0) {
	
						return {
							icon: config.ui.colors.white,
							background: config.ui.colors.lightGrey,
							border: config.ui.colors.lightGrey
						};
					}
				}

				return {
					icon: config.ui.colors.white,
					background: config.ui.colors.green,
					border: config.ui.colors.green
				};

			case 'UPCOMING':
			
				return {
					icon: config.ui.colors.white,
					background: config.ui.colors.orange,
					border: config.ui.colors.orange
				};
			
			case 'REDO':

				return {
					icon: config.ui.colors.white,
					background: config.ui.colors.cyan,
					border: config.ui.colors.cyan
				};
			
			case 'COMPLETE':

				return {
					icon: config.ui.colors.white,
					background: config.ui.colors.purple,
					border: config.ui.colors.purple
				};

			case 'NEW':

				return {
					icon: config.ui.colors.black,
					background: config.ui.colors.white,
					border: config.ui.colors.black
				};
			
			default:
				
				throw AppError.GENERIC.withDetails(`Status ${mediaItem.status} not recognized for media item status icon colors`);
		}
	}
}

/**
 * Helper type
 */
type IconColors = {
	icon: string;
	background: string;
	border: string;
}

/**
 * MediaItemRowIconsComponent's input props
 */
export type MediaItemRowIconsComponentInput = {
	
	/**
	 * The media item to be displayed
	 */
	mediaItem: MediaItemInternal;

	/**
	 * Callback to open the options context menu (with e.g. the edit button)
	 */
	showOptionsMenu: () => void;
};

