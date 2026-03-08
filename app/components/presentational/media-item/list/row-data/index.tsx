import React, { Component, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { styles } from 'app/components/presentational/media-item/list/row-data/styles';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { i18n } from 'app/utilities/i18n';
import { mediaItemDefinitionsControllerFactory } from 'app/factories/controller-factories';
import { config } from 'app/config/config';
import { format } from 'date-fns';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Presentational component to display the textual data portion of the list row
 */
export class MediaItemRowDataComponent extends Component<MediaItemRowDataComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			mediaItem
		} = this.props;

		const movie: MovieInternal = mediaItem as MovieInternal;

		return (
			<View style={styles.dataContainer}>
				{this.renderFirstRow(movie)}
				{this.renderSecondRow(movie)}
				{this.renderThirdRow(movie)}
				{this.renderFourthRow(movie)}
			</View>
		);
	}

	/**
	 * Renders the first row
	 * @param mediaItem the media item
	 * @returns the component
	 */
	private renderFirstRow(mediaItem: MediaItemInternal): ReactNode {

		return (
			<Text
				style={styles.firstRow}
				numberOfLines={1}>
				{mediaItem.name}
			</Text>
		);
	}

	/**
	 * Renders the second row
	 * @param mediaItem the media item
	 * @returns the component
	 */
	private renderSecondRow(mediaItem: MediaItemInternal): ReactNode {

		const mediaType = mediaItem.mediaType;

		const definitionsController = mediaItemDefinitionsControllerFactory.get(mediaType);
		const duration = definitionsController.getDurationValue(mediaItem);
		const creators = definitionsController.getCreatorNames(mediaItem);

		const values: string[] = [];

		if(mediaItem.releaseDate) {

			values.push(String(mediaItem.releaseDate.getFullYear()));
		}

		if(duration) {

			values.push(i18n.t(`mediaItem.list.duration.${mediaType}`, { duration: duration }));
		}

		if(mediaItem.mediaType === 'TV_SHOW') {

			const tvShow = mediaItem as TvShowInternal;

			if(tvShow.inProduction) {

				values.push(i18n.t(`mediaItem.list.production`));
			}
		}

		if(creators && creators.length > 0) {

			values.push(creators.join(', '));
		}

		if(values.length > 0) {

			return (
				<Text
					style={styles.secondRow}
					numberOfLines={1}>
					{values.join(' • ')}
				</Text>
			);
		}
		else {
			
			return null;
		}
	}

	/**
	 * Renders the third row
	 * @param mediaItem the media item
	 * @returns the component
	 */
	private renderThirdRow(mediaItem: MediaItemInternal): ReactNode {

		const values: string[] = [];

		if(mediaItem.status === 'COMPLETE') {

			const completionDates = mediaItem.completedOn;

			if(completionDates && completionDates.length > 0) {

				const lastCompletionDate = format(completionDates[completionDates.length - 1], config.ui.dateFormat);

				if(completionDates.length === 1) {

					values.push(i18n.t(`mediaItem.list.completed.single`, { date: lastCompletionDate }));
				}
				else {

					values.push(i18n.t(`mediaItem.list.completed.multiple`, { times: completionDates.length, date: lastCompletionDate }));
				}
			}
		}
		else if(mediaItem.genres && mediaItem.genres.length > 0) {

			values.push(mediaItem.genres.join(', '));
		}

		if(values.length > 0) {

			return (
				<Text
					style={styles.thirdRow}
					numberOfLines={1}>
					{values.join(' • ')}
				</Text>
			);
		}
		else {
			
			return null;
		}
	}

	/**
	 * Renders the fourth row
	 * @param mediaItem the media item
	 * @returns the component
	 */
	private renderFourthRow(mediaItem: MediaItemInternal): ReactNode {

		if(mediaItem.group && mediaItem.orderInGroup) {

			return (
				<Text
					style={styles.fourthRow}
					numberOfLines={1}>
					{i18n.t(`mediaItem.list.group`, { order: mediaItem.orderInGroup, groupName: mediaItem.group.name })}
				</Text>
			);
		}
		else {
			
			return null;
		}
	}
}

/**
 * MediaItemRowDataComponent's input props
 */
export type MediaItemRowDataComponentInput = {
	
	/**
	 * The media item to be displayed
	 */
	mediaItem: MediaItemInternal;
};
