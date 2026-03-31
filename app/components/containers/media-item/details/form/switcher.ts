import { MediaItemFormSwitcherComponent, MediaItemFormSwitcherComponentProps } from 'app/components/presentational/media-item/details/form/switcher';
import { AppError } from 'app/data/models/internal/error';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State): MediaItemFormSwitcherComponentProps => {
	if(!state.mediaItemDetails.mediaItem) {
		throw AppError.GENERIC.withDetails('App navigated to the media item details screen with undefined details');
	}

	return {
		mediaItem: state.mediaItemDetails.mediaItem
	};
};

/**
 * Container component that selects the correct media-item form container
 */
export const MediaItemFormSwitcherContainer = connect(
	mapStateToProps
)(MediaItemFormSwitcherComponent);
