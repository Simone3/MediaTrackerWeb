import React, { Component, ReactNode } from 'react';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { CategoryInternal } from 'app/data/models/internal/category';
import { styles } from 'app/components/presentational/category/list/row/styles';
import { MediaIconComponent } from 'app/components/presentational/category/common/media-icon';
import { config } from 'app/config/config';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a generic category row
 */
export class CategoryRowComponent extends Component<CategoryRowComponentInput & CategoryRowComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			category,
			open,
			showOptionsMenu
		} = this.props;
		
		return (
			<TouchableWithoutFeedback
				onPress={open}
				onLongPress={showOptionsMenu}>
				<View style={[ styles.container, { backgroundColor: category.color }]}>
					<View style={styles.iconContainer}>
						<MediaIconComponent
							category={category}
							tintColor={config.ui.colors.colorContrastText}
							style={styles.icon}
							resizeMode='center'
						/>
					</View>
					<View style={styles.nameContainer}>
						<Text style={styles.name} numberOfLines={1}>
							{category.name}
						</Text>
					</View>
					<TouchableOpacity
						style={styles.contextButtonContainer}
						onPress={showOptionsMenu}>
						<ImageComponent
							style={styles.contextButton}
							source={images.menuButton()}
							tintColor={config.ui.colors.colorContrastText}
						/>
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

/**
 * CategoryRowComponent's input props
 */
export type CategoryRowComponentInput = {

	/**
	 * The category to be displayed
	 */
	category: CategoryInternal;
};

/**
 * CategoryRowComponent's output props
 */
export type CategoryRowComponentOutput = {

	/**
	 * Callback to open the list of the category media items
	 */
	open: () => void;

	/**
	 * Callback to open the options context menu (with e.g. the edit button)
	 */
	showOptionsMenu: () => void;
};

