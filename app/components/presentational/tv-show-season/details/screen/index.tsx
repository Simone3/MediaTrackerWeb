import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { TvShowSeasonFormContainer } from 'app/components/containers/tv-show-season/details/form';
import { styles } from 'app/components/presentational/tv-show-season/details/screen/styles';

/**
 * Presentational component that contains the whole "TV show season details" screen, that works as the "add new TV show season", "update TV show season" and
 * "view TV show season data" sections
 */
export class TvShowSeasonDetailsScreenComponent extends Component<TvShowSeasonDetailsScreenComponentInput & TvShowSeasonDetailsScreenComponentOutput> {

	/**
	 * @override
	 */
	public render(): ReactNode {
	
		return (
			<View style={styles.container}>
				<TvShowSeasonFormContainer/>
			</View>
		);
	}
}

/**
 * TvShowSeasonDetailsScreenComponent's input props
 */
export type TvShowSeasonDetailsScreenComponentInput = {

}

/**
 * TvShowSeasonDetailsScreenComponent's output props
 */
export type TvShowSeasonDetailsScreenComponentOutput = {

}
