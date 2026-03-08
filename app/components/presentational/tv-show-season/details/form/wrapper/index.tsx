import React, { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { TvShowSeasonFormViewComponent } from 'app/components/presentational/tv-show-season/details/form/view';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { tvShowSeasonValidationSchema } from 'app/components/presentational/tv-show-season/details/form/data';

/**
 * Presentational component that handles the Formik wrapper component for the TV show season form
 */
export class TvShowSeasonFormComponent extends Component<TvShowSeasonFormComponentInput & TvShowSeasonFormComponentOutput> {

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<Formik<TvShowSeasonInternal>
				onSubmit={(result) => {
					this.props.saveTvShowSeason(result);
				}}
				initialValues={this.props.initialValues}
				validationSchema={tvShowSeasonValidationSchema}
				validateOnMount={true}>
				{(formikProps: FormikProps<TvShowSeasonInternal>) => {

					return (
						<TvShowSeasonFormViewComponent
							{...formikProps}
							saveRequested={this.props.saveRequested}
							addingNewSeason={this.props.addingNewSeason}
							notifyFormStatus={this.props.notifyFormStatus}
						/>
					);
				}}
			</Formik>
		);
	}
}

/**
 * TvShowSeasonFormComponent's input props
 */
export type TvShowSeasonFormComponentInput = {

	/**
	 * The initial TV show season values for the form inputs
	 */
	initialValues: TvShowSeasonInternal;

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;

	/**
	 * If we are adding a new season (true) or updating an existing one (false)
	 */
	addingNewSeason: boolean;
}

/**
 * TvShowSeasonFormComponent's output props
 */
export type TvShowSeasonFormComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to save the TV show season, after form validation is successful
	 * @param tvShowSeason the season to be saved
	 */
	saveTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;
}
