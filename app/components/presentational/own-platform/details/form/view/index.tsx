import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { FormikProps } from 'formik';
import { styles } from 'app/components/presentational/own-platform/details/form/view/styles';
import { i18n } from 'app/utilities/i18n';
import { TextInputFieldComponent } from 'app/components/presentational/form/fields/text-input';
import { images } from 'app/utilities/images';
import { ColorPickerFieldComponent } from 'app/components/presentational/form/fields/color-picker';
import { config } from 'app/config/config';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { PickerFieldComponent } from 'app/components/presentational/form/fields/picker';

/**
 * Presentational component that contains all own platform form input fields, all handled by the Formik container component
 */
export class OwnPlatformFormViewComponent extends Component<OwnPlatformFormViewComponentProps> {

	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.handlePropChange();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: OwnPlatformFormViewComponentProps): void {

		const validChanged = prevProps.isValid !== this.props.isValid;
		const dirtyChanged = prevProps.dirty !== this.props.dirty;
		const saveReqChanged = prevProps.saveRequested !== this.props.saveRequested;
		if(validChanged || dirtyChanged || saveReqChanged) {
			
			this.handlePropChange();
		}
	}

	/**
	 * Helper to handle custom props at startup and after each update
	 */
	private handlePropChange(): void {

		const {
			saveRequested,
			notifyFormStatus,
			submitForm,
			isValid,
			dirty
		} = this.props;

		if(saveRequested) {

			submitForm();
		}
		else {

			notifyFormStatus(isValid, dirty);
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<View style={styles.container}>
				{this.nameField()}
				{this.colorField()}
				{this.iconField()}
			</View>
		);
	}

	/**
	 * Helper
	 * @returns the name component
	 */
	private nameField(): ReactNode {

		return (
			<TextInputFieldComponent
				name='name'
				placeholder={i18n.t('ownPlatform.details.placeholders.name')}
				icon={images.nameField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the color component
	 */
	private colorField(): ReactNode {

		return (
			<ColorPickerFieldComponent
				name='color'
				icon={images.colorField()}
				colors={config.ui.colors.availableOwnPlatformColors}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the icon component
	 */
	private iconField(): ReactNode {

		const items = OWN_PLATFORM_ICON_INTERNAL_VALUES.map((icon) => {
			return {
				value: icon,
				label: i18n.t(`ownPlatform.icons.${icon}`),
				icon: images.ownPlatform(icon)
			};
		});

		return (
			<PickerFieldComponent
				name='icon'
				prompt={i18n.t('ownPlatform.details.prompts.icon')}
				items={items}
			/>
		);
	}
}

/**
 * OwnPlatformFormViewComponent's input props
 */
export type OwnPlatformFormViewComponentInput = {

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;
}

/**
 * OwnPlatformFormViewComponent's output props
 */
export type OwnPlatformFormViewComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * All props of OwnPlatformFormViewComponent
 */
export type OwnPlatformFormViewComponentProps = FormikProps<OwnPlatformInternal> & OwnPlatformFormViewComponentInput & OwnPlatformFormViewComponentOutput;
