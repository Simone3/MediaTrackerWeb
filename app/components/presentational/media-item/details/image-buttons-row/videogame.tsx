import React, { Component, ReactNode } from 'react';
import { CommonMediaItemImageButtonsRowComponent, MediaItemActionButton } from 'app/components/presentational/media-item/details/image-buttons-row/media-item';
import { MediaItemImageButtonsRowComponentProps } from 'app/components/presentational/media-item/details/image-buttons-row';
import { images } from 'app/utilities/images';
import { i18n } from 'app/utilities/i18n';
import { Linking } from 'react-native';
import { config } from 'app/config/config';

/**
 * Presentational component to display the image with the action buttons for a book
 */
export class VideogameImageButtonsRowComponent extends Component<MediaItemImageButtonsRowComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
	
		return (
			<CommonMediaItemImageButtonsRowComponent
				{...this.props}
				specificButtons = {[
					this.getHowLongToBeatButton()
				]}
			/>
		);
	}

	/**
	 * Defines the Just Watch button
	 * @returns the button specification
	 */
	private getHowLongToBeatButton(): MediaItemActionButton {

		const {
			mediaItem
		} = this.props;

		return {
			icon: images.howLongToBeatIcon(),
			label: i18n.t(`mediaItem.details.buttons.howLongToBeat`),
			disabled: !mediaItem.name,
			onClick: this.onHowLongToBeatClick.bind(this)
		};
	}

	/**
	 * Callback for Just Watch icon click
	 * @param closeModal callback to close the "show more" modal
	 */
	private onHowLongToBeatClick(closeModal: () => void): void {

		const search = encodeURIComponent(this.props.mediaItem.name);
		Linking.openURL(config.external.howLongToBeatSearch(search));
		closeModal();
	}
}
