import { Component, ReactNode } from 'react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { SelectComponent } from 'app/components/presentational/generic/select';
import { MediaItemFilterFormOption, buildGroupFilterOptions, buildOwnPlatformFilterOptions, toGroupFilterFormValue, toGroupFilterModel, toOwnPlatformFilterFormValue, toOwnPlatformFilterModel, withFilterDisplayNames } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemsStatsFilterInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the media items stats filter strip: the two selects that narrow the stats down, plus the clear
 * action and the summary that only appear once something is actually filtered.
 *
 * It offers neither an importance nor a status option on purpose: the stats break the backlog down by both, so filtering by either would
 * reduce the corresponding chart to a single value.
 */
export class MediaItemsStatsFiltersComponent extends Component<MediaItemsStatsFiltersComponentInput & MediaItemsStatsFiltersComponentOutput> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.requestOptionsIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {
		this.requestOptionsIfRequired();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			filter,
			groups,
			ownPlatforms,
			groupsLoaded,
			ownPlatformsLoaded,
			groupsLoading,
			ownPlatformsLoading
		} = this.props;

		return (
			<div className='media-items-stats-filters'>
				<span className='media-items-stats-filters-label'>{i18n.t('mediaItem.stats.filters.label')}</span>
				{this.renderSelect(
					'media-items-stats-filter-group',
					i18n.t('mediaItem.list.filter.prompts.group'),
					toGroupFilterFormValue(filter.groups),
					buildGroupFilterOptions(filter.groups, groups, groupsLoaded),
					groupsLoading,
					(value) => {
						this.applyFilter({
							...filter,
							groups: toGroupFilterModel(value)
						});
					}
				)}
				{this.renderSelect(
					'media-items-stats-filter-own-platform',
					i18n.t('mediaItem.list.filter.prompts.ownPlatform'),
					toOwnPlatformFilterFormValue(filter.ownPlatforms),
					buildOwnPlatformFilterOptions(filter.ownPlatforms, ownPlatforms, ownPlatformsLoaded),
					ownPlatformsLoading,
					(value) => {
						this.applyFilter({
							...filter,
							ownPlatforms: toOwnPlatformFilterModel(value)
						});
					}
				)}
				{/* An unfiltered strip deliberately shows nothing else: there is no selection to clear and no subset to compare */}
				{this.isFiltered() && this.renderFilteredActions()}
			</div>
		);
	}

	/**
	 * Helper method to render the clear action and the summary, which only exist once the user has narrowed the stats down
	 * @returns the node portion
	 */
	private renderFilteredActions(): ReactNode {
		const {
			category,
			filteredCount,
			totalCount,
			setFilter
		} = this.props;

		return (
			<>
				<PillButtonComponent
					className='media-items-stats-filters-clear'
					tone='secondary'
					size='compact'
					appearance='subtle'
					onClick={() => {
						setFilter({});
					}}>
					{i18n.t('mediaItem.stats.filters.clearButton')}
				</PillButtonComponent>
				{filteredCount !== undefined && totalCount !== undefined && (
					<span className='media-items-stats-filters-summary'>
						{i18n.t(`mediaItem.stats.filters.summary.${category.mediaType}`, { shown: filteredCount, total: totalCount })}
					</span>
				)}
			</>
		);
	}

	/**
	 * Helper method to render one of the two filter selects. The label is only read out: the options carry enough wording to say what
	 * they narrow, and the strip is a toolbar rather than a form
	 * @param id the control ID
	 * @param label the accessible name of the control
	 * @param value the currently selected option value
	 * @param options the available options
	 * @param loading if the options are still being fetched: the control stays usable, it only says that more options are on their way
	 * @param onChange the callback that applies a new option
	 * @returns the node portion
	 */
	private renderSelect(id: string, label: string, value: string, options: MediaItemFilterFormOption[], loading: boolean, onChange: (value: string) => void): ReactNode {
		return (
			<span key={id} className='media-items-stats-filters-field'>
				<SelectComponent
					id={id}
					aria-label={label}
					className={value === 'ALL' ? 'media-items-stats-filters-select' : 'media-items-stats-filters-select media-items-stats-filters-select-set'}
					value={value}
					onChangeValue={onChange}>
					{options.map((option) => {
						return (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						);
					})}
				</SelectComponent>
				{loading && <span className='media-items-stats-filters-spinner' aria-hidden={true} />}
			</span>
		);
	}

	/**
	 * Helper to tell if the user has narrowed the stats down at all
	 * @returns true if either filter targets something
	 */
	private isFiltered(): boolean {
		const {
			filter
		} = this.props;

		return Boolean(filter.groups) || Boolean(filter.ownPlatforms);
	}

	/**
	 * Helper to submit a new filter, carrying over the display names of what it selects so that the strip can still label a group or an
	 * own platform whose list has not come back, or no longer contains it
	 * @param filter the new filter
	 */
	private applyFilter(filter: MediaItemsStatsFilterInternal): void {
		this.props.setFilter(withFilterDisplayNames(filter, this.props.filter, this.props.groups, this.props.ownPlatforms));
	}

	/**
	 * Helper to load the groups and own platforms the selects offer. They are fetched the same way the media items filter modal fetches
	 * them: only when their status asks for it, and never blocking the strip, which stays usable with its generic options throughout
	 */
	private requestOptionsIfRequired(): void {
		if(this.props.groupsRequireFetch) {
			this.props.fetchGroups();
		}

		if(this.props.ownPlatformsRequireFetch) {
			this.props.fetchOwnPlatforms();
		}
	}
}

/**
 * MediaItemsStatsFiltersComponent's input props
 */
export type MediaItemsStatsFiltersComponentInput = {
	/**
	 * The category the stats cover, which decides the wording of the summary
	 */
	category: CategoryInternal;

	/**
	 * The current stats filter
	 */
	filter: MediaItemsStatsFilterInternal;

	/**
	 * The currently loaded groups, empty while they are being fetched
	 */
	groups: GroupInternal[];

	/**
	 * The currently loaded own platforms, empty while they are being fetched
	 */
	ownPlatforms: OwnPlatformInternal[];

	/**
	 * If the loaded groups are the authoritative list, i.e. the fetch completed successfully
	 */
	groupsLoaded: boolean;

	/**
	 * If the loaded own platforms are the authoritative list, i.e. the fetch completed successfully
	 */
	ownPlatformsLoaded: boolean;

	/**
	 * If the groups are being fetched
	 */
	groupsLoading: boolean;

	/**
	 * If the own platforms are being fetched
	 */
	ownPlatformsLoading: boolean;

	/**
	 * If the groups have to be requested
	 */
	groupsRequireFetch: boolean;

	/**
	 * If the own platforms have to be requested
	 */
	ownPlatformsRequireFetch: boolean;

	/**
	 * The number of media items the current filter matches, undefined until the stats have arrived to supply it
	 */
	filteredCount?: number;

	/**
	 * The number of media items the category holds, undefined until the stats have arrived to supply it
	 */
	totalCount?: number;
};

/**
 * MediaItemsStatsFiltersComponent's output props
 */
export type MediaItemsStatsFiltersComponentOutput = {
	/**
	 * Callback to apply a new stats filter, which also marks the stats for reload
	 */
	setFilter: (filter: MediaItemsStatsFilterInternal) => void;

	/**
	 * Callback to request the groups list (re)load
	 */
	fetchGroups: () => void;

	/**
	 * Callback to request the own platforms list (re)load
	 */
	fetchOwnPlatforms: () => void;
};
