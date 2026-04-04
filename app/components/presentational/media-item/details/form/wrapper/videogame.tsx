import { ReactElement } from 'react';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';
import { DEFAULT_CATALOG_VIDEOGAME, VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { videogameFormValidationSchema, normalizeVideogameFormValues } from 'app/components/presentational/media-item/details/form/data/videogame';
import { VideogameFormViewComponent } from 'app/components/presentational/media-item/details/form/view/videogame';

/**
 * Presentational component that handles the Formik wrapper component for the videogame form
 * @param props the component props
 * @returns the component
 */
export const VideogameFormComponent = (props: VideogameFormComponentProps): ReactElement => {
	return (
		<CommonMediaItemFormComponent
			<VideogameInternal>
			{...props}
			defaultCatalogItem={DEFAULT_CATALOG_VIDEOGAME}
			normalizeFormValues={normalizeVideogameFormValues}
			validationSchema={videogameFormValidationSchema}>
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
export type VideogameFormComponentProps = CommonMediaItemFormComponentInputMain<VideogameInternal> & CommonMediaItemFormComponentOutput;
