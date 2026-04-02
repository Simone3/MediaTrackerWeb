import { ReactElement } from 'react';
import { Formik, FormikProps } from 'formik';
import { MovieSortByInternal } from 'app/data/models/internal/media-items/movie';
import { MovieFilterFormValues, movieFilterFormMapper, movieFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/movie';
import { MovieFilterFormViewComponent } from 'app/components/presentational/media-item/list/filter-form/view/movie';
import { MediaItemFilterFormComponentInput, MediaItemFilterFormComponentOutput } from '.';

/**
 * Presentational component that handles the Formik wrapper component for the movie filter form
 * @param props the component props
 * @returns the component
 */
export const MovieFilterFormComponent = (props: MovieFilterFormComponentProps): ReactElement => {
	const initialValues = movieFilterFormMapper.toFormValues(props.initialFilter, props.initialSortBy as MovieSortByInternal[]);

	return (
		<Formik<MovieFilterFormValues>
			initialValues={initialValues}
			initialErrors={{}}
			validationSchema={movieFilterFormValidationSchema}
			validateOnMount={true}
			enableReinitialize={true}
			onSubmit={(values) => {
				props.submitFilter(movieFilterFormMapper.toFilterModel(values), movieFilterFormMapper.toSortByModel(values));
			}}>
			{(formikProps: FormikProps<MovieFilterFormValues>) => {
				return (
					<MovieFilterFormViewComponent
						{...formikProps}
						close={props.close}
					/>
				);
			}}
		</Formik>
	);
};

/**
 * MovieFilterFormComponent's props
 */
export type MovieFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
