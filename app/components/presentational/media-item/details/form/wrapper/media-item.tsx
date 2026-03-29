import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { ObjectSchema } from 'yup';
import { MediaIconComponent } from 'app/components/presentational/category/common/media-icon';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { SameNameConfirmationDialogComponent, shouldOpenSameNameConfirmation } from 'app/components/presentational/generic/same-name-confirmation';
import { GroupInternal } from 'app/data/models/internal/group';
import { CatalogMediaItemInternal, MediaItemInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';
import { MediaItemDetailsFormValues, mergeCatalogDetailsIntoMediaItem, normalizeMediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';

/**
 * Presentational component that handles the Formik wrapper component for the generic media item form
 */
export class CommonMediaItemFormComponent extends Component<CommonMediaItemFormComponentProps, CommonMediaItemFormComponentState> {
	private formikProps?: FormikProps<MediaItemDetailsFormValues>;

	public state: CommonMediaItemFormComponentState = {
		confirmSameNameVisible: false,
		confirmReloadCatalogVisible: false,
		pendingReloadCatalogId: undefined
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CommonMediaItemFormComponentProps>): void {
		if(shouldOpenSameNameConfirmation(prevProps.sameNameConfirmationRequested, this.props.sameNameConfirmationRequested)) {
			this.setState({
				confirmSameNameVisible: true
			});
		}

		this.checkLoadCatalogDetails(prevProps.catalogDetails);
		this.checkLoadSelectedGroup(prevProps.selectedGroup);
		this.checkLoadSelectedOwnPlatform(prevProps.selectedOwnPlatform);
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
			<Formik<MediaItemDetailsFormValues>
				initialValues={initialValues}
				validationSchema={validationSchema}
				validateOnMount={true}
				enableReinitialize={true}
				innerRef={this.handleFormikRef}
				onSubmit={(values) => {
					this.props.saveMediaItem(normalizeMediaItemDetailsFormValues(values), false);
				}}>
				{(formikProps: FormikProps<MediaItemDetailsFormValues>) => {
					const title = formikProps.values.id ? formikProps.values.name : i18n.t(`mediaItem.details.title.new.${formikProps.values.mediaType}`);

					return (
						<section className='media-item-details-screen'>
							<div className='media-item-details-screen-content'>
								<header className='media-item-details-hero'>
									<div className='media-item-details-heading'>
										<div className='media-item-details-title-row'>
											<span className='media-item-details-icon-shell' aria-hidden={true}>
												<MediaIconComponent mediaType={formikProps.values.mediaType} className='media-item-details-icon' />
											</span>
											<div className='media-item-details-title-copy'>
												<h1 className='media-item-details-title'>{title}</h1>
											</div>
										</div>
									</div>
									<div className='media-item-details-actions'>
										<button
											type='button'
											className='media-item-details-button media-item-details-button-primary'
											disabled={!formikProps.isValid || !formikProps.values.name.trim() || isLoading}
											onClick={() => {
												void formikProps.submitForm();
											}}>
											{i18n.t('common.buttons.save')}
										</button>
									</div>
								</header>
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
	private handleFormikRef = (formikProps: FormikProps<MediaItemDetailsFormValues> | null): void => {
		this.formikProps = formikProps || undefined;
	};

	/**
	 * Checks if catalog details must be merged into the current form
	 * @param prevCatalogDetails previous catalog details
	 */
	private checkLoadCatalogDetails(prevCatalogDetails?: CatalogMediaItemInternal): void {
		const {
			catalogDetails
		} = this.props;

		if(!this.formikProps || !catalogDetails || prevCatalogDetails?.catalogLoadId === catalogDetails.catalogLoadId) {
			return;
		}

		void this.formikProps.setValues(mergeCatalogDetailsIntoMediaItem(this.formikProps.values, catalogDetails));
	}

	/**
	 * Checks if the selected group has changed in Redux
	 * @param prevSelectedGroup previous selected group
	 */
	private checkLoadSelectedGroup(prevSelectedGroup?: GroupInternal): void {
		if(!this.formikProps || prevSelectedGroup?.id === this.props.selectedGroup?.id) {
			return;
		}

		void this.formikProps.setFieldValue('group', this.props.selectedGroup);
		void this.formikProps.setFieldValue('orderInGroup', this.props.selectedGroup ? this.formikProps.values.orderInGroup : undefined);
	}

	/**
	 * Checks if the selected own platform has changed in Redux
	 * @param prevSelectedOwnPlatform previous selected own platform
	 */
	private checkLoadSelectedOwnPlatform(prevSelectedOwnPlatform?: OwnPlatformInternal): void {
		if(!this.formikProps || prevSelectedOwnPlatform?.id === this.props.selectedOwnPlatform?.id) {
			return;
		}

		void this.formikProps.setFieldValue('ownPlatform', this.props.selectedOwnPlatform);
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
			this.props.saveMediaItem(normalizeMediaItemDetailsFormValues(this.formikProps.values), true);
		}
	}
}

/**
 * CommonMediaItemFormComponent's input props
 */
export type CommonMediaItemFormComponentInputMain = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * The current Formik initial values
	 */
	initialValues: MediaItemDetailsFormValues;

	/**
	 * The Redux media item used as dirty-state reference
	 */
	baseMediaItem: MediaItemInternal;

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
export type CommonMediaItemFormComponentInputConfig = {
	/**
	 * Form content renderer
	 */
	children: (props: FormikProps<MediaItemDetailsFormValues>, requestCatalogReload: (catalogId: string) => void) => ReactNode;

	/**
	 * The media item form validation schema
	 */
	validationSchema: ObjectSchema<MediaItemDetailsFormValues>;
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
	 * Callback to open TV show seasons flow
	 */
	handleTvShowSeasons: (currentSeasons?: TvShowSeasonInternal[]) => void;

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
export type CommonMediaItemFormComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentInputConfig & CommonMediaItemFormComponentOutput;

type CommonMediaItemFormComponentState = {
	confirmSameNameVisible: boolean;
	confirmReloadCatalogVisible: boolean;
	pendingReloadCatalogId?: string;
};
