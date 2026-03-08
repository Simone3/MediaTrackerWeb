import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { FormikProps } from 'formik';
import { styles } from 'app/components/presentational/group/details/form/view/styles';
import { i18n } from 'app/utilities/i18n';
import { TextInputFieldComponent } from 'app/components/presentational/form/fields/text-input';
import { images } from 'app/utilities/images';
import { GroupInternal } from 'app/data/models/internal/group';

/**
 * Presentational component that contains all group form input fields, all handled by the Formik container component
 */
export class GroupFormViewComponent extends Component<GroupFormViewComponentProps> {

	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.handlePropChange();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: GroupFormViewComponentProps): void {

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
				placeholder={i18n.t('group.details.placeholders.name')}
				icon={images.nameField()}
			/>
		);
	}
}

/**
 * GroupFormViewComponent's input props
 */
export type GroupFormViewComponentInput = {

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;
}

/**
 * GroupFormViewComponent's output props
 */
export type GroupFormViewComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * All props of GroupFormViewComponent
 */
export type GroupFormViewComponentProps = FormikProps<GroupInternal> & GroupFormViewComponentInput & GroupFormViewComponentOutput;
