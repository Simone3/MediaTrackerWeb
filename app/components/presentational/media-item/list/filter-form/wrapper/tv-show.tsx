import React, { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { TvShowFilterFormValues, tvShowFilterFormMapper, tvShowFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';
import { TvShowFilterFormViewComponent } from 'app/components/presentational/media-item/list/filter-form/view/tv-show';
import { TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';
import { MediaItemFilterFormComponentInput, MediaItemFilterFormComponentOutput } from 'app/components/presentational/media-item/list/filter-form/wrapper';

/**
 * Presentational component that handles the Formik wrapper component for the TV show filter form
 */
export class TvShowFilterFormComponent extends Component<TvShowFilterFormComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			initialFilter,
			initialSortBy,
			submitFilter
		} = this.props;

		const initialValues: TvShowFilterFormValues = tvShowFilterFormMapper.toFormValues(initialFilter, initialSortBy as TvShowSortByInternal[]);

		return (
			<Formik<TvShowFilterFormValues>
				onSubmit={(result) => {
					
					const filter = tvShowFilterFormMapper.toFilterModel(result);
					const sortBy = tvShowFilterFormMapper.toSortByModel(result);
					submitFilter(filter, sortBy);
				}}
				initialValues={initialValues}
				initialErrors={{}}
				validationSchema={tvShowFilterFormValidationSchema}
				validateOnMount={true}>
				{(formikProps: FormikProps<TvShowFilterFormValues>) => {
					
					return (
						<TvShowFilterFormViewComponent {...formikProps} />
					);
				}}
			</Formik>
		);
	}
}

/**
 * TvShowFilterFormComponent's input props
 */
export type TvShowFilterFormComponentInput = MediaItemFilterFormComponentInput;

/**
 * TvShowFilterFormComponent's output props
 */
export type TvShowFilterFormComponentOutput = MediaItemFilterFormComponentOutput;

/**
 * TvShowFilterFormComponent's props
 */
export type TvShowFilterFormComponentProps = TvShowFilterFormComponentInput & TvShowFilterFormComponentOutput;
