import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { ObjectSchema } from 'yup';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { SameNameConfirmationDialogComponent, shouldOpenSameNameConfirmation } from 'app/components/presentational/generic/same-name-confirmation';
import { GroupInternal } from 'app/data/models/internal/group';
import { CatalogMediaItemInternal, MediaItemInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that handles the Formik wrapper component for the generic media item form
 */
export class CommonMediaItemFormComponent<TMediaItem extends MediaItemInternal = MediaItemInternal> extends Component<CommonMediaItemFormComponentProps<TMediaItem>, CommonMediaItemFormComponentState> {
	private formikProps?: FormikProps<TMediaItem>;
	private initialDraftHandled = false;
	private loadedCatalogId?: string;

	public state: CommonMediaItemFormComponentState = {
		confirmSameNameVisible: false,
		confirmReloadCatalogVisible: false,
		pendingReloadCatalogId: undefined
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		const hasRestoredDraft = Boolean(this.props.restoredDraft);

		this.checkRestoreDraft();

		if(this.props.restoredDraft && this.props.catalogDetails?.catalogLoadId) {
			this.loadedCatalogId = this.props.catalogDetails.catalogLoadId;
		}
		else if(!hasRestoredDraft) {
			this.checkLoadCatalogDetails();
		}

		if(hasRestoredDraft) {
			return;
		}

		this.checkLoadSelectedGroupOnMount();
		this.checkLoadSelectedOwnPlatformOnMount();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CommonMediaItemFormComponentProps<TMediaItem>>): void {
		if(prevProps.initialValues.id !== this.props.initialValues.id ||
			prevProps.initialValues.mediaType !== this.props.initialValues.mediaType) {
			this.initialDraftHandled = false;
			this.loadedCatalogId = undefined;
		}

		if(shouldOpenSameNameConfirmation(prevProps.sameNameConfirmationRequested, this.props.sameNameConfirmationRequested)) {
			this.setState({
				confirmSameNameVisible: true
			});
		}

		this.checkRestoreDraft();
		this.checkLoadCatalogDetails();
		this.checkLoadSelectedGroup();
		this.checkLoadSelectedOwnPlatform();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			children,
			initialValues,
			isLoading,
			validationSchema
		} = this.props;
		const {
			confirmReloadCatalogVisible,
			confirmSameNameVisible
		} = this.state;

		return (
			<Formik<TMediaItem>
				initialValues={initialValues}
				validationSchema={validationSchema}
				validateOnMount={true}
				enableReinitialize={true}
				innerRef={this.handleFormikRef}
				onSubmit={(values) => {
					this.props.saveMediaItem(this.normalizeFormValues(values), false);
				}}>
				{(formikProps: FormikProps<TMediaItem>) => {
					const title = formikProps.values.id ? formikProps.values.name : i18n.t(`mediaItem.details.title.new.${formikProps.values.mediaType}`);
					const subtitle = formikProps.values.id ? i18n.t('mediaItem.details.subtitle.existing') : i18n.t('mediaItem.details.subtitle.new');

					return (
						<section className='media-item-details-screen'>
							<div className='media-item-details-screen-content'>
								<AuthenticatedPageHeaderComponent
									title={title}
									subtitle={subtitle}
									actions={
										<PillButtonComponent
											tone='primary'
											size='compact'
											disabled={!formikProps.isValid || !formikProps.values.name.trim() || isLoading}
											onClick={() => {
												void formikProps.submitForm();
											}}>
											{i18n.t('common.buttons.save')}
										</PillButtonComponent>
									}
								/>
								<form className='media-item-details-form' onSubmit={formikProps.handleSubmit}>
									{children(formikProps, this.requestCatalogReload)}
								</form>
							</div>
							<SameNameConfirmationDialogComponent
								visible={confirmSameNameVisible}
								title={i18n.t('mediaItem.common.alert.addSameName.title')}
								message={i18n.t(`mediaItem.common.alert.addSameName.message.${formikProps.values.mediaType}`)}
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
							<ConfirmDialogComponent
								visible={confirmReloadCatalogVisible}
								title={i18n.t('mediaItem.common.alert.reloadCatalog.title')}
								message={i18n.t('mediaItem.common.alert.reloadCatalog.message')}
								confirmLabel={i18n.t('common.alert.default.okButton')}
								cancelLabel={i18n.t('common.alert.default.cancelButton')}
								onConfirm={() => {
									const {
										pendingReloadCatalogId
									} = this.state;

									this.setState({
										confirmReloadCatalogVisible: false,
										pendingReloadCatalogId: undefined
									}, () => {
										if(pendingReloadCatalogId) {
											this.props.loadMediaItemCatalogDetails(pendingReloadCatalogId);
										}
									});
								}}
								onCancel={() => {
									this.setState({
										confirmReloadCatalogVisible: false,
										pendingReloadCatalogId: undefined
									});
								}}
							/>
							<LoadingIndicatorComponent visible={isLoading} fullScreen={false} />
						</section>
					);
				}}
			</Formik>
		);
	}

	/**
	 * Keeps a reference to the current Formik state
	 * @param formikProps the current Formik state
	 */
	private handleFormikRef = (formikProps: FormikProps<TMediaItem> | null): void => {
		this.formikProps = formikProps || undefined;
	};

	/**
	 * Normalizes current form values before save
	 * @param values current form values
	 * @returns normalized values
	 */
	private normalizeFormValues(values: TMediaItem): TMediaItem {
		if(this.props.normalizeFormValues) {
			return this.props.normalizeFormValues(values);
		}

		return values;
	}

	/**
	 * Removes the transport-only catalog load ID from catalog payloads before storing them in Formik
	 * @param value catalog payload
	 * @returns payload without catalog load ID
	 */
	private removeCatalogLoadId<TCatalogValue extends object>(
		value: TCatalogValue & {
			catalogLoadId?: string;
		}
	): TCatalogValue {
		const sanitizedValue = {
			...value
		};

		delete (sanitizedValue as {
			catalogLoadId?: string;
		}).catalogLoadId;

		return sanitizedValue;
	}

	/**
	 * Restores the current draft once after the form has mounted
	 */
	private checkRestoreDraft(): void {
		if(this.initialDraftHandled || !this.formikProps) {
			return;
		}

		this.initialDraftHandled = true;

		if(this.props.restoredDraft) {
			void this.formikProps.setValues({
				...this.props.restoredDraft
			});
		}
	}

	/**
	 * Checks if catalog details must be merged into the current form
	 */
	private checkLoadCatalogDetails(): void {
		const {
			catalogDetails
		} = this.props;

		if(!this.formikProps || !catalogDetails || this.loadedCatalogId === catalogDetails.catalogLoadId) {
			return;
		}

		this.loadedCatalogId = catalogDetails.catalogLoadId;
		const defaultCatalogValues = this.removeCatalogLoadId(this.props.defaultCatalogItem);
		const catalogValues = this.removeCatalogLoadId(catalogDetails as Partial<TMediaItem> & {
			catalogLoadId?: string;
		});
		let nextValues: TMediaItem = {
			...this.formikProps.values,
			...defaultCatalogValues,
			...catalogValues
		};

		if(this.props.onLoadCatalogDetails) {
			nextValues = this.props.onLoadCatalogDetails(this.formikProps.values, nextValues);
		}

		void this.formikProps.setValues(nextValues);
	}

	/**
	 * Loads the selected group from Redux into the form
	 * @param orderInGroup the current order-in-group value to preserve while applying the selected group
	 * @param baseValues the form values that should be used as the merge base for the group selection update
	 */
	private loadSelectedGroup(
		orderInGroup: number | undefined = this.formikProps?.values.orderInGroup,
		baseValues: TMediaItem | undefined = this.formikProps?.values
	): void {
		if(!this.formikProps || !baseValues) {
			return;
		}

		void this.formikProps.setValues({
			...baseValues,
			group: this.props.selectedGroup,
			orderInGroup: this.props.selectedGroup ? orderInGroup : undefined
		});
	}

	/**
	 * Checks if the selected group must be loaded during the initial mount
	 */
	private checkLoadSelectedGroupOnMount(): void {
		const hasRestoredDraft = this.props.restoredDraft !== undefined;
		const currentGroupId = hasRestoredDraft ? this.props.restoredDraft?.group?.id : this.props.initialValues.group?.id;
		const currentOrderInGroup = hasRestoredDraft ? this.props.restoredDraft?.orderInGroup : this.props.initialValues.orderInGroup;

		if(this.props.selectedGroup?.id !== currentGroupId ||
			(!this.props.selectedGroup && currentOrderInGroup !== undefined)) {
			this.loadSelectedGroup(currentOrderInGroup, this.props.restoredDraft || this.formikProps?.values);
		}
	}

	/**
	 * Checks if the selected group has changed in Redux
	 */
	private checkLoadSelectedGroup(): void {
		if(!this.formikProps || this.props.selectedGroup?.id === this.formikProps.values.group?.id) {
			return;
		}

		this.loadSelectedGroup(this.formikProps.values.orderInGroup, this.formikProps.values);
	}

	/**
	 * Loads the selected own platform from Redux into the form
	 */
	private loadSelectedOwnPlatform(): void {
		if(!this.formikProps) {
			return;
		}

		void this.formikProps.setFieldValue('ownPlatform', this.props.selectedOwnPlatform);
	}

	/**
	 * Checks if the selected own platform must be loaded during the initial mount
	 */
	private checkLoadSelectedOwnPlatformOnMount(): void {
		const currentOwnPlatformId = this.props.restoredDraft?.ownPlatform?.id || this.props.initialValues.ownPlatform?.id;

		if(this.props.selectedOwnPlatform?.id !== currentOwnPlatformId) {
			this.loadSelectedOwnPlatform();
		}
	}

	/**
	 * Checks if the selected own platform has changed in Redux
	 */
	private checkLoadSelectedOwnPlatform(): void {
		if(!this.formikProps || this.props.selectedOwnPlatform?.id === this.formikProps.values.ownPlatform?.id) {
			return;
		}

		this.loadSelectedOwnPlatform();
	}

	/**
	 * Opens the reload-catalog confirmation dialog
	 * @param catalogId selected catalog ID
	 */
	private requestCatalogReload = (catalogId: string): void => {
		this.setState({
			confirmReloadCatalogVisible: true,
			pendingReloadCatalogId: catalogId
		});
	};

	/**
	 * Saves the current Formik values after the user confirmed the duplicate-name alert
	 */
	private submitFormWithSameNameConfirmation(): void {
		if(this.formikProps) {
			this.props.saveMediaItem(this.normalizeFormValues(this.formikProps.values), true);
		}
	}
}

/**
 * CommonMediaItemFormComponent's input props
 */
export type CommonMediaItemFormComponentInputMain<TMediaItem extends MediaItemInternal = MediaItemInternal> = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * The saved media item used as Formik initial values
	 */
	initialValues: TMediaItem;

	/**
	 * The current unsaved form draft restored after mount, if any
	 */
	restoredDraft?: TMediaItem;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;

	/**
	 * The current media item catalog search results
	 */
	catalogSearchResults?: SearchMediaItemCatalogResultInternal[];

	/**
	 * The current media item catalog details
	 */
	catalogDetails?: CatalogMediaItemInternal;

	/**
	 * The currently selected group, if any
	 */
	selectedGroup?: GroupInternal;

	/**
	 * The currently selected own platform, if any
	 */
	selectedOwnPlatform?: OwnPlatformInternal;
};

/**
 * CommonMediaItemFormComponent's configuration props
 */
export type CommonMediaItemFormComponentInputConfig<TMediaItem extends MediaItemInternal = MediaItemInternal> = {
	/**
	 * Form content renderer
	 */
	children: (props: FormikProps<TMediaItem>, requestCatalogReload: (catalogId: string) => void) => ReactNode;

	/**
	 * The default empty catalog media item fields
	 */
	defaultCatalogItem: Partial<TMediaItem> & {
		catalogLoadId?: string;
	};

	/**
	 * Optional hook to adapt merged catalog values
	 * @param currentValues current form values
	 * @param mergedValues merged values after loading catalog details
	 * @returns final values to commit to Formik
	 */
	onLoadCatalogDetails?: (currentValues: TMediaItem, mergedValues: TMediaItem) => TMediaItem;

	/**
	 * Optional hook to normalize values before save
	 * @param values current form values
	 * @returns normalized values
	 */
	normalizeFormValues?: (values: TMediaItem) => TMediaItem;

	/**
	 * The media item form validation schema
	 */
	validationSchema: ObjectSchema<TMediaItem>;
};

/**
 * CommonMediaItemFormComponent's output props
 */
export type CommonMediaItemFormComponentOutput = {
	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to save the media item
	 * @param mediaItem the media item to save
	 * @param confirmSameName if true, bypasses duplicate-name confirmation in saga
	 */
	saveMediaItem: (mediaItem: MediaItemInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to persist the current unsaved form draft
	 * @param mediaItem the current form values
	 */
	persistFormDraft: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to request group selection
	 */
	requestGroupSelection: () => void;

	/**
	 * Callback to request own platform selection
	 */
	requestOwnPlatformSelection: () => void;

	/**
	 * Callback to search media items catalog
	 */
	searchMediaItemsCatalog: (term: string) => void;

	/**
	 * Callback to load media item catalog details
	 */
	loadMediaItemCatalogDetails: (catalogId: string) => void;

	/**
	 * Callback to clear media items catalog search results
	 */
	resetMediaItemsCatalogSearch: () => void;
};

/**
 * CommonMediaItemFormComponent's props
 */
export type CommonMediaItemFormComponentProps<TMediaItem extends MediaItemInternal = MediaItemInternal> = CommonMediaItemFormComponentInputMain<TMediaItem> & CommonMediaItemFormComponentInputConfig<TMediaItem> & CommonMediaItemFormComponentOutput;

type CommonMediaItemFormComponentState = {
	confirmSameNameVisible: boolean;
	confirmReloadCatalogVisible: boolean;
	pendingReloadCatalogId?: string;
};
