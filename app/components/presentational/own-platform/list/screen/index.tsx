import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { OwnPlatformsListContainer } from 'app/components/containers/own-platform/list/list';
import { styles } from 'app/components/presentational/own-platform/list/screen/styles';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { i18n } from 'app/utilities/i18n';
import { OwnPlatformContextMenuContainer } from 'app/components/containers/own-platform/list/context-menu';

/**
 * Presentational component that contains the whole "ownPlatforms list" screen, that lists all user ownPlatforms
 */
export class OwnPlatformsListScreenComponent extends Component<OwnPlatformsListScreenComponentInput & OwnPlatformsListScreenComponentOutput> {
	
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
		
		return (
			<View style={styles.container}>
				<OwnPlatformsListContainer
					noneLabel={i18n.t('ownPlatform.list.none')}
					emptyLabel={i18n.t('ownPlatform.list.empty')}
					showRadioButtons={true}
				/>
				<OwnPlatformContextMenuContainer />
				<FABComponent
					text={'+'}
					onPress={() => {
						this.props.loadNewOwnPlatformDetails();
					}}
				/>
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
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

			this.props.fetchOwnPlatforms();
		}
	}
}

/**
 * OwnPlatformsListScreenComponent's input props
 */
export type OwnPlatformsListScreenComponentInput = {
	
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the ownPlatforms list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;
}

/**
 * OwnPlatformsListScreenComponent's output props
 */
export type OwnPlatformsListScreenComponentOutput = {

	/**
	 * Callback to request the ownPlatforms list (re)load
	 */
	fetchOwnPlatforms: () => void;

	/**
	 * Callback to load the details of a new ownPlatform
	 */
	loadNewOwnPlatformDetails: () => void;
}
