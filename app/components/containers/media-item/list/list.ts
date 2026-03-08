import { MediaItemsListComponent, MediaItemsListComponentInput, MediaItemsListComponentOutput } from 'app/components/presentational/media-item/list/list';
import { AppError } from 'app/data/models/internal/error';
import { highlightMediaItem, invalidateMediaItems, loadMediaItemDetails } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): MediaItemsListComponentInput => {
	
	if(!state.categoryGlobal.selectedCategory) {

		throw AppError.GENERIC.withDetails('Category cannot be null while rendering the media items list');
	}

	return {
		category: state.categoryGlobal.selectedCategory,
		mediaItems: state.mediaItemsList.mediaItems
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
		refreshMediaItems: () => {
			dispatch(invalidateMediaItems());
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
