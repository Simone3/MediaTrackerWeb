import React, { Component, ReactElement, ReactNode } from 'react';
import { FlatList, Text, View } from 'react-native';
import { styles } from 'app/components/presentational/tv-show-season/list/list/styles';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';
import { TvShowSeasonsRowComponent } from 'app/components/presentational/tv-show-season/list/row';

/**
 * Presentational component to display the list of TV show seasons
 */
export class TvShowSeasonsListComponent extends Component<TvShowSeasonsListComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {

		return this.renderList();
	}

	/**
	 * Helper method to render the no entities message
	 * @returns the node portion
	 */
	private renderEmptyList(): ReactElement {

		return <Text style={styles.emptyMessage}>{i18n.t('tvShowSeason.list.empty')}</Text>;
	}

	/**
	 * Helper method to render entities list
	 * @returns the node portion
	 */
	private renderList(): ReactNode {

		const {
			tvShowSeasons,
			selectTvShowSeason,
			highlightTvShowSeason
		} = this.props;

		return (
			<View style={styles.container}>
				<FlatList
					style={styles.list}
					contentContainerStyle={styles.listContentContainer}
					data={tvShowSeasons}
					ListEmptyComponent={this.renderEmptyList()}
					renderItem={({ item }) => {
						return (
							<TvShowSeasonsRowComponent
								tvShowSeason={item}
								open={() => {
									selectTvShowSeason(item);
								}}
								openOptionsMenu={() => {
									highlightTvShowSeason(item);
								}}
							/>
						);
					}}
					keyExtractor={(item) => {
						return String(item.number);
					}}
				/>
			</View>
		);
	}
}

/**
 * TvShowSeasonsListComponent's input props
 */
export type TvShowSeasonsListComponentInput = {

	/**
	 * The seasons list to be displayed
	 */
	tvShowSeasons: TvShowSeasonInternal[];
}

/**
 * TvShowSeasonsListComponent's output props
 */
export type TvShowSeasonsListComponentOutput = {

	/**
	 * Callback to select a season, e.g. to open its details
	 */
	selectTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback to set a season as highlighted, e.g. to open its dialog menu
	 */
	highlightTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;
}

/**
 * TvShowSeasonsListComponent's props
 */
export type TvShowSeasonsListComponentProps = TvShowSeasonsListComponentInput & TvShowSeasonsListComponentOutput;

