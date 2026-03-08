import React, { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { OwnPlatformFormViewComponent } from 'app/components/presentational/own-platform/details/form/view';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ownPlatformFormValidationSchema } from 'app/components/presentational/own-platform/details/form/data';
import { i18n } from 'app/utilities/i18n';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';

/**
 * Presentational component that handles the Formik wrapper component for the own platform form
 */
export class OwnPlatformFormComponent extends Component<OwnPlatformFormComponentInput & OwnPlatformFormComponentOutput> {

	private formikProps?: FormikProps<OwnPlatformInternal>;

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		const {
			sameNameConfirmationRequested,
			saveOwnPlatform
		} = this.props;

		// If we need to ask for same-name confirmation...
		if(sameNameConfirmationRequested && this.formikProps) {

			const title = i18n.t('ownPlatform.common.alert.addSameName.title');
			const message = i18n.t('ownPlatform.common.alert.addSameName.message');
			ConfirmAlert.alert(title, message, () => {

				if(this.formikProps) {

					saveOwnPlatform(this.formikProps.values, true);
				}
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<Formik<OwnPlatformInternal>
				onSubmit={(result) => {
					this.props.saveOwnPlatform(result, false);
				}}
				initialValues={this.props.initialValues}
				validationSchema={ownPlatformFormValidationSchema}
				validateOnMount={true}>
				{(formikProps: FormikProps<OwnPlatformInternal>) => {
					
					this.formikProps = formikProps;

					return (
						<OwnPlatformFormViewComponent
							{...formikProps}
							saveRequested={this.props.saveRequested}
							notifyFormStatus={this.props.notifyFormStatus}
						/>
					);
				}}
			</Formik>
		);
	}
}

/**
 * OwnPlatformFormComponent's input props
 */
export type OwnPlatformFormComponentInput = {

	/**
	 * The initial own platform values for the form inputs
	 */
	initialValues: OwnPlatformInternal;

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;

	/**
	 * If an external component requests confirmation to save the own platform even if there's already one with the same name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * OwnPlatformFormComponent's output props
 */
export type OwnPlatformFormComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to save the own platform, after form validation is successful
	 * @param ownPlatform the own platform to be saved
	 * @param confirmSameName if the user confirmed to create a own platform with the same name as an existing one
	 */
	saveOwnPlatform: (ownPlatform: OwnPlatformInternal, confirmSameName: boolean) => void;
}
