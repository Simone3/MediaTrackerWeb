import { MediaItemContextMenuComponent, MediaItemContextMenuComponentInput, MediaItemContextMenuComponentOutput } from 'app/components/presentational/media-item/list/context-menu';
import { deleteMediaItem, loadMediaItemDetails, markMediaItemAsActive, markMediaItemAsComplete, markMediaItemAsRedo, removeMediaItemHighlight, startMediaItemsViewGroupMode } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State): MediaItemContextMenuComponentInput => {
	
	return {
		mediaItem: state.mediaItemsList.highlightedMediaItem
	};
};

const mapDispatchToProps = (dispatch: Dispatch): MediaItemContextMenuComponentOutput => {

	return {
		delete: (mediaItem) => {
			dispatch(deleteMediaItem(mediaItem));
		},
		edit: (mediaItem) => {
			dispatch(loadMediaItemDetails(mediaItem));
		},
		markAsActive: (mediaItem) => {
			dispatch(markMediaItemAsActive(mediaItem));
		},
		markAsComplete: (mediaItem) => {
			dispatch(markMediaItemAsComplete(mediaItem));
		},
		markAsRedo: (mediaItem) => {
			dispatch(markMediaItemAsRedo(mediaItem));
		},
		viewGroup: (group) => {
			dispatch(startMediaItemsViewGroupMode(group));
		},
		close: () => {
			dispatch(removeMediaItemHighlight());
		}
	};
};

/**
 * Container component that handles Redux state for MediaItemContextMenuComponent
 */
export const MediaItemContextMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaItemContextMenuComponent);
