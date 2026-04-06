import { ReactElement } from 'react';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';
import { movieFormValidationSchema, normalizeMovieFormValues } from 'app/components/presentational/media-item/details/form/data/movie';
import { DEFAULT_CATALOG_MOVIE, MovieInternal } from 'app/data/models/internal/media-items/movie';
import { MovieFormViewComponent } from 'app/components/presentational/media-item/details/form/view/movie';

/**
 * Presentational component that handles the Formik wrapper component for the movie form
 * @param props the component props
 * @returns the component
 */
export const MovieFormComponent = (props: MovieFormComponentProps): ReactElement => {
	return (
		<CommonMediaItemFormComponent<MovieInternal>
			{...props}
			defaultCatalogItem={DEFAULT_CATALOG_MOVIE}
			normalizeFormValues={normalizeMovieFormValues}
			validationSchema={movieFormValidationSchema}>
			{(formikProps, requestCatalogReload) => {
				return (
					<MovieFormViewComponent
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
 * MovieFormComponent's props
 */
export type MovieFormComponentProps = CommonMediaItemFormComponentInputMain<MovieInternal> & CommonMediaItemFormComponentOutput;
