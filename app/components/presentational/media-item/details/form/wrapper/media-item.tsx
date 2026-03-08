import React, { Component, ReactNode } from 'react';
import { MediaItemInternal, CatalogMediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { FormikProps, Formik } from 'formik';
import { ObjectSchema } from 'yup';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * Presentational component that handles the Formik wrapper component for the generic media item form
 */
export class CommonMediaItemFormComponent extends Component<CommonMediaItemFormComponentProps> {
	
	private formikProps?: FormikProps<MediaItemInternal>;
	private loadedCatalogId?: string;

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		// Check if we need to perform some operations during this render
		this.checkLoadCatalogDetails();
		this.checkLoadSelectedGroup();
		this.checkLoadSelectedOwnPlatform();
		this.checkAskSameNameConfirmation();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			saveMediaItem,
			initialValues,
			children,
			validationSchema
		} = this.props;

		return (
			<Formik<MediaItemInternal>
				onSubmit={(result) => {
					saveMediaItem(result, false);
				}}
				initialValues={initialValues}
				validationSchema={validationSchema}
				validateOnMount={true}>
				{(formikProps: FormikProps<MediaItemInternal>) => {

					this.formikProps = formikProps;
					return children(formikProps);
				}}
			</Formik>
		);
	}

	/**
	 * Checks if we need to (re)load the catalog details, after they have been fetched
	 */
	private checkLoadCatalogDetails(): void {

		const {
			loadCatalogDetails,
			defaultCatalogItem,
			onLoadCatalogDetails
		} = this.props;
		
		// If we have new catalog details...
		if(this.formikProps && loadCatalogDetails && loadCatalogDetails.catalogLoadId && loadCatalogDetails.catalogLoadId !== this.loadedCatalogId) {
			
			this.loadedCatalogId = loadCatalogDetails.catalogLoadId;

			// Reload EVERY catalog field (even if the current object has an undefined/null value)
			const values: MediaItemInternal = {
				...this.formikProps.values,
				...defaultCatalogItem,
				...loadCatalogDetails
			};

			// Optional callback for specific actions (it can modify "values")
			if(onLoadCatalogDetails) {

				onLoadCatalogDetails(this.formikProps.values, values);
			}

			// Commit the new data to the Formik properties
			this.formikProps.setValues(values);
		}
	}

	/**
	 * Checks if we need to set the current group, selected from another screen
	 */
	private checkLoadSelectedGroup(): void {

		const {
			selectedGroup
		} = this.props;

		if(this.formikProps && selectedGroup?.id !== this.formikProps.values.group?.id) {

			const values: MediaItemInternal = {
				...this.formikProps.values,
				group: selectedGroup
			};

			if(!selectedGroup) {

				values.orderInGroup = undefined;
			}

			this.formikProps.setValues(values);
		}
	}

	/**
	 * Checks if we need to set the current own platform, selected from another screen
	 */
	private checkLoadSelectedOwnPlatform(): void {

		const {
			selectedOwnPlatform
		} = this.props;

		if(this.formikProps && selectedOwnPlatform?.id !== this.formikProps.values.ownPlatform?.id) {

			const values: MediaItemInternal = {
				...this.formikProps.values,
				ownPlatform: selectedOwnPlatform
			};

			this.formikProps.setValues(values);
		}
	}

	/**
	 * Checks if wee need to ask for same-name confirmation
	 */
	private checkAskSameNameConfirmation(): void {

		const {
			sameNameConfirmationRequested,
			saveMediaItem
		} = this.props;

		if(this.formikProps && sameNameConfirmationRequested) {

			const title = i18n.t('mediaItem.common.alert.addSameName.title');
			const message = i18n.t(`mediaItem.common.alert.addSameName.message.${this.formikProps.values.mediaType}`);
			ConfirmAlert.alert(title, message, () => {

				if(this.formikProps) {

					saveMediaItem(this.formikProps.values, true);
				}
			});
		}
	}
}

/**
 * CommonMediaItemFormComponent's input props
 */
export type CommonMediaItemFormComponentInputMain = {

	/**
	 * The initial media item values for the form inputs
	 */
	initialValues: MediaItemInternal;

	/**
	 * If set, the media item catalog details are requested to be loaded into the form
	 */
	loadCatalogDetails?: CatalogMediaItemInternal;

	/**
	 * The currently selected group, if any
	 */
	selectedGroup?: GroupInternal;

	/**
	 * The currently selected own platform, if any
	 */
	selectedOwnPlatform?: OwnPlatformInternal;

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;

	/**
	 * If an external component requests confirmation to save the media item even if there's already one with the same name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * CommonMediaItemFormComponent's input props
 */
export type CommonMediaItemFormComponentInputConfig = {

	/**
	 * @override
	 */
	children: (props: FormikProps<MediaItemInternal>) => ReactNode;

	/**
	 * The default empty catalog media item
	 */
	defaultCatalogItem: CatalogMediaItemInternal;

	/**
	 * The media item form validation schema
	 */
	validationSchema: ObjectSchema<MediaItemInternal>;
}

/**
 * CommonMediaItemFormComponent's input props
 */
export type CommonMediaItemFormComponentInput = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentInputConfig;

/**
 * CommonMediaItemFormComponent's output props
 */
export type CommonMediaItemFormComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to save the media item, after form validation is successful
	 * @param mediaItem the media item to be saved
	 * @param confirmSameName if the user confirmed to create a media item with the same name as an existing one
	 */
	saveMediaItem: (mediaItem: MediaItemInternal, confirmSameName: boolean) => void;

	/**
	 * Notification for catalog details load event. This callback can modify the new values for specific actions.
	 * @param currentValues the current form values
	 * @param newValues the new form values after loading the new catalog details
	 */
	onLoadCatalogDetails?: (currentValues: MediaItemInternal, newValues: MediaItemInternal) => void;
};

/**
 * CommonMediaItemFormComponent's props
 */
export type CommonMediaItemFormComponentProps = CommonMediaItemFormComponentInput & CommonMediaItemFormComponentOutput;
