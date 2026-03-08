import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from 'app/components/presentational/media-item/details/screen/styles';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { MediaItemFormSwitcherContainer } from 'app/components/containers/media-item/details/form-container';

/**
 * Presentational component that contains the whole "media item details" screen, that works as the "add new media item", "update media item" and
 * "view media item data" sections
 */
export class MediaItemDetailsScreenComponent extends Component<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
	
		return (
			<View style={styles.container}>
				<MediaItemFormSwitcherContainer />
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
					fullScreen={false}
				/>
			</View>
		);
	}
}

/**
 * MediaItemDetailsScreenComponent's input props
 */
export type MediaItemDetailsScreenComponentInput = {

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;
}

/**
 * MediaItemDetailsScreenComponent's output props
 */
export type MediaItemDetailsScreenComponentOutput = {

}
