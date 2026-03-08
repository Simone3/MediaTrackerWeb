import { styles } from 'app/components/presentational/generic/hyperlink/styles';
import React, { Component, ReactNode } from 'react';
import { Text, Linking } from 'react-native';
import { AppError } from 'app/data/models/internal/error';

/**
 * Presentational component to display a hyperlink
 */
export class HyperlinkComponent extends Component<HyperlinkComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			children
		} = this.props;

		return (
			<Text
				onPress={this.openUrl.bind(this)}
				style={styles.text}>
				{children}
			</Text>
		);
	}

	/**
	 * Click callback
	 */
	private openUrl(): void {
		
		const {
			url
		} = this.props;
		
		Linking.canOpenURL(url).then((supported) => {
			
			if(supported) {
				
				Linking.openURL(url);
			}
			else {
				
				throw AppError.GENERIC.withDetails(`Cannot open URL ${url}`);
			}
		});
	}
}

/**
 * HyperlinkComponent's input props
 */
export type HyperlinkComponentInput = {

	/**
	 * @override
	 */
	children: string;

	/**
	 * The URL to open via browser
	 */
	url: string;
}
