import { Component, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { buildGroupFilterOptions, buildOwnPlatformFilterOptions, withFilterDisplayNames } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { MediaItemFilterFormComponent } from 'app/components/presentational/media-item/list/filter-form/wrapper/media-item';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display a modal dialog with the media item filter options
 */
export class MediaItemFilterModalComponent extends Component<MediaItemFilterModalComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.fetchFilterOptionsIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: MediaItemFilterModalComponentProps): void {
		if(!prevProps.visible && this.props.visible) {
			this.fetchFilterOptionsIfRequired();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		if(!this.props.visible) {
			return null;
		}

		return (
			<div
				className='media-item-filter-overlay'
				role='presentation'
				onClick={() => {
					this.props.close();
				}}>
				<section
					className='media-item-filter-modal'
					role='dialog'
					aria-modal={true}
					aria-labelledby='media-item-filter-title'
					onClick={(event) => {
						event.stopPropagation();
					}}>
					<h2 id='media-item-filter-title' className='media-item-filter-title'>
						{i18n.t('mediaItem.list.filter.title')}
					</h2>
					<MediaItemFilterFormComponent
						category={this.props.category}
						initialFilter={this.props.initialFilter}
						initialSortBy={this.props.initialSortBy}
						groupOptions={buildGroupFilterOptions(this.props.initialFilter, this.props.groups, this.props.groupsLoaded)}
						ownPlatformOptions={buildOwnPlatformFilterOptions(this.props.initialFilter, this.props.ownPlatforms, this.props.ownPlatformsLoaded)}
						groupsLoading={this.props.groupsLoading}
						ownPlatformsLoading={this.props.ownPlatformsLoading}
						submitFilter={(filter, sortBy) => {
							this.submitFilter(filter, sortBy);
						}}
						clearFilter={() => {
							this.props.clearFilter(this.props.category);
						}}
						close={this.props.close}
					/>
				</section>
			</div>
		);
	}

	/**
	 * Helper to load the groups and the own platforms that the filter inputs list as options. They are fetched when the modal opens rather
	 * than with the list itself: they are needed nowhere else, and a filter that is being opened is the one most likely to change. The
	 * request is deliberately not blocking, since every generic option is usable while it is in flight
	 */
	private fetchFilterOptionsIfRequired(): void {
		if(!this.props.visible) {
			return;
		}

		if(this.props.groupsRequireFetch) {
			this.props.fetchGroups();
		}

		if(this.props.ownPlatformsRequireFetch) {
			this.props.fetchOwnPlatforms();
		}
	}

	/**
	 * Helper to submit the filter with the display names of the groups and own platforms it targets. The form mapper only knows the IDs: the
	 * names are resolved here, where the loaded lists are available, so that the filter can label its own selection after a reload
	 * @param filter the filter built by the form
	 * @param sortBy the sort options built by the form
	 */
	private submitFilter(filter: MediaItemFilterInternal, sortBy: MediaItemSortByInternal[]): void {
		this.props.submitFilter(withFilterDisplayNames(filter, this.props.initialFilter, this.props.groups, this.props.ownPlatforms), sortBy);
	}
}

/**
 * MediaItemFilterModalComponent's input props
 */
export type MediaItemFilterModalComponentInput = {
	/**
	 * The linked category
	 */
	category: CategoryInternal;

	/**
	 * The initial filter values for the form inputs
	 */
	initialFilter: MediaItemFilterInternal;

	/**
	 * The initial sort values for the form inputs
	 */
	initialSortBy: MediaItemSortByInternal[];

	/**
	 * If the component should be displayed at this moment
	 */
	visible: boolean;

	/**
	 * The currently loaded groups, listed as options of the group filter input
	 */
	groups: GroupInternal[];

	/**
	 * The currently loaded own platforms, listed as options of the own platform filter input
	 */
	ownPlatforms: OwnPlatformInternal[];

	/**
	 * If the groups are being fetched
	 */
	groupsLoading: boolean;

	/**
	 * If the own platforms are being fetched
	 */
	ownPlatformsLoading: boolean;

	/**
	 * If the loaded groups are the authoritative list, i.e. the last fetch completed successfully
	 */
	groupsLoaded: boolean;

	/**
	 * If the loaded own platforms are the authoritative list, i.e. the last fetch completed successfully
	 */
	ownPlatformsLoaded: boolean;

	/**
	 * If the groups should be fetched when the modal opens
	 */
	groupsRequireFetch: boolean;

	/**
	 * If the own platforms should be fetched when the modal opens
	 */
	ownPlatformsRequireFetch: boolean;
};

/**
 * MediaItemFilterModalComponent's output props
 */
export type MediaItemFilterModalComponentOutput = {
	/**
	 * Callback to submit the filter options
	 */
	submitFilter: (filter: MediaItemFilterInternal, sortBy: MediaItemSortByInternal[]) => void;

	/**
	 * Callback to reset the filter and sort options to the category defaults
	 */
	clearFilter: (category: CategoryInternal) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;

	/**
	 * Callback to load the groups listed by the group filter input
	 */
	fetchGroups: () => void;

	/**
	 * Callback to load the own platforms listed by the own platform filter input
	 */
	fetchOwnPlatforms: () => void;
};

/**
 * MediaItemFilterModalComponent's props
 */
export type MediaItemFilterModalComponentProps = MediaItemFilterModalComponentInput & MediaItemFilterModalComponentOutput;
