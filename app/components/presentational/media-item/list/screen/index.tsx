import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { MediaItemsListContainer } from 'app/components/containers/media-item/list/list';
import { styles } from 'app/components/presentational/media-item/list/screen/styles';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { MediaItemFilterModalContainer } from 'app/components/containers/media-item/list/filter-modal';
import { CategoryInternal } from 'app/data/models/internal/category';

/**
 * Presentational component that contains the whole "media items list" screen, that lists all media items of the current category
 */
export class MediaItemsListScreenComponent extends Component<MediaItemsListScreenComponentInput & MediaItemsListScreenComponentOutput> {

	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			category,
			loadNewMediaItemDetails,
			isLoading
		} = this.props;

		return (
			<View style={styles.container}>
				<MediaItemsListContainer/>
				<FABComponent
					text={'+'}
					onPress={() => {
						loadNewMediaItemDetails(category);
					}}
				/>
				<MediaItemFilterModalContainer />
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
			</View>
		);
	}

	/**
	 * Helper to invoke the fetch callback if the input fetch flag is true
	 */
	private requestFetchIfRequired(): void {
		
		if(this.props.requiresFetch) {

			this.props.fetchMediaItems();
		}
	}
}

/**
 * MediaItemsListScreenComponent's input props
 */
export type MediaItemsListScreenComponentInput = {
	
	/**
	 * The category linked with this media items list
	 */
	category: CategoryInternal;

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the categories list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;
}

/**
 * MediaItemsListScreenComponent's output props
 */
export type MediaItemsListScreenComponentOutput = {

	/**
	 * Callback to request the media items list (re)load
	 */
	fetchMediaItems: () => void;

	/**
	 * Callback to load the details of a new media item for the given category
	 */
	loadNewMediaItemDetails: (category: CategoryInternal) => void;
}
