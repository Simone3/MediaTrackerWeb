import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFilterFormViewComponent, MediaItemFilterFormViewComponentInput, MediaItemFilterFormViewComponentOutput } from 'app/components/presentational/media-item/list/filter-form/view/media-item';
import { VideogameFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/videogame';

/**
 * Presentational component that contains all videogame filter form input fields, all handled by the Formik container component
 */
export class VideogameFilterFormViewComponent extends Component<VideogameFilterFormViewComponentProps> {

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
 * VideogameFilterFormViewComponent's input props
 */
export type VideogameFilterFormViewComponentInput = MediaItemFilterFormViewComponentInput;

/**
 * VideogameFilterFormViewComponent's output props
 */
export type VideogameFilterFormViewComponentOutput = MediaItemFilterFormViewComponentOutput;

/**
 * All props of VideogameFilterFormViewComponent
 */
export type VideogameFilterFormViewComponentProps = FormikProps<VideogameFilterFormValues> & VideogameFilterFormViewComponentInput & VideogameFilterFormViewComponentOutput;
