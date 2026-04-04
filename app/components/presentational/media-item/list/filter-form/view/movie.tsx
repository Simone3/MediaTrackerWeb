import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFilterFormViewComponent, MediaItemFilterFormViewComponentInput, MediaItemFilterFormViewComponentOutput } from './media-item';
import { MovieFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/movie';

/**
 * Presentational component that contains all movie filter form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const MovieFilterFormViewComponent = (props: MovieFilterFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFilterFormViewComponent
			{...props}
		/>
	);
};

/**
 * MovieFilterFormViewComponent's props
 */
export type MovieFilterFormViewComponentProps = FormikProps<MovieFilterFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
