import { ReactElement } from 'react';
import { ObjectSchema } from 'yup';
import { movieFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/movie';
import { MediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { MovieFormViewComponent } from 'app/components/presentational/media-item/details/form/view/movie';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';

/**
 * Presentational component that handles the Formik wrapper component for the movie form
 * @param props the component props
 * @returns the component
 */
export const MovieFormComponent = (props: MovieFormComponentProps): ReactElement => {
	return (
		<CommonMediaItemFormComponent
			{...props}
			validationSchema={movieFormValidationSchema as ObjectSchema<MediaItemDetailsFormValues>}>
			{(formikProps, requestCatalogReload) => {
				return (
					<MovieFormViewComponent
						{...formikProps}
						baseMediaItem={props.baseMediaItem}
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
 * MovieFormComponent's props
 */
export type MovieFormComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput;
