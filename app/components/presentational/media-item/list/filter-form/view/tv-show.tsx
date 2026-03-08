import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFilterFormViewComponent, MediaItemFilterFormViewComponentInput, MediaItemFilterFormViewComponentOutput } from 'app/components/presentational/media-item/list/filter-form/view/media-item';
import { TvShowFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';

/**
 * Presentational component that contains all TV show filter form input fields, all handled by the Formik container component
 */
export class TvShowFilterFormViewComponent extends Component<TvShowFilterFormViewComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<MediaItemFilterFormViewComponent {...this.props} />
		);
	}
}

/**
 * TvShowFilterFormViewComponent's input props
 */
export type TvShowFilterFormViewComponentInput = MediaItemFilterFormViewComponentInput;

/**
 * TvShowFilterFormViewComponent's output props
 */
export type TvShowFilterFormViewComponentOutput = MediaItemFilterFormViewComponentOutput;

/**
 * All props of TvShowFilterFormViewComponent
 */
export type TvShowFilterFormViewComponentProps = FormikProps<TvShowFilterFormValues> & TvShowFilterFormViewComponentInput & TvShowFilterFormViewComponentOutput;
