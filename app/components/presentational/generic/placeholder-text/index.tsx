import { styles } from 'app/components/presentational/generic/placeholder-text/styles';
import React, { Component, ReactNode } from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

/**
 * Presentational component that simply displays a text or, if no text is provided, a placeholder
 */
export class PlaceholderTextComponent extends Component<PlaceholderTextComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			children,
			placeholder
		} = this.props;

		if(children) {

			return <Text {...this.props}/>;
		}
		else {

			return <Text {...this.props} style={[ this.props.style as TextStyle, styles.placeholder ]}>{placeholder ? placeholder : ''}</Text>;
		}
	}
}

/**
 * PlaceholderTextComponent's input props
 */
export type PlaceholderTextComponentInput = TextProps & {

	/**
	 * The placeholder
	 */
	placeholder?: string;
}
