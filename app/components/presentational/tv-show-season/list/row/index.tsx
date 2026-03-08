import React, { Component, ReactNode } from 'react';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { styles } from 'app/components/presentational/tv-show-season/list/row/styles';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { images } from 'app/utilities/images';
import { config } from 'app/config/config';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display a TV show season row
 */
export class TvShowSeasonsRowComponent extends Component<TvShowSeasonsRowComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			open,
			openOptionsMenu
		} = this.props;
		
		return (
			<TouchableWithoutFeedback
				onPress={open}
				onLongPress={openOptionsMenu}>
				<View style={styles.container}>
					{this.renderLabel()}
					{this.renderContextButton()}
				</View>
			</TouchableWithoutFeedback>
		);
	}

	/**
	 * Renders the row label
	 * @returns the component
	 */
	private renderLabel(): ReactNode {

		const {
			tvShowSeason
		} = this.props;

		const seasonNumber = tvShowSeason.number;
		const episodesNumber = tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
		const watchedEpisodesNumber = tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;

		let labelStyle;
		if(watchedEpisodesNumber === episodesNumber) {

			labelStyle = styles.completedLabel;
		}
		else if(watchedEpisodesNumber < episodesNumber) {

			labelStyle = styles.normalLabel;
		}
		else {

			labelStyle = styles.invalidLabel;
		}

		return (
			<View style={styles.labelsContainer}>
				<Text style={[ styles.mainLabel, labelStyle ]} numberOfLines={1}>
					{i18n.t('tvShowSeason.list.row.main', {
						seasonNumber: seasonNumber
					})}
				</Text>
				<Text style={[ styles.secondaryLabel, labelStyle ]} numberOfLines={1}>
					{i18n.t('tvShowSeason.list.row.secondary', {
						episodesNumber: episodesNumber,
						watchedEpisodesNumber: watchedEpisodesNumber
					})}
				</Text>
			</View>
		);
	}

	/**
	 * Renders the context menu button
	 * @returns the component
	 */
	private renderContextButton(): ReactNode {

		const {
			openOptionsMenu
		} = this.props;

		return (
			<TouchableOpacity
				style={styles.contextButtonContainer}
				onPress={openOptionsMenu}>
				<ImageComponent
					style={styles.contextButton}
					source={images.menuButton()}
					tintColor={config.ui.colors.black}
				/>
			</TouchableOpacity>
		);
	}
}

/**
 * TvShowSeasonsRowComponent's input props
 */
export type TvShowSeasonsRowComponentInput = {

	tvShowSeason: TvShowSeasonInternal;
};

/**
 * TvShowSeasonsRowComponent's output props
 */
export type TvShowSeasonsRowComponentOutput = {

	/**
	 * Callback to open the season details
	 */
	open: () => void;

	/**
	 * Callback to open the options context menu
	 */
	openOptionsMenu: () => void;
};

/**
 * TvShowSeasonsRowComponent's props
 */
export type TvShowSeasonsRowComponentProps = TvShowSeasonsRowComponentInput & TvShowSeasonsRowComponentOutput;
