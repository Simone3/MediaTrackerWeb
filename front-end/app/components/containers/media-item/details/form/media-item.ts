import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { requestGroupSelection } from 'app/redux/actions/group/generators';
import { getMediaItemCatalogDetails, resetMediaItemsCatalogSearch, saveMediaItem, searchMediaItemsCatalog, setMediaItemFormDraft, setMediaItemFormStatus } from 'app/redux/actions/media-item/generators';
import { requestOwnPlatformSelection } from 'app/redux/actions/own-platform/generators';
import { CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from 'app/components/presentational/media-item/details/form/wrapper/media-item';
import { AppError } from 'app/data/models/internal/error';
import { State } from 'app/redux/state/state';

/**
 * Common input props for all media-item form containers.
 *
 * The state is read one value at a time instead of through a single derived object, because the two copies below have
 * to be memoized: the form is handed its own copy of the saved media item and of the restored draft, so that editing
 * the form cannot reach back into the objects held in the store. Rebuilding those copies on every state change would
 * hand the form a new object each time and defeat the comparison that decides whether anything actually changed.
 * @returns the shared form input props
 */
export const useCommonMediaItemFormInput = (): CommonMediaItemFormComponentInputMain => {
	const mediaItem = useSelector((state: State) => {
		return state.mediaItemDetails.mediaItem;
	});
	const formDraft = useSelector((state: State) => {
		return state.mediaItemDetails.formDraft;
	});
	const saveStatus = useSelector((state: State) => {
		return state.mediaItemDetails.saveStatus;
	});
	const catalogStatus = useSelector((state: State) => {
		return state.mediaItemDetails.catalogStatus;
	});
	const catalogSearchResults = useSelector((state: State) => {
		return state.mediaItemDetails.catalogSearchResults;
	});
	const catalogDetails = useSelector((state: State) => {
		return state.mediaItemDetails.catalogDetails;
	});
	const groupsStatus = useSelector((state: State) => {
		return state.groupsList.status;
	});
	const ownPlatformsStatus = useSelector((state: State) => {
		return state.ownPlatformsList.status;
	});
	const selectedGroup = useSelector((state: State) => {
		return state.groupGlobal.selectedGroup;
	});
	const selectedOwnPlatform = useSelector((state: State) => {
		return state.ownPlatformGlobal.selectedOwnPlatform;
	});

	const initialValues = useMemo(() => {
		return mediaItem ? { ...mediaItem } : undefined;
	}, [ mediaItem ]);

	const restoredDraft = useMemo(() => {
		return formDraft ? { ...formDraft } : undefined;
	}, [ formDraft ]);

	if(!mediaItem) {
		throw AppError.GENERIC.withDetails('App navigated to the media item form with undefined details');
	}

	const groupsLoading = groupsStatus === 'DELETING' || groupsStatus === 'FETCHING';
	const platformsLoading = ownPlatformsStatus === 'DELETING' || ownPlatformsStatus === 'FETCHING';

	return {
		isLoading: saveStatus === 'SAVING' || catalogStatus === 'FETCHING' || groupsLoading || platformsLoading,
		initialValues: initialValues,
		restoredDraft: restoredDraft,
		sameNameConfirmationRequested: saveStatus === 'REQUIRES_CONFIRMATION',
		catalogSearchResults: catalogSearchResults,
		catalogDetails: catalogDetails,
		selectedGroup: selectedGroup,
		selectedOwnPlatform: selectedOwnPlatform
	};
};

/**
 * Common output props for all media-item form containers
 * @param dispatch the Redux dispatch function
 * @returns the shared form callbacks
 */
export const buildCommonMediaItemFormOutput = (dispatch: Dispatch): CommonMediaItemFormComponentOutput => {
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
