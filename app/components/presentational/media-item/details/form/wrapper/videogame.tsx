import { ReactElement } from 'react';
import { ObjectSchema } from 'yup';
import { MediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { videogameFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/videogame';
import { VideogameFormViewComponent } from 'app/components/presentational/media-item/details/form/view/videogame';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';

/**
 * Presentational component that handles the Formik wrapper component for the videogame form
 * @param props the component props
 * @returns the component
 */
export const VideogameFormComponent = (props: VideogameFormComponentProps): ReactElement => {
	return (
		<CommonMediaItemFormComponent
			{...props}
			validationSchema={videogameFormValidationSchema as ObjectSchema<MediaItemDetailsFormValues>}>
			{(formikProps, requestCatalogReload) => {
				return (
					<VideogameFormViewComponent
						{...formikProps}
						catalogSearchResults={props.catalogSearchResults}
						notifyFormStatus={props.notifyFormStatus}
						persistFormDraft={props.persistFormDraft}
						requestGroupSelection={props.requestGroupSelection}
						requestOwnPlatformSelection={props.requestOwnPlatformSelection}
						searchMediaItemsCatalog={props.searchMediaItemsCatalog}
						loadMediaItemCatalogDetails={props.loadMediaItemCatalogDetails}
						resetMediaItemsCatalogSearch={props.resetMediaItemsCatalogSearch}
						requestCatalogReload={requestCatalogReload}
					/>
				);
			}}
		</CommonMediaItemFormComponent>
	);
};

/**
 * VideogameFormComponent's props
 */
export type VideogameFormComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput;
