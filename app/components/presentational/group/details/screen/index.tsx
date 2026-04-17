import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { EntityDetailsFrameComponent } from 'app/components/presentational/generic/entity-details-frame';
import { GroupFormViewComponent } from 'app/components/presentational/group/details/form/view';
import { groupFormValidationSchema } from 'app/components/presentational/group/details/form/data';
import { SameNameConfirmationDialogComponent, shouldOpenSameNameConfirmation } from 'app/components/presentational/generic/same-name-confirmation';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

const GROUP_DETAILS_ACCENT = 'var(--color-management-accent-default)';

/**
 * Presentational component that contains the whole "group details" screen, that works as the "add new group", "update group" and
 * "view group data" sections
 */
export class GroupDetailsScreenComponent extends Component<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput, GroupDetailsScreenComponentState> {
	private formikProps?: FormikProps<GroupInternal>;

	public state: GroupDetailsScreenComponentState = {
		confirmSameNameVisible: false
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput>): void {
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
			group
		} = this.props;
		const {
			confirmSameNameVisible
		} = this.state;

		return (
			<Formik<GroupInternal>
				initialValues={group}
				validationSchema={groupFormValidationSchema}
				validateOnMount={true}
				enableReinitialize={true}
				innerRef={this.handleFormikRef}
				onSubmit={(values) => {
					this.props.saveGroup(values, false);
				}}>
				{(formikProps: FormikProps<GroupInternal>) => {
					const title = formikProps.values.id ? formikProps.values.name : i18n.t('group.details.title.new');
					const subtitle = formikProps.values.id ? i18n.t('group.details.subtitle.existing') : i18n.t('group.details.subtitle.new');

					return (
						<EntityDetailsFrameComponent
							screenClassName='group-details-screen'
							accentColor={GROUP_DETAILS_ACCENT}
							title={title}
							subtitle={subtitle}
							saveLabel={i18n.t('common.buttons.save')}
							saveDisabled={!formikProps.isValid || isLoading}
							saveLoadingVisible={isLoading}
							onSave={() => {
								void formikProps.submitForm();
							}}
							onSubmit={formikProps.handleSubmit}
							dialogs={
								<SameNameConfirmationDialogComponent
									visible={confirmSameNameVisible}
									title={i18n.t('group.common.alert.addSameName.title')}
									message={i18n.t('group.common.alert.addSameName.message')}
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
							<GroupFormViewComponent
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
	private handleFormikRef = (formikProps: FormikProps<GroupInternal> | null): void => {
		this.formikProps = formikProps || undefined;
	};

	/**
	 * Saves the current Formik values after the user confirmed the duplicate-name alert
	 */
	private submitFormWithSameNameConfirmation(): void {
		if(this.formikProps) {
			this.props.saveGroup(this.formikProps.values, true);
		}
	}
}

/**
 * GroupDetailsScreenComponent's input props
 */
export type GroupDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Group loaded from Redux state
	 */
	group: GroupInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;
};

/**
 * GroupDetailsScreenComponent's output props
 */
export type GroupDetailsScreenComponentOutput = {
	/**
	 * Callback to save group
	 */
	saveGroup: (group: GroupInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
};

type GroupDetailsScreenComponentState = {
	confirmSameNameVisible: boolean;
};
