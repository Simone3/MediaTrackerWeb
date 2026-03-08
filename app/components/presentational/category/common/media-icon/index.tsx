import React, { Component, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { ImageComponent, ImageComponentInput } from 'app/components/presentational/generic/image';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a category icon based on its media type
 */
export class MediaIconComponent extends Component<MediaIconComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<ImageComponent
				source={images.mediaType(this.props.category.mediaType)}
				tintColor={this.props.tintColor}
				{...this.props}
			/>
		);
	}
}

/**
 * Media's input props
 */
export type MediaIconComponentInput = Omit<ImageComponentInput, 'source'> & {

	/**
	 * The linked category
	 */
	category: CategoryInternal;
}
