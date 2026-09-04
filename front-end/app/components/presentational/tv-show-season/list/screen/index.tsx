import { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { EntityManagementListComponent } from 'app/components/presentational/generic/entity-management-list';
import { EntityManagementScreenComponent } from 'app/components/presentational/generic/entity-management-screen';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { ResponsiveActionMenuAction } from 'app/components/presentational/generic/responsive-action-menu';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

const TV_SHOW_SEASONS_SCREEN_ACCENT = 'var(--color-tv-show-season-accent-default)';
const TV_SHOW_SEASONS_SCREEN_ACTIVE_ACCENT = 'var(--color-tv-show-season-accent-active)';
const TV_SHOW_SEASONS_SCREEN_COMPLETE_ACCENT = 'var(--color-tv-show-season-accent-complete)';

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
					title={i18n.t('tvShowSeason.list.title')}
					countLabel={countLabel}
					addButtonLabel={i18n.t('tvShowSeason.details.title.new')}
					onAdd={this.props.loadNewTvShowSeasonDetails}
					renderHeaderActions={({ defaultAddAction }) => {
						return (
							<>
								{defaultAddAction}
								<PillButtonComponent tone='primary' size='compact' onClick={this.props.completeHandling}>
									{i18n.t('common.buttons.done')}
								</PillButtonComponent>
							</>
						);
					}}>
					<EntityManagementListComponent
						items={tvShowSeasons}
						menuCloseAriaLabel={i18n.t('common.a11y.closeTvShowSeasonActions')}
						emptyTitle={i18n.t('tvShowSeason.list.empty')}
						emptyCopy={i18n.t('tvShowSeason.list.emptyHint')}
						showEmptyState={tvShowSeasons.length === 0}
						showSkeletons={false}
						getItemKey={(tvShowSeason) => {
							return String(tvShowSeason.number);
						}}
						getItemName={(tvShowSeason) => {
							return i18n.t('tvShowSeason.list.row.main', {
								seasonNumber: tvShowSeason.number
							});
						}}
						getItemAccentColor={(tvShowSeason) => {
							return this.getSeasonAccent(tvShowSeason);
						}}
						renderItemBadge={(tvShowSeason) => {
							return <span className='entity-management-list-badge'>{tvShowSeason.number}</span>;
						}}
						renderItemMeta={(tvShowSeason) => {
							return (
								<span className='entity-management-list-meta'>
									{i18n.t('tvShowSeason.list.row.secondary', {
										episodesNumber: this.getEpisodesNumber(tvShowSeason),
										watchedEpisodesNumber: this.getWatchedEpisodesNumber(tvShowSeason)
									})}
								</span>
							);
						}}
						onSelect={(tvShowSeason) => {
							this.props.editTvShowSeason(tvShowSeason);
						}}
						getItemActions={(tvShowSeason, closeMenu) => {
							const actions: ResponsiveActionMenuAction[] = [
								{
									label: i18n.t('tvShowSeason.list.edit'),
									onClick: () => {
										closeMenu();
										this.props.editTvShowSeason(tvShowSeason);
									}
								}
							];

							if(this.canCompleteSeason(tvShowSeason)) {
								actions.push({
									label: i18n.t('tvShowSeason.list.complete'),
									onClick: () => {
										closeMenu();
										this.props.completeTvShowSeason(tvShowSeason);
									}
								});
							}

							actions.push({
								label: i18n.t('tvShowSeason.list.delete'),
								onClick: () => {
									closeMenu();
									this.requestDeleteTvShowSeason(tvShowSeason);
								},
								tone: 'danger'
							});

							return actions;
						}}
					/>
				</EntityManagementScreenComponent>
				<ConfirmDialogComponent
					visible={Boolean(pendingDeleteTvShowSeason)}
					title={i18n.t('tvShowSeason.common.alert.delete.title')}
					message={pendingDeleteTvShowSeason ? i18n.t('tvShowSeason.common.alert.delete.message', { seasonNumber: pendingDeleteTvShowSeason.number }) : ''}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						if(pendingDeleteTvShowSeason) {
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
	 * Returns the season total episodes, defaulting to zero
	 * @param tvShowSeason the season
	 * @returns the number of episodes
	 */
	private getEpisodesNumber(tvShowSeason: TvShowSeasonInternal): number {
		return tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
	}

	/**
	 * Returns the season watched episodes, defaulting to zero
	 * @param tvShowSeason the season
	 * @returns the number of watched episodes
	 */
	private getWatchedEpisodesNumber(tvShowSeason: TvShowSeasonInternal): number {
		return tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;
	}

	/**
	 * Tells if the season can still be marked as complete
	 * @param tvShowSeason the season
	 * @returns true if the complete action is available
	 */
	private canCompleteSeason(tvShowSeason: TvShowSeasonInternal): boolean {
		const episodesNumber = this.getEpisodesNumber(tvShowSeason);

		return episodesNumber > 0 && this.getWatchedEpisodesNumber(tvShowSeason) !== episodesNumber;
	}

	/**
	 * Resolves the accent color for the provided season row
	 * @param tvShowSeason the season
	 * @returns the accent color
	 */
	private getSeasonAccent(tvShowSeason: TvShowSeasonInternal): string {
		const episodesNumber = this.getEpisodesNumber(tvShowSeason);
		const watchedEpisodesNumber = this.getWatchedEpisodesNumber(tvShowSeason);

		if(episodesNumber > 0 && watchedEpisodesNumber === episodesNumber) {
			return TV_SHOW_SEASONS_SCREEN_COMPLETE_ACCENT;
		}

		if(watchedEpisodesNumber > 0) {
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
