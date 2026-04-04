import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { CategoryFormViewComponent } from 'app/components/presentational/category/details/form/view';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { SameNameConfirmationDialogComponent, shouldOpenSameNameConfirmation } from 'app/components/presentational/generic/same-name-confirmation';
import { categoryFormValidationSchema } from 'app/components/presentational/category/details/form/data';
import { CategoryInternal } from 'app/data/models/internal/category';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "categories details" screen, that works as the "add new category", "update category" and
 * "view category data" sections
 */
export class CategoryDetailsScreenComponent extends Component<CategoryDetailsScreenComponentInput & CategoryDetailsScreenComponentOutput, CategoryDetailsScreenComponentState> {
	private formikProps?: FormikProps<CategoryInternal>;

	public state: CategoryDetailsScreenComponentState = {
		confirmSameNameVisible: false
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CategoryDetailsScreenComponentInput & CategoryDetailsScreenComponentOutput>): void {
		if (shouldOpenSameNameConfirmation(prevProps.sameNameConfirmationRequested, this.props.sameNameConfirmationRequested)) {
			this.setState({
				confirmSameNameVisible: true
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			isLoading,
			category
		} = this.props;

		const {
			confirmSameNameVisible
		} = this.state;

		return (
			<section className='category-details-screen'>
				<Formik<CategoryInternal>
					initialValues={category}
					validationSchema={categoryFormValidationSchema}
					validateOnMount={true}
					enableReinitialize={true}
					innerRef={this.handleFormikRef}
					onSubmit={(values) => {
						this.props.saveCategory(values, false);
					}}>
					{(formikProps: FormikProps<CategoryInternal>) => {
						const detailsTitle = formikProps.values.id ? formikProps.values.name : i18n.t('category.details.title.new');

						return (
							<>
								<div className='category-details-shell'>
									<div className='category-details-header'>
										<h1 className='category-details-title'>{detailsTitle}</h1>
										<div className='category-details-actions'>
											<PillButtonComponent
												type='submit'
												form='category-details-form'
												tone='primary'
												disabled={!formikProps.isValid || isLoading}>
												{i18n.t('common.buttons.save')}
											</PillButtonComponent>
										</div>
									</div>
									<form
										id='category-details-form'
										className='category-details-form'
										onSubmit={formikProps.handleSubmit}>
										<CategoryFormViewComponent
											{...formikProps}
											notifyFormStatus={this.props.notifyFormStatus}
										/>
									</form>
								</div>
								<SameNameConfirmationDialogComponent
									visible={confirmSameNameVisible}
									title={i18n.t('category.common.alert.addSameName.title')}
									message={i18n.t('category.common.alert.addSameName.message')}
									onConfirm={() => {
										this.setState({
											confirmSameNameVisible: false
										}, () => {
											this.submitFormWithSameNameConfirmation();
										});
									}}
									onCancel={() => {
										this.setState({
											confirmSameNameVisible: false
										});
									}}
								/>
							</>
						);
					}}
				</Formik>
				<LoadingIndicatorComponent visible={isLoading} fullScreen={false} />
			</section>
		);
	}

	/**
	 * Keeps a reference to the current Formik state
	 * @param formikProps the current Formik state
	 */
	private handleFormikRef = (formikProps: FormikProps<CategoryInternal> | null): void => {
		this.formikProps = formikProps || undefined;
	};

	/**
	 * Saves the current Formik values after the user confirmed the duplicate-name alert
	 */
	private submitFormWithSameNameConfirmation(): void {
		if (this.formikProps) {
			this.props.saveCategory(this.formikProps.values, true);
		}
	}
}

/**
 * CategoryDetailsScreenComponent's input props
 */
export type CategoryDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Category loaded from Redux state
	 */
	category: CategoryInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;
};

/**
 * CategoryDetailsScreenComponent's output props
 */
export type CategoryDetailsScreenComponentOutput = {
	/**
	 * Callback to save category
	 */
	saveCategory: (category: CategoryInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
};

type CategoryDetailsScreenComponentState = {
	confirmSameNameVisible: boolean;
};
