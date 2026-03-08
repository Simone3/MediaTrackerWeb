import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { TvShowSeasonsListContainer } from 'app/components/containers/tv-show-season/list/list';
import { styles } from 'app/components/presentational/tv-show-season/list/screen/styles';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { TvShowSeasonContextMenuContainer } from 'app/components/containers/tv-show-season/list/context-menu';

/**
 * Presentational component that contains the whole "TV show seasons list" screen, that lists all seasons of a TV show
 */
export class TvShowSeasonsListScreenComponent extends Component<TvShowSeasonsListScreenComponentInput & TvShowSeasonsListScreenComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<View style={styles.container}>
				<TvShowSeasonsListContainer />
				<TvShowSeasonContextMenuContainer />
				<FABComponent
					text={'+'}
					onPress={() => {
						this.props.loadNewTvShowSeasonDetails();
					}}
				/>
			</View>
		);
	}
}

/**
 * TvShowSeasonsListScreenComponent's input props
 */
export type TvShowSeasonsListScreenComponentInput = {
	
}

/**
 * TvShowSeasonsListScreenComponent's output props
 */
export type TvShowSeasonsListScreenComponentOutput = {

	/**
	 * Callback to load the details of a new season
	 */
	loadNewTvShowSeasonDetails: () => void;
}
