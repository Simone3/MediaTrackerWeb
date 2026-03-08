import React, { Component, ReactNode } from 'react';
import { CommonMediaItemImageButtonsRowComponent } from 'app/components/presentational/media-item/details/image-buttons-row/media-item';
import { MediaItemImageButtonsRowComponentProps } from 'app/components/presentational/media-item/details/image-buttons-row';

/**
 * Presentational component to display the image with the action buttons for a book
 */
export class BookImageButtonsRowComponent extends Component<MediaItemImageButtonsRowComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
	
		return (
			<CommonMediaItemImageButtonsRowComponent {...this.props} />
		);
	}
}
