import React, { Component, ReactNode } from 'react';
import { Image, ImageProps, ImageRequireSource, StyleSheet, ImageStyle } from 'react-native';

/**
 * Presentational component that wraps the default Image to optionally specify the tint color via prop, plus some default style values
 */
export class ImageComponent extends Component<ImageComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			style,
			tintColor
		} = this.props;

		const defaultSizeStyle = {
			width: 30,
			height: 30
		};

		const colorStyle = {
			tintColor: tintColor
		};

		return (
			<Image
				{...this.props}
				style={StyleSheet.compose<ImageStyle, ImageStyle, ImageStyle>(StyleSheet.compose<ImageStyle, ImageStyle, ImageStyle>(defaultSizeStyle, colorStyle), style)}
			/>
		);
	}
}

/**
 * ImageComponent's input props
 */
export type ImageComponentInput = ImageProps & {

	/**
	 * The image tint color
	 */
	tintColor?: string;
}

/**
 * A simple helper type to specify source and tint color of an image, can be spread into the component props
 */
export type ImageComponentDescriptor = {

	/**
	 * The image path
	 */
	source: ImageRequireSource;

	/**
	 * The image color
	 */
	tintColor?: string;
}
