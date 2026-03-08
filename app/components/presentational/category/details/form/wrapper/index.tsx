import React, { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { CategoryFormViewComponent } from 'app/components/presentational/category/details/form/view';
import { CategoryInternal } from 'app/data/models/internal/category';
import { categoryFormValidationSchema } from 'app/components/presentational/category/details/form/data';
import { i18n } from 'app/utilities/i18n';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';

/**
 * Presentational component that handles the Formik wrapper component for the category form
 */
export class CategoryFormComponent extends Component<CategoryFormComponentInput & CategoryFormComponentOutput> {
	
	private formikProps?: FormikProps<CategoryInternal>;

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		const {
			sameNameConfirmationRequested,
			saveCategory
		} = this.props;

		// If we need to ask for same-name confirmation...
		if(sameNameConfirmationRequested && this.formikProps) {

			const title = i18n.t('category.common.alert.addSameName.title');
			const message = i18n.t('category.common.alert.addSameName.message');
			ConfirmAlert.alert(title, message, () => {

				if(this.formikProps) {

					saveCategory(this.formikProps.values, true);
				}
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<Formik<CategoryInternal>
				onSubmit={(result) => {
					this.props.saveCategory(result, false);
				}}
				initialValues={this.props.initialValues}
				validationSchema={categoryFormValidationSchema}
				validateOnMount={true}>
				{(formikProps: FormikProps<CategoryInternal>) => {
					
					this.formikProps = formikProps;
					
					return (
						<CategoryFormViewComponent
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
 * CategoryFormComponent's input props
 */
export type CategoryFormComponentInput = {

	/**
	 * The initial category values for the form inputs
	 */
	initialValues: CategoryInternal;

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;

	/**
	 * If an external component requests confirmation to save the category even if there's already one with the same name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * CategoryFormComponent's output props
 */
export type CategoryFormComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to save the category, after form validation is successful
	 * @param category the category to be saved
	 * @param confirmSameName if the user confirmed to create a category with the same name as an existing one
	 */
	saveCategory: (category: CategoryInternal, confirmSameName: boolean) => void;
}
