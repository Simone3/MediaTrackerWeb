import React, { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { GroupFormViewComponent } from 'app/components/presentational/group/details/form/view';
import { GroupInternal } from 'app/data/models/internal/group';
import { groupFormValidationSchema } from 'app/components/presentational/group/details/form/data';
import { i18n } from 'app/utilities/i18n';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';

/**
 * Presentational component that handles the Formik wrapper component for the group form
 */
export class GroupFormComponent extends Component<GroupFormComponentInput & GroupFormComponentOutput> {

	private formikProps?: FormikProps<GroupInternal>;

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		const {
			sameNameConfirmationRequested,
			saveGroup
		} = this.props;

		// If we need to ask for same-name confirmation...
		if(sameNameConfirmationRequested && this.formikProps) {

			const title = i18n.t('group.common.alert.addSameName.title');
			const message = i18n.t('group.common.alert.addSameName.message');
			ConfirmAlert.alert(title, message, () => {

				if(this.formikProps) {

					saveGroup(this.formikProps.values, true);
				}
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<Formik<GroupInternal>
				onSubmit={(result) => {
					this.props.saveGroup(result, false);
				}}
				initialValues={this.props.initialValues}
				validationSchema={groupFormValidationSchema}
				validateOnMount={true}>
				{(formikProps: FormikProps<GroupInternal>) => {
					
					this.formikProps = formikProps;

					return (
						<GroupFormViewComponent
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
 * GroupFormComponent's input props
 */
export type GroupFormComponentInput = {

	/**
	 * The initial group values for the form inputs
	 */
	initialValues: GroupInternal;

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;

	/**
	 * If an external component requests confirmation to save the group even if there's already one with the same name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * GroupFormComponent's output props
 */
export type GroupFormComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to save the group, after form validation is successful
	 * @param group the group to be saved
	 * @param confirmSameName if the user confirmed to create a group with the same name as an existing one
	 */
	saveGroup: (group: GroupInternal, confirmSameName: boolean) => void;
}
