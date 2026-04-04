import { CSSProperties, Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { EntityManagementScreenComponent } from 'app/components/presentational/generic/entity-management-screen';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import seasonIcon from 'app/resources/images/ic_input_season_number.svg';
import { i18n } from 'app/utilities/i18n';

const TV_SHOW_SEASONS_SCREEN_ACCENT = '#ffb067';
const TV_SHOW_SEASONS_SCREEN_ACTIVE_ACCENT = '#7db4ff';
const TV_SHOW_SEASONS_SCREEN_COMPLETE_ACCENT = '#7ad18f';

/**
 * Presentational component that contains the whole "TV show seasons list" screen, that lists all seasons of a TV show
 */
export class TvShowSeasonsListScreenComponent extends Component<TvShowSeasonsListScreenComponentInput & TvShowSeasonsListScreenComponentOutput, TvShowSeasonsListScreenComponentState> {
	public state: TvShowSeasonsListScreenComponentState = {
		pendingDeleteTvShowSeason: undefined
	};

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			tvShowSeasons
		} = this.props;
		const {
			pendingDeleteTvShowSeason
		} = this.state;
		const countLabel = tvShowSeasons.length === 1 ?
			i18n.t('tvShowSeason.list.count.single') :
			i18n.t('tvShowSeason.list.count.multiple', { count: tvShowSeasons.length });

		return (
			<>
				<EntityManagementScreenComponent
					screenClassName='tv-show-seasons-screen'
					accentColor={TV_SHOW_SEASONS_SCREEN_ACCENT}
					icon={<img src={seasonIcon} alt='' className='entity-management-screen-icon' />}
					title={i18n.t('tvShowSeason.list.title')}
					countLabel={countLabel}
					addButtonLabel={i18n.t('tvShowSeason.details.title.new')}
					onAdd={this.props.loadNewTvShowSeasonDetails}
					renderHeaderActions={({ defaultAddAction }) => {
						return (
							<div className='entity-management-screen-actions'>
								{defaultAddAction}
								<PillButtonComponent tone='primary' onClick={this.props.completeHandling}>
									{i18n.t('common.buttons.done')}
								</PillButtonComponent>
							</div>
						);
					}}>
					<div className='entity-management-list'>
						{tvShowSeasons.length === 0 ?
							<div className='entity-management-list-empty'>
								<p className='entity-management-list-empty-title'>{i18n.t('tvShowSeason.list.empty')}</p>
								<p className='entity-management-list-empty-copy'>{i18n.t('tvShowSeason.list.emptyHint')}</p>
							</div> :
							<ul className='entity-management-list-items'>
								{tvShowSeasons.map((tvShowSeason: TvShowSeasonInternal) => {
									const episodesNumber = tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
									const watchedEpisodesNumber = tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;
									const completeDisabled = !episodesNumber || watchedEpisodesNumber === episodesNumber;

									return (
										<li
											key={String(tvShowSeason.number)}
											className='entity-management-list-row'
											style={{ '--entity-management-row-accent': this.getSeasonAccent(tvShowSeason) } as CSSProperties}>
											<button
												type='button'
												className='entity-management-list-main'
												onClick={() => {
													this.props.editTvShowSeason(tvShowSeason);
												}}>
												<span className='entity-management-list-badge-shell' aria-hidden={true}>
													<span className='entity-management-list-badge'>{tvShowSeason.number}</span>
												</span>
												<span className='entity-management-list-main-copy'>
													<span className='entity-management-list-name'>
														{i18n.t('tvShowSeason.list.row.main', {
															seasonNumber: tvShowSeason.number
														})}
													</span>
													<span className='entity-management-list-meta'>
														{i18n.t('tvShowSeason.list.row.secondary', {
															episodesNumber: episodesNumber,
															watchedEpisodesNumber: watchedEpisodesNumber
														})}
													</span>
												</span>
												<span className='entity-management-list-progress'>
													<span className='entity-management-list-progress-strong'>{watchedEpisodesNumber}</span>
													/{episodesNumber}
												</span>
											</button>
											<div className='entity-management-list-actions'>
												<button
													type='button'
													className='entity-management-list-action'
													disabled={completeDisabled}
													onClick={() => {
														this.props.completeTvShowSeason(tvShowSeason);
													}}>
													{i18n.t('tvShowSeason.list.complete')}
												</button>
												<button
													type='button'
													className='entity-management-list-action entity-management-list-action-danger'
													onClick={() => {
														this.requestDeleteTvShowSeason(tvShowSeason);
													}}>
													{i18n.t('tvShowSeason.list.delete')}
												</button>
											</div>
										</li>
									);
								})}
							</ul>}
					</div>
				</EntityManagementScreenComponent>
				<ConfirmDialogComponent
					visible={Boolean(pendingDeleteTvShowSeason)}
					title={i18n.t('tvShowSeason.common.alert.delete.title')}
					message={pendingDeleteTvShowSeason ? i18n.t('tvShowSeason.common.alert.delete.message', { seasonNumber: pendingDeleteTvShowSeason.number }) : ''}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						if (pendingDeleteTvShowSeason) {
							this.props.deleteTvShowSeason(pendingDeleteTvShowSeason);
						}
						this.setState({
							pendingDeleteTvShowSeason: undefined
						});
					}}
					onCancel={() => {
						this.setState({
							pendingDeleteTvShowSeason: undefined
						});
					}}
				/>
			</>
		);
	}

	/**
	 * Handles delete flow for a TV show season
	 * @param tvShowSeason the season
	 */
	private requestDeleteTvShowSeason(tvShowSeason: TvShowSeasonInternal): void {
		this.setState({
			pendingDeleteTvShowSeason: tvShowSeason
		});
	}

	/**
	 * Resolves the accent color for the provided season row
	 * @param tvShowSeason the season
	 * @returns the accent color
	 */
	private getSeasonAccent(tvShowSeason: TvShowSeasonInternal): string {
		const episodesNumber = tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
		const watchedEpisodesNumber = tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;

		if (episodesNumber > 0 && watchedEpisodesNumber === episodesNumber) {
			return TV_SHOW_SEASONS_SCREEN_COMPLETE_ACCENT;
		}

		if (watchedEpisodesNumber > 0) {
			return TV_SHOW_SEASONS_SCREEN_ACTIVE_ACCENT;
		}

		return TV_SHOW_SEASONS_SCREEN_ACCENT;
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
};

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
};

type TvShowSeasonsListScreenComponentState = {
	pendingDeleteTvShowSeason?: TvShowSeasonInternal;
};
