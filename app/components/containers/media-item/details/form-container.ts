
import { MediaItemFormSwitcherComponent, MediaItemFormSwitcherComponentInput } from 'app/components/presentational/media-item/details/form/switcher';
import { AppError } from 'app/data/models/internal/error';
import { State } from 'app/redux/state/state';
import { connect } from 'react-redux';

const mapStateToProps = (state: State): MediaItemFormSwitcherComponentInput => {
	
	if(!state.mediaItemDetails.mediaItem) {

		throw AppError.GENERIC.withDetails('App navigated to the details screen with undefined details');
	}
	
	return {
		mediaItem: state.mediaItemDetails.mediaItem
	};
};

/**
 * Container component that handles Redux state for MediaItemFormSwitcherComponent
 */
export const MediaItemFormSwitcherContainer = connect(
	mapStateToProps
)(MediaItemFormSwitcherComponent);
