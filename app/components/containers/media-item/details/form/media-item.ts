import { requestGroupSelection } from 'app/redux/actions/group/generators';
import { getMediaItemCatalogDetails, resetMediaItemsCatalogSearch, saveMediaItem, searchMediaItemsCatalog, setMediaItemFormDraft, setMediaItemFormStatus } from 'app/redux/actions/media-item/generators';
import { requestOwnPlatformSelection } from 'app/redux/actions/own-platform/generators';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemDetailsFormValues, mergeCatalogDetailsIntoMediaItem } from 'app/components/presentational/media-item/details/form/data/media-item';
import { State } from 'app/redux/state/state';
import { Dispatch } from 'redux';

/**
 * Common helper to build initial media-item form values from Redux state
 * @param state the Redux state
 * @returns the initial form values
 */
const buildInitialMediaItemFormValues = (state: State): MediaItemDetailsFormValues => {
	const {
		mediaItem,
		formDraft,
		catalogDetails
	} = state.mediaItemDetails;

	if(!mediaItem) {
		throw AppError.GENERIC.withDetails('App navigated to the media item form with undefined details');
	}

	const hasDraft = Boolean(formDraft);
	const sourceMediaItem = (formDraft || mediaItem) as MediaItemDetailsFormValues;
	let formValues: MediaItemDetailsFormValues = {
		...sourceMediaItem
	};

	if(!hasDraft && catalogDetails) {
		formValues = mergeCatalogDetailsIntoMediaItem(formValues, catalogDetails);
	}

	return {
		...formValues,
		group: state.groupGlobal.selectedGroup,
		ownPlatform: state.ownPlatformGlobal.selectedOwnPlatform
	};
};

/**
 * Common mapStateToProps for all media-item form containers
 * @param state the Redux state
 * @returns the shared form props
 */
export const commonMediaItemFormMapStateToProps = (state: State): CommonMediaItemFormComponentInputMain => {
	const details = state.mediaItemDetails;
	const mediaItemLoading = details.saveStatus === 'SAVING';
	const catalogLoading = details.catalogStatus === 'FETCHING';
	const groupsLoading = state.groupsList.status === 'DELETING' || state.groupsList.status === 'FETCHING';
	const platformsLoading = state.ownPlatformsList.status === 'DELETING' || state.ownPlatformsList.status === 'FETCHING';

	if(!details.mediaItem) {
		throw AppError.GENERIC.withDetails('App navigated to the media item form with undefined details');
	}

	return {
		isLoading: mediaItemLoading || catalogLoading || groupsLoading || platformsLoading,
		initialValues: buildInitialMediaItemFormValues(state),
		baseMediaItem: details.mediaItem,
		sameNameConfirmationRequested: details.saveStatus === 'REQUIRES_CONFIRMATION',
		catalogSearchResults: details.catalogSearchResults,
		catalogDetails: details.catalogDetails,
		selectedGroup: state.groupGlobal.selectedGroup,
		selectedOwnPlatform: state.ownPlatformGlobal.selectedOwnPlatform
	};
};

/**
 * Common mapDispatchToProps for all media-item form containers
 * @param dispatch the Redux dispatch function
 * @returns the shared form callbacks
 */
export const commonMediaItemFormMapDispatchToProps = (dispatch: Dispatch): CommonMediaItemFormComponentOutput => {
	return {
		saveMediaItem: (mediaItem, confirmSameName) => {
			dispatch(saveMediaItem(mediaItem, confirmSameName));
		},
		notifyFormStatus: (valid, dirty) => {
			dispatch(setMediaItemFormStatus(valid, dirty));
		},
		persistFormDraft: (mediaItem) => {
			dispatch(setMediaItemFormDraft(mediaItem));
		},
		requestGroupSelection: () => {
			dispatch(requestGroupSelection());
		},
		requestOwnPlatformSelection: () => {
			dispatch(requestOwnPlatformSelection());
		},
		searchMediaItemsCatalog: (term) => {
			dispatch(searchMediaItemsCatalog(term));
		},
		loadMediaItemCatalogDetails: (catalogId) => {
			dispatch(getMediaItemCatalogDetails(catalogId));
		},
		resetMediaItemsCatalogSearch: () => {
			dispatch(resetMediaItemsCatalogSearch());
		}
	};
};
