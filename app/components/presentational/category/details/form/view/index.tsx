import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { FormikProps } from 'formik';
import { MEDIA_TYPES_INTERNAL, CategoryInternal } from 'app/data/models/internal/category';
import { styles } from 'app/components/presentational/category/details/form/view/styles';
import { i18n } from 'app/utilities/i18n';
import { TextInputFieldComponent } from 'app/components/presentational/form/fields/text-input';
import { PickerFieldComponent } from 'app/components/presentational/form/fields/picker';
import { ColorPickerFieldComponent } from 'app/components/presentational/form/fields/color-picker';
import { config } from 'app/config/config';
import { images } from 'app/utilities/images';

/**
 * Presentational component that contains all category form input fields, all handled by the Formik container component
 */
export class CategoryFormViewComponent extends Component<CategoryFormViewComponentProps> {

	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.handlePropChange();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: CategoryFormViewComponentProps): void {

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
				{this.mediaTypeField()}
				{this.colorField()}
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
				placeholder={i18n.t('category.details.placeholders.name')}
				icon={images.nameField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the media type component
	 */
	private mediaTypeField(): ReactNode {

		const items = MEDIA_TYPES_INTERNAL.map((mediaType) => {
			return {
				value: mediaType,
				label: i18n.t(`category.mediaTypes.${mediaType}`),
				icon: images.mediaType(mediaType)
			};
		});

		return (
			<PickerFieldComponent
				name='mediaType'
				prompt={i18n.t('category.details.prompts.mediaType')}
				disabled={Boolean(this.props.values.id)}
				items={items}
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
				colors={config.ui.colors.availableCategoryColors}
			/>
		);
	}
}

/**
 * CategoryFormViewComponent's input props
 */
export type CategoryFormViewComponentInput = {

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;
}

/**
 * CategoryFormViewComponent's output props
 */
export type CategoryFormViewComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * All props of CategoryFormViewComponent
 */
export type CategoryFormViewComponentProps = FormikProps<CategoryInternal> & CategoryFormViewComponentInput & CategoryFormViewComponentOutput;
