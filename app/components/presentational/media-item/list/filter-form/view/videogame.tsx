import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { VideogameFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/videogame';
import { MediaItemFilterFormViewComponent, MediaItemFilterFormViewComponentInput, MediaItemFilterFormViewComponentOutput } from './media-item';

/**
 * Presentational component that contains all videogame filter form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const VideogameFilterFormViewComponent = (props: VideogameFilterFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFilterFormViewComponent
			{...props}
		/>
	);
};

/**
 * VideogameFilterFormViewComponent's props
 */
export type VideogameFilterFormViewComponentProps = FormikProps<VideogameFilterFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
