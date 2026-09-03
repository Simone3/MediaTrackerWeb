import { ReactElement } from 'react';
import { Dispatch } from 'redux';
import { config } from 'app/config/config';
import { MediaItemsListComponent, MediaItemsListComponentInput, MediaItemsListComponentOutput } from 'app/components/presentational/media-item/list/list';
import { AppError } from 'app/data/models/internal/error';
import { changeMediaItemsPage, deleteMediaItem, fetchMediaItems, highlightMediaItem, loadMediaItemDetails, markMediaItemAsActive, markMediaItemAsComplete, markMediaItemAsRedo, removeMediaItemHighlight, searchMediaItems, startMediaItemsSearchMode, startMediaItemsSetFiltersMode, startMediaItemsViewGroupMode, stopMediaItemsSearchMode, stopMediaItemsViewGroupMode } from 'app/redux/actions/media-item/generators';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';
import { State } from 'app/redux/state/state';

const selectInput = (state: State): MediaItemsListComponentInput => {
	if(!state.categoryGlobal.selectedCategory) {
		throw AppError.GENERIC.withDetails('Category cannot be null while rendering the media items list');
	}

	const mediaItems = state.mediaItemsList.mediaItems;
	const status = state.mediaItemsList.status;
	const totalCount = state.mediaItemsList.totalCount;

	return {
		category: state.categoryGlobal.selectedCategory,
		mediaItems: mediaItems,
		highlightedMediaItem: state.mediaItemsList.highlightedMediaItem,
		currentViewGroup: state.mediaItemsList.mode === 'VIEW_GROUP' ? state.mediaItemsList.viewGroup : undefined,
		isSearchMode: state.mediaItemsList.mode === 'SEARCH',
		currentSearchTerm: state.mediaItemsList.mode === 'SEARCH' ? state.mediaItemsList.searchTerm : undefined,
		showEmptyState: status === 'FETCHED' && mediaItems.length === 0,
		showSkeletons: mediaItems.length === 0 && (status === 'REQUIRES_FETCH' || status === 'FETCHING'),
		showFetchError: status === 'FETCH_FAILED',
		currentPage: state.mediaItemsList.currentPage,
		totalPages: Math.ceil(totalCount / config.ui.mediaItemsPageSize),
		isPageLoading: status === 'REQUIRES_FETCH' || status === 'FETCHING'
	};
};

const buildOutput = (dispatch: Dispatch): MediaItemsListComponentOutput => {
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
		},
		goToPage: (page) => {
			dispatch(changeMediaItemsPage(page));
		},
		retryFetch: () => {
			dispatch(fetchMediaItems());
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemsListComponent
 * @returns the connected media items list
 */
export const MediaItemsListContainer = (): ReactElement => {
	const input = useContainerInput(selectInput);
	const output = useContainerOutput(buildOutput);

	return <MediaItemsListComponent {...input} {...output} />;
};
