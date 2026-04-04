import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { MediaItemsListComponent, MediaItemsListComponentInput, MediaItemsListComponentOutput } from 'app/components/presentational/media-item/list/list';
import { AppError } from 'app/data/models/internal/error';
import { deleteMediaItem, highlightMediaItem, loadMediaItemDetails, markMediaItemAsActive, markMediaItemAsComplete, markMediaItemAsRedo, removeMediaItemHighlight, searchMediaItems, startMediaItemsSearchMode, startMediaItemsSetFiltersMode, startMediaItemsViewGroupMode, stopMediaItemsSearchMode, stopMediaItemsViewGroupMode } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';

const mapStateToProps = (state: State): MediaItemsListComponentInput => {
	if (!state.categoryGlobal.selectedCategory) {
		throw AppError.GENERIC.withDetails('Category cannot be null while rendering the media items list');
	}

	const mediaItems = state.mediaItemsList.mediaItems;
	const status = state.mediaItemsList.status;

	return {
		category: state.categoryGlobal.selectedCategory,
		mediaItems: mediaItems,
		highlightedMediaItem: state.mediaItemsList.highlightedMediaItem,
		currentViewGroup: state.mediaItemsList.mode === 'VIEW_GROUP' ? state.mediaItemsList.viewGroup : undefined,
		isSearchMode: state.mediaItemsList.mode === 'SEARCH',
		currentSearchTerm: state.mediaItemsList.mode === 'SEARCH' ? state.mediaItemsList.searchTerm : undefined,
		showEmptyState: status === 'FETCHED' && mediaItems.length === 0,
		showSkeletons: mediaItems.length === 0 && (status === 'REQUIRES_FETCH' || status === 'FETCHING')
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemsListComponentOutput => {
	return {
		highlightMediaItem: (mediaItem) => {
			dispatch(highlightMediaItem(mediaItem));
		},
		selectMediaItem: (mediaItem) => {
			dispatch(loadMediaItemDetails(mediaItem));
		},
		editMediaItem: (mediaItem) => {
			dispatch(loadMediaItemDetails(mediaItem));
		},
		deleteMediaItem: (mediaItem) => {
			dispatch(deleteMediaItem(mediaItem));
		},
		markMediaItemAsActive: (mediaItem) => {
			dispatch(markMediaItemAsActive(mediaItem));
		},
		markMediaItemAsComplete: (mediaItem) => {
			dispatch(markMediaItemAsComplete(mediaItem));
		},
		markMediaItemAsRedo: (mediaItem) => {
			dispatch(markMediaItemAsRedo(mediaItem));
		},
		viewMediaItemGroup: (group) => {
			dispatch(startMediaItemsViewGroupMode(group));
		},
		closeMediaItemMenu: () => {
			dispatch(removeMediaItemHighlight());
		},
		openSearch: () => {
			dispatch(startMediaItemsSearchMode());
		},
		submitSearch: (term) => {
			dispatch(searchMediaItems(term));
		},
		closeSearch: () => {
			dispatch(stopMediaItemsSearchMode());
		},
		openFilters: () => {
			dispatch(startMediaItemsSetFiltersMode());
		},
		exitViewGroupMode: () => {
			dispatch(stopMediaItemsViewGroupMode());
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemsListComponent
 */
export const MediaItemsListContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemsListComponent);
