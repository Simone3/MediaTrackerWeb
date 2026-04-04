import { ReactElement } from 'react';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';
import { BookFormViewComponent } from 'app/components/presentational/media-item/details/form/view/book';
import { bookFormValidationSchema, normalizeBookFormValues } from 'app/components/presentational/media-item/details/form/data/book';
import { BookInternal, DEFAULT_CATALOG_BOOK } from 'app/data/models/internal/media-items/book';

/**
 * Presentational component that handles the Formik wrapper component for the book form
 * @param props the component props
 * @returns the component
 */
export const BookFormComponent = (props: BookFormComponentProps): ReactElement => {
	return (
		<CommonMediaItemFormComponent
			<BookInternal>
			{...props}
			defaultCatalogItem={DEFAULT_CATALOG_BOOK}
			normalizeFormValues={normalizeBookFormValues}
			validationSchema={bookFormValidationSchema}>
			{(formikProps, requestCatalogReload) => {
				return (
					<BookFormViewComponent
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
 * BookFormComponent's props
 */
export type BookFormComponentProps = CommonMediaItemFormComponentInputMain<BookInternal> & CommonMediaItemFormComponentOutput;
