import { Component, ReactNode } from 'react';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { ResponsiveHeaderButtonComponent } from 'app/components/presentational/generic/responsive-header-button';
import { MediaItemsStatsFiltersContainer } from 'app/components/containers/media-item/stats/filters';
import { buildImportanceBoxes, buildStatusSegments, buildYearSeries } from 'app/components/presentational/media-item/stats/data/media-item';
import { MediaItemsStatsImportanceBoxesComponent } from 'app/components/presentational/media-item/stats/importance-boxes';
import { MediaItemsStatsStatusDonutComponent } from 'app/components/presentational/media-item/stats/status-donut';
import { MediaItemsStatsYearChartComponent } from 'app/components/presentational/media-item/stats/year-chart';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemsStatsInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { dateUtils } from 'app/utilities/date-utils';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "media items stats" screen, which shows, for one category, what the user has
 * finished and what they have not.
 *
 * The two halves are deliberately never compared to each other: a backlog grows because the user keeps adding to it, so measuring it
 * against a lifetime of completions would say nothing. They share no bar, no percentage and no total.
 */
export class MediaItemsStatsScreenComponent extends Component<MediaItemsStatsScreenComponentInput & MediaItemsStatsScreenComponentOutput> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {
		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			category,
			stats,
			isLoading,
			showFetchError,
			back
		} = this.props;

		return (
			<section className='media-items-stats-screen'>
				<div className='media-items-stats-screen-content'>
					<AuthenticatedPageHeaderComponent
						title={i18n.t('mediaItem.stats.title', { category: category.name })}
						subtitle={this.buildSubtitle()}
						actions={
							<ResponsiveHeaderButtonComponent
								label={i18n.t('mediaItem.stats.back')}
								mobileLabel={i18n.t('common.buttons.back')}
								appearance='subtle'
								onClick={back}
							/>
						}
					/>
					<div className='media-items-stats-body'>
						<MediaItemsStatsFiltersContainer />
						{stats && this.renderCompletedSection(stats)}
						{stats && this.renderTodoSection(stats)}
						{showFetchError && this.renderFetchError()}
					</div>
				</div>
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
			</section>
		);
	}

	/**
	 * Helper method to render the first half of the screen: how much the user has finished, and when
	 * @param stats the loaded stats
	 * @returns the node portion
	 */
	private renderCompletedSection(stats: MediaItemsStatsInternal): ReactNode {
		const {
			category
		} = this.props;
		const completions = stats.completions;
		const series = buildYearSeries(completions.byYear, dateUtils.getCurrentYear());
		const repeats = completions.total - completions.mediaItems;

		return (
			<>
				<div className='media-items-stats-section'>
					<span className='media-items-stats-section-label'>{i18n.t('mediaItem.stats.completed.label')}</span>
					<span className='media-items-stats-section-figure'>
						<strong className='media-items-stats-figure-completions media-items-stats-number'>{completions.total}</strong>
						<span>{i18n.t(`mediaItem.stats.completed.unit.${category.mediaType}`)}</span>
					</span>
					<span className='media-items-stats-section-side'>
						{/* The repeats figure is what makes the headline number honest: it says how much of it is the same things done again */}
						{this.buildCountLabel('mediaItem.stats.completed.distinct', completions.mediaItems, true)}
						{' · '}
						{this.buildCountLabel('mediaItem.stats.completed.repeats', repeats, false)}
					</span>
				</div>
				<div className='media-items-stats-rule' />
				<div className='media-items-stats-card'>
					<div className='media-items-stats-card-head'>
						<p className='media-items-stats-card-title'>{i18n.t(`mediaItem.stats.perYear.title.${category.mediaType}`)}</p>
						{series.length > 0 && (
							<span className='media-items-stats-section-side'>
								{/* The current, partial year counts as a whole one: the average answers "how many a year", not "how many so far" */}
								{i18n.t('mediaItem.stats.perYear.average', { value: (completions.total / series.length).toFixed(1) })}
							</span>
						)}
					</div>
					<MediaItemsStatsYearChartComponent
						series={series}
						emptyMessage={i18n.t('mediaItem.stats.perYear.empty')}
					/>
				</div>
			</>
		);
	}

	/**
	 * Helper method to render the second half of the screen: what is left, and where it is
	 * @param stats the loaded stats
	 * @returns the node portion
	 */
	private renderTodoSection(stats: MediaItemsStatsInternal): ReactNode {
		const {
			category,
			ownPlatforms
		} = this.props;
		const backlog = stats.backlog;
		const countKey = backlog.total === 1 ? 'single' : 'multiple';

		return (
			<>
				<div className='media-items-stats-section'>
					<span className='media-items-stats-section-label'>{i18n.t('mediaItem.stats.todo.label')}</span>
					<span className='media-items-stats-section-figure'>
						<strong className='media-items-stats-figure-backlog media-items-stats-number'>{backlog.total}</strong>
						<span>{i18n.t(`mediaItem.stats.todo.count.${countKey}.${category.mediaType}`)}</span>
					</span>
				</div>
				<div className='media-items-stats-rule' />
				<div className='media-items-stats-card'>
					<div className='media-items-stats-card-head'>
						<p className='media-items-stats-card-title'>{i18n.t('mediaItem.stats.byStatus.title')}</p>
					</div>
					<MediaItemsStatsStatusDonutComponent
						segments={buildStatusSegments(backlog.byStatus, category.mediaType)}
						total={backlog.total}
						centreLabel={i18n.t(`mediaItem.stats.todo.centre.${category.mediaType}`)}
						emptyMessage={i18n.t('mediaItem.stats.byStatus.empty')}
					/>
				</div>
				<div className='media-items-stats-card media-items-stats-card-boxes'>
					<div className='media-items-stats-card-head'>
						<p className='media-items-stats-card-title'>{i18n.t('mediaItem.stats.byPlatform.title')}</p>
					</div>
					<MediaItemsStatsImportanceBoxesComponent
						boxes={buildImportanceBoxes(backlog.byImportanceAndOwnPlatform, ownPlatforms)}
						emptyMessage={i18n.t('mediaItem.stats.byPlatform.empty')}
					/>
				</div>
			</>
		);
	}

	/**
	 * Helper method to render the failed-fetch card, which keeps the recovery on the screen that failed instead of leaving the user
	 * with a toast that has already gone
	 * @returns the node portion
	 */
	private renderFetchError(): ReactNode {
		return (
			<div className='media-items-stats-fetch-error' role='alert'>
				<p className='media-items-stats-fetch-error-title'>{i18n.t('mediaItem.stats.fetchError.title')}</p>
				<p className='media-items-stats-fetch-error-copy'>{i18n.t('mediaItem.stats.fetchError.copy')}</p>
				<PillButtonComponent
					tone='secondary'
					size='compact'
					onClick={this.props.fetchStats}>
					{i18n.t('mediaItem.stats.fetchError.retry')}
				</PillButtonComponent>
			</div>
		);
	}

	/**
	 * Helper to build the header subtitle, i.e. how many media items the category holds. It deliberately ignores the filters: it is
	 * context for the screen, not one of its figures, and it is empty until the stats have arrived to supply the count
	 * @returns the subtitle, or undefined while there is nothing to say
	 */
	private buildSubtitle(): string | undefined {
		const {
			stats,
			category
		} = this.props;

		if(!stats) {
			return undefined;
		}

		const countKey = stats.mediaItems.total === 1 ? 'single' : 'multiple';
		return i18n.t(`mediaItem.stats.subtitle.${countKey}.${category.mediaType}`, { count: stats.mediaItems.total });
	}

	/**
	 * Helper to build one of the two figures beside the completions headline, each of which has its own singular wording
	 * @param key the language bundle key of the figure
	 * @param count the figure value
	 * @param perMediaType if the wording of the figure changes with the media type
	 * @returns the label
	 */
	private buildCountLabel(key: string, count: number, perMediaType: boolean): string {
		const countKey = count === 1 ? 'single' : 'multiple';
		const fullKey = perMediaType ? `${key}.${countKey}.${this.props.category.mediaType}` : `${key}.${countKey}`;

		return i18n.t(fullKey, { count: count });
	}

	/**
	 * Helper to invoke the fetch callback if the input fetch flag is true
	 */
	private requestFetchIfRequired(): void {
		if(this.props.requiresFetch) {
			this.props.fetchStats();
		}
	}
}

/**
 * MediaItemsStatsScreenComponent's input props
 */
export type MediaItemsStatsScreenComponentInput = {
	/**
	 * The category the stats cover
	 */
	category: CategoryInternal;

	/**
	 * The stats of the category with the current filter, undefined until the first successful fetch
	 */
	stats?: MediaItemsStatsInternal;

	/**
	 * The currently loaded own platforms, which give the backlog panel the names behind its IDs
	 */
	ownPlatforms: OwnPlatformInternal[];

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the stats require a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;

	/**
	 * Whether the screen should render the failed-fetch card
	 */
	showFetchError: boolean;
};

/**
 * MediaItemsStatsScreenComponent's output props
 */
export type MediaItemsStatsScreenComponentOutput = {
	/**
	 * Callback to request the stats (re)load
	 */
	fetchStats: () => void;

	/**
	 * Callback to leave the screen and return to the media items list
	 */
	back: () => void;
};
