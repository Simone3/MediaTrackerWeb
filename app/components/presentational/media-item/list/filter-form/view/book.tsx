import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFilterFormViewComponent, MediaItemFilterFormViewComponentInput, MediaItemFilterFormViewComponentOutput } from './media-item';
import { BookFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/book';

/**
 * Presentational component that contains all book filter form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const BookFilterFormViewComponent = (props: BookFilterFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFilterFormViewComponent
			{...props}
		/>
	);
};

/**
 * BookFilterFormViewComponent's props
 */
export type BookFilterFormViewComponentProps = FormikProps<BookFilterFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
