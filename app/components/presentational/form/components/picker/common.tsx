import { styles } from 'app/components/presentational/form/components/picker/styles';
import React, { ReactNode, Component } from 'react';
import { ImageRequireSource } from 'react-native';
import { FormInputComponentInput, FormInputComponentOutput } from 'app/components/presentational/form/components/generic';
import { Picker } from '@react-native-picker/picker';

/**
 * Common component to display a picker (Android and iOS)
 */
export class CommonPickerComponent extends Component<PickerComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			prompt,
			items,
			currentItem,
			onSelectItem,
			disabled
		} = this.props;

		return (
			<Picker
				mode='dialog'
				prompt={prompt}
				enabled={!disabled}
				selectedValue={currentItem}
				style={styles.input}
				onValueChange={(itemValue) => {

					onSelectItem(itemValue.toString());
				}}>
				{items.map((item, index) => {
					return (
						<Picker.Item
							key={index}
							label={item.label}
							value={item.value}
						/>
					);
				})}
			</Picker>
		);
	}
}

/**
 * PickerComponent's input props
 */
export type PickerComponentInput = FormInputComponentInput & {

	/**
	 * The current value
	 */
	currentItem: string | undefined;

	/**
	 * The input items
	 */
	items: PickerComponentItem[];

	/**
	 * The modal title
	 */
	prompt: string;
}

/**
 * PickerComponent's output props
 */
export type PickerComponentOutput = FormInputComponentOutput & {

	/**
	 * Notifies input value change
	 */
	onSelectItem: (value: string) => void;
}

/**
 * PickerComponent's props
 */
export type PickerComponentProps = PickerComponentInput & PickerComponentOutput;

/**
 * An item displayed by PickerComponent
 */
export type PickerComponentItem = {

	/**
	 * The item value
	 */
	value: string;

	/**
	 * The item label
	 */
	label: string;

	/**
	 * The item icon, that optionally overwrites the default input icon
	 */
	icon?: ImageRequireSource;
}
