import React, { ReactNode, Component } from 'react';
import { CommonPickerComponent, PickerComponentProps } from 'app/components/presentational/form/components/picker/common';
import { FormInputComponent } from 'app/components/presentational/form/components/generic';

/**
 * Presentational component to display a picker (Android version)
 */
export class PickerComponent extends Component<PickerComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			icon,
			items,
			currentItem
		} = this.props;

		const selectedItem = items.find((item) => {
			return currentItem === item.value;
		});

		const displayedIcon = selectedItem && selectedItem.icon ? selectedItem.icon : icon;

		return (
			<FormInputComponent {...this.props} icon={displayedIcon}>
				<CommonPickerComponent {...this.props} />
			</FormInputComponent>
		);
	}
}
