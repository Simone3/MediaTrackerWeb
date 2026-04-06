import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { EntityDetailsFrameComponent } from 'app/components/presentational/generic/entity-details-frame';
import { SameNameConfirmationDialogComponent, shouldOpenSameNameConfirmation } from 'app/components/presentational/generic/same-name-confirmation';
import { ownPlatformFormValidationSchema } from 'app/components/presentational/own-platform/details/form/data';
import { OwnPlatformFormViewComponent } from 'app/components/presentational/own-platform/details/form/view';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import ownPlatformIcon from 'app/resources/images/ic_input_own_platform.svg';
import { i18n } from 'app/utilities/i18n';

const OWN_PLATFORM_DETAILS_ACCENT = 'var(--color-management-accent-default)';

/**
 * Presentational component that contains the whole "own platform details" screen, that works as the "add new own platform", "update own platform" and
 * "view own platform data" sections
 */
export class OwnPlatformDetailsScreenComponent extends Component<OwnPlatformDetailsScreenComponentInput & OwnPlatformDetailsScreenComponentOutput, OwnPlatformDetailsScreenComponentState> {
	private formikProps?: FormikProps<OwnPlatformInternal>;

	public state: OwnPlatformDetailsScreenComponentState = {
		confirmSameNameVisible: false
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<OwnPlatformDetailsScreenComponentInput & OwnPlatformDetailsScreenComponentOutput>): void {
		if(shouldOpenSameNameConfirmation(prevProps.sameNameConfirmationRequested, this.props.sameNameConfirmationRequested)) {
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
			ownPlatform
		} = this.props;
		const {
			confirmSameNameVisible
		} = this.state;

		return (
			<Formik<OwnPlatformInternal>
				initialValues={ownPlatform}
				validationSchema={ownPlatformFormValidationSchema}
				validateOnMount={true}
				enableReinitialize={true}
				innerRef={this.handleFormikRef}
				onSubmit={(values) => {
					this.props.saveOwnPlatform(values, false);
				}}>
				{(formikProps: FormikProps<OwnPlatformInternal>) => {
					const title = formikProps.values.id ? formikProps.values.name : i18n.t('ownPlatform.details.title.new');

					return (
						<EntityDetailsFrameComponent
							screenClassName='own-platform-details-screen'
							accentColor={formikProps.values.color || OWN_PLATFORM_DETAILS_ACCENT}
							icon={<img src={ownPlatformIcon} alt='' className='entity-details-icon' />}
							title={title}
							subtitle={i18n.t('ownPlatform.list.emptyHint')}
							saveLabel={i18n.t('common.buttons.save')}
							saveDisabled={!formikProps.isValid || isLoading}
							loadingVisible={isLoading}
							onSave={() => {
								void formikProps.submitForm();
							}}
							onSubmit={formikProps.handleSubmit}
							dialogs={
								<SameNameConfirmationDialogComponent
									visible={confirmSameNameVisible}
									title={i18n.t('ownPlatform.common.alert.addSameName.title')}
									message={i18n.t('ownPlatform.common.alert.addSameName.message')}
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
							}>
							<OwnPlatformFormViewComponent
								{...formikProps}
								notifyFormStatus={this.props.notifyFormStatus}
							/>
						</EntityDetailsFrameComponent>
					);
				}}
			</Formik>
		);
	}

	/**
	 * Keeps a reference to the current Formik state
	 * @param formikProps the current Formik state
	 */
	private handleFormikRef = (formikProps: FormikProps<OwnPlatformInternal> | null): void => {
		this.formikProps = formikProps || undefined;
	};

	/**
	 * Saves the current Formik values after the user confirmed the duplicate-name alert
	 */
	private submitFormWithSameNameConfirmation(): void {
		if(this.formikProps) {
			this.props.saveOwnPlatform(this.formikProps.values, true);
		}
	}
}

/**
 * OwnPlatformDetailsScreenComponent's input props
 */
export type OwnPlatformDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Own platform loaded from Redux state
	 */
	ownPlatform: OwnPlatformInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;
};

/**
 * OwnPlatformDetailsScreenComponent's output props
 */
export type OwnPlatformDetailsScreenComponentOutput = {
	/**
	 * Callback to save own platform
	 */
	saveOwnPlatform: (ownPlatform: OwnPlatformInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
};

type OwnPlatformDetailsScreenComponentState = {
	confirmSameNameVisible: boolean;
};
