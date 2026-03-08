import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { TvShowFormViewComponent } from 'app/components/presentational/media-item/details/form/view/tv-show';
import { TvShowInternal, DEFAULT_CATALOG_TV_SHOW, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { tvShowFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/tv-show';

/**
 * Presentational component that handles the Formik wrapper component for the TV show form
 */
export class TvShowFormComponent extends Component<TvShowFormComponentProps> {

	private formikProps?: FormikProps<TvShowInternal>;
	private loadedSeasonsTimestamp?: Date;

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		// Check if we need to perform some operations during this render
		this.checkLoadSeasons();
	}

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
				defaultCatalogItem={DEFAULT_CATALOG_TV_SHOW}
				validationSchema={tvShowFormValidationSchema}
				onLoadCatalogDetails={this.onLoadCatalogDetails}>
				{(formikProps: FormikProps<TvShowInternal>) => {

					this.formikProps = formikProps;
					return (
						<TvShowFormViewComponent
							{...formikProps}
							saveRequested={saveRequested}
							notifyFormStatus={notifyFormStatus}
						/>
					);
				}}
			</CommonMediaItemFormComponent>
		);
	}

	/**
	 * Checks if we need to (re)load the list of seasons, after they have been updated by an external component
	 */
	private checkLoadSeasons(): void {

		const {
			loadSeasons,
			loadSeasonsTimestamp
		} = this.props;
		
		// If we have a new seasons list...
		if(this.formikProps && loadSeasonsTimestamp && loadSeasonsTimestamp !== this.loadedSeasonsTimestamp) {
			
			this.loadedSeasonsTimestamp = loadSeasonsTimestamp;

			// Reload the list of seasons
			const values: TvShowInternal = {
				...this.formikProps.values,
				seasons: loadSeasons.length > 0 ? loadSeasons : undefined
			};

			// Commit the new data to the Formik properties
			this.formikProps.setValues(values);
		}
	}

	/**
	 * Custom callback for catalog details load event
	 * @param currentValues the current form values
	 * @param newValues the new form values after loading the new catalog details
	 */
	private onLoadCatalogDetails(currentValues: TvShowInternal, newValues: TvShowInternal): void {

		// currentSeasons contains the list of seasons possibly with user data (e.g. watchedEpisodesNumber), newSeasons contains the vanilla catalog seasons
		const currentSeasons = currentValues.seasons;
		const newSeasons = newValues.seasons;

		// For each catalog season, get the corresponding current season and re-set all user-modified fields
		if(newSeasons && newSeasons.length > 0 && currentSeasons && currentSeasons.length > 0) {

			for(const newSeason of newSeasons) {

				const correnspondingCurrentSeasons = currentSeasons.filter((currentSeason) => {
					return currentSeason.number === newSeason.number;
				});

				if(correnspondingCurrentSeasons.length === 1) {

					const correnspondingCurrentSeason = correnspondingCurrentSeasons[0];
					
					newSeason.watchedEpisodesNumber = correnspondingCurrentSeason.watchedEpisodesNumber;
				}
			}
		}
	}
}

/**
 * TvShowFormComponent's input props
 */
export type TvShowFormComponentInput = CommonMediaItemFormComponentInputMain & {

	/**
	 * List of seasons to be loaded into Formik (updated by an external component)
	 */
	loadSeasons: TvShowSeasonInternal[];

	/**
	 * Check field for `loadSeasons` to see if an update has been published after the previous reload
	 */
	loadSeasonsTimestamp: Date | undefined;
};

/**
 * TvShowFormComponent's output props
 */
export type TvShowFormComponentOutput = CommonMediaItemFormComponentOutput;

/**
 * TvShowFormComponent's props
 */
export type TvShowFormComponentProps = TvShowFormComponentInput & TvShowFormComponentOutput;
