import { styles } from 'app/components/presentational/generic/hr/styles';
import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';

/**
 * Presentational component to display a simple horizontal line separator
 */
export class HrComponent extends Component {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View style={styles.container}></View>
		);
	}
}
