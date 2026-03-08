import React, { Component, ReactNode } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from 'app/components/presentational/generic/floating-action-button/styles';

/**
 * Presentational component for a Floating Action Button (FAB)
 */
export class FABComponent extends Component<FABComponentInput & FABComponentOutput> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<TouchableOpacity
				style={styles.fab}
				onPress={this.props.onPress}>
				<Text style={styles.text}>{this.props.text}</Text>
			</TouchableOpacity>
		);
	}
}

/**
 * FABComponent's input props
 */
export type FABComponentInput = {
	
	/**
	 * The text to display on the FAB, it should usually be a 1-character string
	 */
	text: string;
}

/**
 * FABComponent's output props
 */
export type FABComponentOutput = {

	/**
	 * The FAB press callback
	 */
	onPress: () => void;
}
