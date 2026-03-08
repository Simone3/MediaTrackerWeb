import React, { Component, ReactElement, ReactNode } from 'react';
import { FlatList, Text, View, Dimensions, RefreshControl } from 'react-native';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaItemRowComponent } from 'app/components/presentational/media-item/list/row';
import { i18n } from 'app/utilities/i18n';
import { styles } from 'app/components/presentational/media-item/list/list/styles';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemContextMenuContainer } from 'app/components/containers/media-item/list/context-menu';
import { config } from 'app/config/config';

/**
 * Presentational component to display the list of user media items
 */
export class MediaItemsListComponent extends Component<MediaItemsListComponentInput & MediaItemsListComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View>
				{this.renderMediaItems()}
			</View>
		);
	}

	/**
	 * Helper method to render the main list
	 * @returns the node portion
	 */
	private renderMediaItems(): ReactNode {

		return this.renderList();
	}

	/**
	 * Helper method to render the no media items message
	 * @returns the node portion
	 */
	private renderNone(): ReactElement {

		return <Text style={styles.emptyMessage}>{i18n.t(`mediaItem.list.empty.${this.props.category.mediaType}`)}</Text>;
	}

	/**
	 * Helper method to render media items list
	 * @returns the node portion
	 */
	private renderList(): ReactNode {

		const {
			mediaItems,
			highlightMediaItem,
			selectMediaItem,
			refreshMediaItems
		} = this.props;

		return (
			<View>
				<FlatList
					style={[ styles.list, { width: Dimensions.get('window').width }]}
					contentContainerStyle={styles.listContentContainer}
					data={mediaItems}
					refreshControl={
						<RefreshControl
							refreshing={false}
							onRefresh={refreshMediaItems}
							colors={[ config.ui.colors.colorPrimaryDark ]}
							tintColor={config.ui.colors.colorPrimaryDark}
						/>
					}
					ListEmptyComponent={this.renderNone()}
					renderItem={({ item }) => {
						return (
							<MediaItemRowComponent
								mediaItem={item}
								open={() => {
									selectMediaItem(item);
								}}
								showOptionsMenu={() => {
									highlightMediaItem(item);
								}}
							/>
						);
					}}
					keyExtractor={(item) => {
						return item.id;
					}}
				/>
				<MediaItemContextMenuContainer />
			</View>
		);
	}
}

/**
 * MediaItemsListComponent's input props
 */
export type MediaItemsListComponentInput = {

	/**
	 * The linked category
	 */
	category: CategoryInternal;

	/**
	 * The media items list to be displayed
	 */
	mediaItems: MediaItemInternal[];
}

/**
 * MediaItemsListComponent's output props
 */
export type MediaItemsListComponentOutput = {

	/**
	 * Callback to select a media item, e.g. to open its details
	 */
	selectMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to set a mediaItem as highlighted, e.g. to open its dialog menu
	 */
	highlightMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to refresh the media items list
	 */
	refreshMediaItems: () => void;
}
