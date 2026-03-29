import { ReactElement } from 'react';
import { ObjectSchema } from 'yup';
import { BookFormViewComponent } from 'app/components/presentational/media-item/details/form/view/book';
import { bookFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/book';
import { MediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';

/**
 * Presentational component that handles the Formik wrapper component for the book form
 * @param props the component props
 * @returns the component
 */
export const BookFormComponent = (props: BookFormComponentProps): ReactElement => {
	return (
		<CommonMediaItemFormComponent
			{...props}
			validationSchema={bookFormValidationSchema as ObjectSchema<MediaItemDetailsFormValues>}>
			{(formikProps, requestCatalogReload) => {
				return (
					<BookFormViewComponent
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
 * BookFormComponent's props
 */
export type BookFormComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput;
