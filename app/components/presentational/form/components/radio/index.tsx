import React, { ReactNode, Component } from 'react';
import { styles } from 'app/components/presentational/form/components/radio/styles';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

/**
 * Presentational component to display a radio button
 */
export class RadioButtonComponent extends Component<RadioButtonComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			selected,
			onSelect
		} = this.props;

		return (
			<TouchableOpacity onPress={onSelect}>
				<View style={selected ? [ styles.outerCircle, styles.outerCircleActive ] : styles.outerCircle }>
					<View style={selected ? [ styles.innerCircle, styles.innerCircleActive ] : styles.innerCircle } />
				</View>
			</TouchableOpacity>
		);
	}
}

/**
 * RadioButtonComponent's input props
 */
export type RadioButtonComponentInput = {

	/**
	 * If the radio button is currently selected
	 */
	selected: boolean;
}

/**
 * RadioButtonComponent's output props
 */
export type RadioButtonComponentOutput = {

	/**
	 * Selection callback
	 */
	onSelect: () => void;
}

/**
 * RadioButtonComponent's props
 */
export type RadioButtonComponentProps = RadioButtonComponentInput & RadioButtonComponentOutput;
