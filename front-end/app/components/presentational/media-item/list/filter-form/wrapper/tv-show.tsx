import { ReactElement } from 'react';
import { Formik, FormikProps } from 'formik';
import { MediaItemFilterFormComponentInput, MediaItemFilterFormComponentOutput } from './media-item';
import { TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';
import { TvShowFilterFormValues, tvShowFilterFormMapper, tvShowFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';
import { TvShowFilterFormViewComponent } from 'app/components/presentational/media-item/list/filter-form/view/tv-show';

/**
 * Presentational component that handles the Formik wrapper component for the TV show filter form
 * @param props the component props
 * @returns the component
 */
export const TvShowFilterFormComponent = (props: TvShowFilterFormComponentProps): ReactElement => {
	const initialValues = tvShowFilterFormMapper.toFormValues(props.initialFilter, props.initialSortBy as TvShowSortByInternal[]);

	return (
		<Formik<TvShowFilterFormValues>
			initialValues={initialValues}
			initialErrors={{}}
			validationSchema={tvShowFilterFormValidationSchema}
			validateOnMount={true}
			enableReinitialize={true}
			onSubmit={(values) => {
				props.submitFilter(tvShowFilterFormMapper.toFilterModel(values), tvShowFilterFormMapper.toSortByModel(values));
			}}>
			{(formikProps: FormikProps<TvShowFilterFormValues>) => {
				return (
					<TvShowFilterFormViewComponent
						{...formikProps}
						close={props.close}
					/>
				);
			}}
		</Formik>
	);
};

/**
 * TvShowFilterFormComponent's props
 */
export type TvShowFilterFormComponentProps = MediaItemFilterFormComponentInput & MediaItemFilterFormComponentOutput;
