import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MediaItemFilterModalComponent, MediaItemFilterModalComponentInput, MediaItemFilterModalComponentOutput } from 'app/components/presentational/media-item/list/filter-modal';
import { AppError } from 'app/data/models/internal/error';
import { fetchGroups } from 'app/redux/actions/group/generators';
import { stopMediaItemsSetFiltersMode, submitMediaItemsFilters } from 'app/redux/actions/media-item/generators';
import { fetchOwnPlatforms } from 'app/redux/actions/own-platform/generators';
import { State } from 'app/redux/state/state';

const mapStateToProps = (state: State): MediaItemFilterModalComponentInput => {
	const category = state.categoryGlobal.selectedCategory;
	const currentFilter = state.mediaItemsList.filter;
	const currentSortBy = state.mediaItemsList.sortBy;
	if(!category || !currentFilter || !currentSortBy) {
		throw AppError.GENERIC.withDetails('List state has no linked category/filter/sort, cannot display filter modal');
	}

	const groupsStatus = state.groupsList.status;
	const ownPlatformsStatus = state.ownPlatformsList.status;

	return {
		category: category,
		visible: state.mediaItemsList.mode === 'SET_FILTERS',
		initialFilter: currentFilter,
		initialSortBy: currentSortBy,
		groups: state.groupsList.groups,
		ownPlatforms: state.ownPlatformsList.ownPlatforms,
		groupsLoading: groupsStatus === 'FETCHING',
		ownPlatformsLoading: ownPlatformsStatus === 'FETCHING',
		groupsLoaded: groupsStatus === 'FETCHED',
		ownPlatformsLoaded: ownPlatformsStatus === 'FETCHED',

		// A failed load is retried the next time the filter is opened, which is the only explicit request the user can make here
		groupsRequireFetch: groupsStatus === 'REQUIRES_FETCH' || groupsStatus === 'FETCH_FAILED',
		ownPlatformsRequireFetch: ownPlatformsStatus === 'REQUIRES_FETCH' || ownPlatformsStatus === 'FETCH_FAILED'
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemFilterModalComponentOutput => {
	return {
		submitFilter: (filter, sortBy) => {
			dispatch(stopMediaItemsSetFiltersMode());
			dispatch(submitMediaItemsFilters(filter, sortBy));
		},
		close: () => {
			dispatch(stopMediaItemsSetFiltersMode());
		},
		fetchGroups: () => {
			dispatch(fetchGroups());
		},
		fetchOwnPlatforms: () => {
			dispatch(fetchOwnPlatforms());
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemFilterModalComponent
 */
export const MediaItemFilterModalContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemFilterModalComponent);
