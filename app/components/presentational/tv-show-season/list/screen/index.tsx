import React, { Component, ReactNode } from 'react';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "TV show seasons list" screen, that lists all seasons of a TV show
 */
export class TvShowSeasonsListScreenComponent extends Component<TvShowSeasonsListScreenComponentInput & TvShowSeasonsListScreenComponentOutput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			tvShowSeasons
		} = this.props;

		return (
			<section className='tv-show-seasons-screen'>
				<div className='tv-show-seasons-header'>
					<h1 className='tv-show-seasons-title'>{i18n.t('tvShowSeason.list.title')}</h1>
					<div className='tv-show-seasons-actions'>
						<button type='button' className='tv-show-seasons-button tv-show-seasons-button-secondary' onClick={this.props.goBack}>
							Back
						</button>
						<button type='button' className='tv-show-seasons-button tv-show-seasons-button-primary' onClick={this.props.completeHandling}>
							Done
						</button>
					</div>
				</div>
				<ul className='tv-show-seasons-list'>
					{tvShowSeasons.map((tvShowSeason: TvShowSeasonInternal) => {
						const episodesNumber = tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
						const watchedEpisodesNumber = tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;
						const completeDisabled = !episodesNumber || watchedEpisodesNumber === episodesNumber;

						return (
							<li key={String(tvShowSeason.number)} className='tv-show-seasons-row'>
								<button
									type='button'
									className='tv-show-seasons-row-main'
									onClick={() => {
										this.props.editTvShowSeason(tvShowSeason);
									}}>
									<span className='tv-show-seasons-row-title'>
										{i18n.t('tvShowSeason.list.row.main', {
											seasonNumber: tvShowSeason.number
										})}
									</span>
									<span className='tv-show-seasons-row-subtitle'>
										{i18n.t('tvShowSeason.list.row.secondary', {
											episodesNumber: episodesNumber,
											watchedEpisodesNumber: watchedEpisodesNumber
										})}
									</span>
								</button>
								<div className='tv-show-seasons-row-actions'>
									<button
										type='button'
										className='tv-show-seasons-row-action'
										disabled={completeDisabled}
										onClick={() => {
											this.props.completeTvShowSeason(tvShowSeason);
										}}>
										{i18n.t('tvShowSeason.list.complete')}
									</button>
									<button
										type='button'
										className='tv-show-seasons-row-action'
										onClick={() => {
											this.requestDeleteTvShowSeason(tvShowSeason);
										}}>
										{i18n.t('tvShowSeason.list.delete')}
									</button>
								</div>
							</li>
						);
					})}
				</ul>
				{tvShowSeasons.length === 0 && <p className='tv-show-seasons-empty'>{i18n.t('tvShowSeason.list.empty')}</p>}
				<FABComponent
					text='+'
					onPress={() => {
						this.props.loadNewTvShowSeasonDetails();
					}}
				/>
			</section>
		);
	}

	/**
	 * Handles delete flow for a TV show season
	 * @param tvShowSeason the season
	 */
	private requestDeleteTvShowSeason(tvShowSeason: TvShowSeasonInternal): void {
		const title = i18n.t('tvShowSeason.common.alert.delete.title');
		const message = i18n.t('tvShowSeason.common.alert.delete.message', { seasonNumber: tvShowSeason.number });

		// Keep native confirm for phase 2 to preserve existing blocking UX with minimal migration risk.
		// eslint-disable-next-line no-alert
		const confirmed = window.confirm(`${title}\n\n${message}`);
		if(confirmed) {
			this.props.deleteTvShowSeason(tvShowSeason);
		}
	}
}

/**
 * TvShowSeasonsListScreenComponent's input props
 */
export type TvShowSeasonsListScreenComponentInput = {
	/**
	 * Current TV show seasons list
	 */
	tvShowSeasons: TvShowSeasonInternal[];
}

/**
 * TvShowSeasonsListScreenComponent's output props
 */
export type TvShowSeasonsListScreenComponentOutput = {
	/**
	 * Callback to load the details of a new season
	 */
	loadNewTvShowSeasonDetails: () => void;

	/**
	 * Callback to edit a season
	 */
	editTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback to delete a season
	 */
	deleteTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback to mark a season as complete
	 */
	completeTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback to complete seasons handling
	 */
	completeHandling: () => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}
