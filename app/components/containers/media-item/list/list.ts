import { MediaItemsListComponent, MediaItemsListComponentInput, MediaItemsListComponentOutput } from 'app/components/presentational/media-item/list/list';
import { AppError } from 'app/data/models/internal/error';
import {
	deleteMediaItem,
	highlightMediaItem,
	invalidateMediaItems,
	loadMediaItemDetails,
	markMediaItemAsActive,
	markMediaItemAsComplete,
	markMediaItemAsRedo,
	removeMediaItemHighlight,
	startMediaItemsSetFiltersMode,
	startMediaItemsViewGroupMode,
	stopMediaItemsViewGroupMode
} from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): MediaItemsListComponentInput => {
	if(!state.categoryGlobal.selectedCategory) {
		throw AppError.GENERIC.withDetails('Category cannot be null while rendering the media items list');
	}

	return {
		category: state.categoryGlobal.selectedCategory,
		mediaItems: state.mediaItemsList.mediaItems,
		highlightedMediaItem: state.mediaItemsList.highlightedMediaItem,
		currentViewGroup: state.mediaItemsList.mode === 'VIEW_GROUP' ? state.mediaItemsList.viewGroup : undefined
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
		refreshMediaItems: () => {
			dispatch(invalidateMediaItems());
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
