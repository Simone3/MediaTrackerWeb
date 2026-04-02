import { ReactElement } from 'react';
import { Formik, FormikProps } from 'formik';
import { VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { VideogameFilterFormValues, videogameFilterFormMapper, videogameFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/videogame';
import { VideogameFilterFormViewComponent } from 'app/components/presentational/media-item/list/filter-form/view/videogame';
import { MediaItemFilterFormComponentInput, MediaItemFilterFormComponentOutput } from './media-item';

/**
 * Presentational component that handles the Formik wrapper component for the videogame filter form
 * @param props the component props
 * @returns the component
 */
export const VideogameFilterFormComponent = (props: VideogameFilterFormComponentProps): ReactElement => {
	const initialValues = videogameFilterFormMapper.toFormValues(props.initialFilter, props.initialSortBy as VideogameSortByInternal[]);

	return (
		<Formik<VideogameFilterFormValues>
			initialValues={initialValues}
			initialErrors={{}}
			validationSchema={videogameFilterFormValidationSchema}
			validateOnMount={true}
			enableReinitialize={true}
			onSubmit={(values) => {
				props.submitFilter(videogameFilterFormMapper.toFilterModel(values), videogameFilterFormMapper.toSortByModel(values));
			}}>
			{(formikProps: FormikProps<VideogameFilterFormValues>) => {
				return (
					<VideogameFilterFormViewComponent
						{...formikProps}
						close={props.close}
					/>
				);
			}}
		</Formik>
	);
};

/**
 * VideogameFilterFormComponent's props
 */
export type VideogameFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
