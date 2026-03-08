
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { AppError } from 'app/data/models/internal/error';
import { saveMediaItem, setMediaItemFormStatus } from 'app/redux/actions/media-item/generators';
import { State } from 'app/redux/state/state';
import { Dispatch } from 'redux';

/**
 * Common mapStateToProps for all media item forms
 * @param state the state
 * @returns the props
 */
export const commonMediaItemFormMapStateToProps = (state: State): CommonMediaItemFormComponentInputMain => {
	
	if(!state.mediaItemDetails.mediaItem) {

		throw AppError.GENERIC.withDetails('App navigated to the details screen with undefined details');
	}
	
	return {
		initialValues: state.mediaItemDetails.mediaItem,
		saveRequested: state.mediaItemDetails.saveStatus === 'REQUESTED',
		loadCatalogDetails: state.mediaItemDetails.catalogDetails,
		selectedGroup: state.groupGlobal.selectedGroup,
		selectedOwnPlatform: state.ownPlatformGlobal.selectedOwnPlatform,
		sameNameConfirmationRequested: state.mediaItemDetails.saveStatus === 'REQUIRES_CONFIRMATION'
	};
};

/**
 * Common mapDispatchToProps for all media item forms
 * @param dispatch the dispatch
 * @returns the props
 */
export const commonMediaItemFormMapDispatchToProps = (dispatch: Dispatch): CommonMediaItemFormComponentOutput => {

	return {
		saveMediaItem: (mediaItem, confirmSameName) => {
			dispatch(saveMediaItem(mediaItem, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setMediaItemFormStatus(valid, dirty));
		}
	};
};
