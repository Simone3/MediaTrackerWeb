import { ReactElement } from 'react';
import { Formik, FormikProps } from 'formik';
import { BookSortByInternal } from 'app/data/models/internal/media-items/book';
import { BookFilterFormValues, bookFilterFormMapper, bookFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/book';
import { BookFilterFormViewComponent } from 'app/components/presentational/media-item/list/filter-form/view/book';
import { MediaItemFilterFormComponentInput, MediaItemFilterFormComponentOutput } from './media-item';

/**
 * Presentational component that handles the Formik wrapper component for the book filter form
 * @param props the component props
 * @returns the component
 */
export const BookFilterFormComponent = (props: BookFilterFormComponentProps): ReactElement => {
	const initialValues = bookFilterFormMapper.toFormValues(props.initialFilter, props.initialSortBy as BookSortByInternal[]);

	return (
		<Formik<BookFilterFormValues>
			initialValues={initialValues}
			initialErrors={{}}
			validationSchema={bookFilterFormValidationSchema}
			validateOnMount={true}
			enableReinitialize={true}
			onSubmit={(values) => {
				props.submitFilter(bookFilterFormMapper.toFilterModel(values), bookFilterFormMapper.toSortByModel(values));
			}}>
			{(formikProps: FormikProps<BookFilterFormValues>) => {
				return (
					<BookFilterFormViewComponent
						{...formikProps}
						close={props.close}
					/>
				);
			}}
		</Formik>
	);
};

/**
 * BookFilterFormComponent's props
 */
export type BookFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
