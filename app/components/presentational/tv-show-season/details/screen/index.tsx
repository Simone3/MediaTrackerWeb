import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { EntityDetailsFrameComponent } from 'app/components/presentational/generic/entity-details-frame';
import { tvShowSeasonValidationSchema } from 'app/components/presentational/tv-show-season/details/form/data';
import { TvShowSeasonFormViewComponent } from 'app/components/presentational/tv-show-season/details/form/view';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

const TV_SHOW_SEASON_DETAILS_ACCENT = 'var(--color-tv-show-season-accent-default)';
const TV_SHOW_SEASON_DETAILS_ACTIVE_ACCENT = 'var(--color-tv-show-season-accent-active)';
const TV_SHOW_SEASON_DETAILS_COMPLETE_ACCENT = 'var(--color-tv-show-season-accent-complete)';

/**
 * Presentational component that contains the whole "TV show season details" screen, that works as the "add new TV show season", "update TV show season" and
 * "view TV show season data" sections
 */
export class TvShowSeasonDetailsScreenComponent extends Component<TvShowSeasonDetailsScreenComponentInput & TvShowSeasonDetailsScreenComponentOutput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			tvShowSeason,
			addingNewSeason
		} = this.props;

		return (
			<Formik<TvShowSeasonInternal>
				initialValues={tvShowSeason}
				validationSchema={tvShowSeasonValidationSchema}
				validateOnMount={true}
				enableReinitialize={true}
				onSubmit={(values) => {
					this.props.saveTvShowSeason(values);
				}}>
				{(formikProps: FormikProps<TvShowSeasonInternal>) => {
					const title = addingNewSeason ?
						i18n.t('tvShowSeason.details.title.new') :
						i18n.t('tvShowSeason.details.title.existing', { seasonNumber: formikProps.values.number });
					const seasonSummary = this.getSeasonSummary(formikProps.values);

					return (
						<EntityDetailsFrameComponent
							screenClassName='tv-show-season-details-screen'
							accentColor={this.getSeasonAccent(formikProps.values)}
							title={title}
							subtitle={seasonSummary}
							saveLabel={i18n.t('common.buttons.save')}
							saveDisabled={!formikProps.isValid}
							onSave={() => {
								void formikProps.submitForm();
							}}
							onSubmit={formikProps.handleSubmit}>
							<TvShowSeasonFormViewComponent
								{...formikProps}
								addingNewSeason={addingNewSeason}
								notifyFormStatus={this.props.notifyFormStatus}
							/>
						</EntityDetailsFrameComponent>
					);
				}}
			</Formik>
		);
	}

	/**
	 * Formats the current season summary copy
	 * @param tvShowSeason current season values
	 * @returns summary label
	 */
	private getSeasonSummary(tvShowSeason: TvShowSeasonInternal): string {
		if(tvShowSeason.number === undefined && tvShowSeason.episodesNumber === undefined && tvShowSeason.watchedEpisodesNumber === undefined) {
			return i18n.t('tvShowSeason.list.emptyHint');
		}

		return i18n.t('tvShowSeason.list.row.secondary', {
			episodesNumber: tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0,
			watchedEpisodesNumber: tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0
		});
	}

	/**
	 * Resolves the accent color for the current season
	 * @param tvShowSeason current season values
	 * @returns accent color
	 */
	private getSeasonAccent(tvShowSeason: TvShowSeasonInternal): string {
		const episodesNumber = tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
		const watchedEpisodesNumber = tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;

		if(episodesNumber > 0 && watchedEpisodesNumber === episodesNumber) {
			return TV_SHOW_SEASON_DETAILS_COMPLETE_ACCENT;
		}

		if(watchedEpisodesNumber > 0) {
			return TV_SHOW_SEASON_DETAILS_ACTIVE_ACCENT;
		}

		return TV_SHOW_SEASON_DETAILS_ACCENT;
	}
}

/**
 * TvShowSeasonDetailsScreenComponent's input props
 */
export type TvShowSeasonDetailsScreenComponentInput = {
	/**
	 * Current TV show season
	 */
	tvShowSeason: TvShowSeasonInternal;

	/**
	 * If true, we are adding a new season
	 */
	addingNewSeason: boolean;
};

/**
 * TvShowSeasonDetailsScreenComponent's output props
 */
export type TvShowSeasonDetailsScreenComponentOutput = {
	/**
	 * Callback to save current season
	 */
	saveTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
};
