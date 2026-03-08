import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MovieFormViewComponent } from 'app/components/presentational/media-item/details/form/view/movie';
import { MovieInternal, DEFAULT_CATALOG_MOVIE } from 'app/data/models/internal/media-items/movie';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { movieFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/movie';

/**
 * Presentational component that handles the Formik wrapper component for the movie form
 */
export class MovieFormComponent extends Component<MovieFormComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			saveRequested,
			notifyFormStatus
		} = this.props;

		return (
			<CommonMediaItemFormComponent
				{...this.props}
				defaultCatalogItem={DEFAULT_CATALOG_MOVIE}
				validationSchema={movieFormValidationSchema}>
				{(formikProps: FormikProps<MovieInternal>) => {

					return (
						<MovieFormViewComponent
							{...formikProps}
							saveRequested={saveRequested}
							notifyFormStatus={notifyFormStatus}
						/>
					);
				}}
			</CommonMediaItemFormComponent>
		);
	}
}

/**
 * MovieFormComponent's input props
 */
export type MovieFormComponentInput = CommonMediaItemFormComponentInputMain;

/**
 * MovieFormComponent's output props
 */
export type MovieFormComponentOutput = CommonMediaItemFormComponentOutput;

/**
 * MovieFormComponent's props
 */
export type MovieFormComponentProps = MovieFormComponentInput & MovieFormComponentOutput;
