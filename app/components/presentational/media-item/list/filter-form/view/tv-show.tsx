import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { TvShowFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';
import { MediaItemFilterFormViewComponent, MediaItemFilterFormViewComponentInput, MediaItemFilterFormViewComponentOutput } from './media-item';

/**
 * Presentational component that contains all TV show filter form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const TvShowFilterFormViewComponent = (props: TvShowFilterFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFilterFormViewComponent
			{...props}
		/>
	);
};

/**
 * TvShowFilterFormViewComponent's props
 */
export type TvShowFilterFormViewComponentProps = FormikProps<TvShowFilterFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
