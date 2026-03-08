import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { ASK_CONFIRMATION_BEFORE_SAVING_MEDIA_ITEM, COMPLETE_DELETING_MEDIA_ITEM, COMPLETE_FETCHING_MEDIA_ITEMS, COMPLETE_GETTING_MEDIA_ITEM_CATALOG_DETAILS, COMPLETE_INLINE_UPDATING_MEDIA_ITEM, COMPLETE_SAVING_MEDIA_ITEM, COMPLETE_SEARCHING_MEDIA_ITEMS_CATALOG, DELETE_MEDIA_ITEM, FAIL_DELETING_MEDIA_ITEM, FAIL_FETCHING_MEDIA_ITEMS, FAIL_GETTING_MEDIA_ITEM_CATALOG_DETAILS, FAIL_INLINE_UPDATING_MEDIA_ITEM, FAIL_SAVING_MEDIA_ITEM, FAIL_SEARCHING_MEDIA_ITEMS_CATALOG, FETCH_MEDIA_ITEMS, GET_MEDIA_ITEM_CATALOG_DETAILS, HIGHLIGHT_MEDIA_ITEM, INVALIDATE_MEDIA_ITEMS, LOAD_MEDIA_ITEM_DETAILS, LOAD_NEW_MEDIA_ITEM_DETAILS, MARK_MEDIA_ITEM_AS_ACTIVE, MARK_MEDIA_ITEM_AS_COMPLETE, MARK_MEDIA_ITEM_AS_REDO, REMOVE_MEDIA_ITEM_HIGHLIGHT, REQUEST_MEDIA_ITEM_SAVE, RESET_MEDIA_ITEMS_CATALOG_SEARCH, RESET_MEDIA_ITEM_CATALOG_DETAILS, SAVE_MEDIA_ITEM, SEARCH_MEDIA_ITEMS, SEARCH_MEDIA_ITEMS_CATALOG, SET_MEDIA_ITEM_FORM_STATUS, START_DELETING_MEDIA_ITEM, START_FETCHING_MEDIA_ITEMS, START_GETTING_MEDIA_ITEM_CATALOG_DETAILS, START_INLINE_UPDATING_MEDIA_ITEM, START_MEDIA_ITEMS_SEARCH_MODE, START_MEDIA_ITEMS_SET_FILTERS_MODE, START_MEDIA_ITEMS_VIEW_GROUP_MODE, START_SAVING_MEDIA_ITEM, START_SEARCHING_MEDIA_ITEMS_CATALOG, STOP_MEDIA_ITEMS_SEARCH_MODE, STOP_MEDIA_ITEMS_SET_FILTERS_MODE, STOP_MEDIA_ITEMS_VIEW_GROUP_MODE, SUBMIT_MEDIA_ITEMS_FILTERS } from './const';
import { AskConfirmationBeforeSavingMediaItemAction, CompleteDeletingMediaItemAction, CompleteFetchingMediaItemsAction, CompleteGettingMediaItemCatalogDetailsAction, CompleteInlineUpdatingMediaItemAction, CompleteSavingMediaItemAction, CompleteSearchingMediaItemsCatalogAction, DeleteMediaItemAction, FailDeletingMediaItemAction, FailFetchingMediaItemsAction, FailGettingMediaItemCatalogDetailsAction, FailInlineUpdatingMediaItemAction, FailSavingMediaItemAction, FailSearchingMediaItemsCatalogAction, FetchMediaItemsAction, GetMediaItemCatalogDetailsAction, HighlightMediaItemAction, InvalidateMediaItemsAction, LoadMediaItemDetailsAction, LoadNewMediaItemDetailsAction, MarkMediaItemAsActiveAction, MarkMediaItemAsCompleteAction, MarkMediaItemAsRedoAction, RemoveMediaItemHighlightAction, RequestMediaItemSaveAction, ResetMediaItemCatalogDetailsAction, ResetMediaItemsCatalogSearchAction, SaveMediaItemAction, SearchMediaItemsAction, SearchMediaItemsCatalogAction, SetMediaItemFormStatusAction, StartDeletingMediaItemAction, StartFetchingMediaItemsAction, StartGettingMediaItemCatalogDetailsAction, StartInlineUpdatingMediaItemAction, StartMediaItemsSearchModeAction, StartMediaItemsSetFiltersModeAction, StartMediaItemsViewGroupModeAction, StartSavingMediaItemAction, StartSearchingMediaItemsCatalogAction, StopMediaItemsSearchModeAction, StopMediaItemsSetFiltersModeAction, StopMediaItemsViewGroupModeAction, SubmitMediaItemsFiltersAction } from './types';

/**
 * Generator for the fetch media items list action, which causes the request media items action, the async media items fetch and then the receive media items action
 * @returns the action
 */
export const fetchMediaItems = (): FetchMediaItemsAction => {
	
	return {
		type: FETCH_MEDIA_ITEMS
	};
};

/**
 * Generator for the start fetching media items action, which marks the start of the media items list fetching operation
 * @returns the action
 */
export const startFetchingMediaItems = (): StartFetchingMediaItemsAction => {
	
	return {
		type: START_FETCHING_MEDIA_ITEMS
	};
};

/**
 * Generator for the complete fetching media items action, which marks the successful end of the media items list fetching operation
 * @param mediaItems the fetched media items, possibly an empty array
 * @returns the action
 */
export const completeFetchingMediaItems = (mediaItems: MediaItemInternal[]): CompleteFetchingMediaItemsAction => {
	
	return {
		type: COMPLETE_FETCHING_MEDIA_ITEMS,
		mediaItems: mediaItems
	};
};

/**
 * Generator for the fail fetching media items action, which marks the unsuccessful end of the media items list fetching operation
 * @returns the action
 */
export const failFetchingMediaItems = (): FailFetchingMediaItemsAction => {
	
	return {
		type: FAIL_FETCHING_MEDIA_ITEMS
	};
};

/**
 * Generator for the invalidate media items action, which marks the media items list as invalid, i.e. they require a reload
 * @returns the action
 */
export const invalidateMediaItems = (): InvalidateMediaItemsAction => {

	return {
		type: INVALIDATE_MEDIA_ITEMS
	};
};

/**
 * Generator for the delete media item action, which causes the start deleting media item action, the async media item removal and then the complete deleting media item action
 * @param mediaItem the media item data
 * @returns the action
 */
export const deleteMediaItem = (mediaItem: MediaItemInternal): DeleteMediaItemAction => {
	
	return {
		type: DELETE_MEDIA_ITEM,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the start deleting media item action, which marks the start of the media item deleting operation
 * @returns the action
 */
export const startDeletingMediaItem = (): StartDeletingMediaItemAction => {
	
	return {
		type: START_DELETING_MEDIA_ITEM
	};
};

/**
 * Generator for the complete deleting media item action, which marks the successful end of the media item deleting operation
 * @returns the action
 */
export const completeDeletingMediaItem = (): CompleteDeletingMediaItemAction => {
	
	return {
		type: COMPLETE_DELETING_MEDIA_ITEM
	};
};

/**
 * Generator for the fail deleting media item action, which marks the unsuccessful end of the media item deleting operation
 * @returns the action
 */
export const failDeletingMediaItem = (): FailDeletingMediaItemAction => {
	
	return {
		type: FAIL_DELETING_MEDIA_ITEM
	};
};

/**
 * Generator for the mark media item as active action, which causes the start inline updating media item action, the async media item update and then the complete inline updating media item action
 * @param mediaItem the media item data
 * @returns the action
 */
export const markMediaItemAsActive = (mediaItem: MediaItemInternal): MarkMediaItemAsActiveAction => {
	
	return {
		type: MARK_MEDIA_ITEM_AS_ACTIVE,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the mark media item as complete action, which causes the start inline updating media item action, the async media item update and then the complete inline updating media item action
 * @param mediaItem the media item data
 * @returns the action
 */
export const markMediaItemAsComplete = (mediaItem: MediaItemInternal): MarkMediaItemAsCompleteAction => {
	
	return {
		type: MARK_MEDIA_ITEM_AS_COMPLETE,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the mark media item as redo action, which causes the start inline updating media item action, the async media item update and then the complete inline updating media item action
 * @param mediaItem the media item data
 * @returns the action
 */
export const markMediaItemAsRedo = (mediaItem: MediaItemInternal): MarkMediaItemAsRedoAction => {
	
	return {
		type: MARK_MEDIA_ITEM_AS_REDO,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the start inline updating media item action, which marks the start of the media item deleting operation
 * @returns the action
 */
export const startInlineUpdatingMediaItem = (): StartInlineUpdatingMediaItemAction => {
	
	return {
		type: START_INLINE_UPDATING_MEDIA_ITEM
	};
};

/**
 * Generator for the complete inline updating media item action, which marks the successful end of the inline media item updating operation
 * @returns the action
 */
export const completeInlineUpdatingMediaItem = (): CompleteInlineUpdatingMediaItemAction => {
	
	return {
		type: COMPLETE_INLINE_UPDATING_MEDIA_ITEM
	};
};

/**
 * Generator for the fail inline updating media item action, which marks the unsuccessful end of the inline media item updating operation
 * @returns the action
 */
export const failInlineUpdatingMediaItem = (): FailInlineUpdatingMediaItemAction => {
	
	return {
		type: FAIL_INLINE_UPDATING_MEDIA_ITEM
	};
};

/**
 * Generator for the highlight media item action, which marks a media item as highlighted
 * @param mediaItem the media item
 * @returns the action
 */
export const highlightMediaItem = (mediaItem: MediaItemInternal): HighlightMediaItemAction => {
	
	return {
		type: HIGHLIGHT_MEDIA_ITEM,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the remove media item highlight action, which removes any highlighted media item
 * @returns the action
 */
export const removeMediaItemHighlight = (): RemoveMediaItemHighlightAction => {
	
	return {
		type: REMOVE_MEDIA_ITEM_HIGHLIGHT
	};
};

/**
 * Generator for the search media items list action, which causes the request media items action, the async media items search and then the receive media items action
 * @param term the search term (non-null and non-blank)
 * @returns the action
 */
export const searchMediaItems = (term: string): SearchMediaItemsAction => {
	
	return {
		type: SEARCH_MEDIA_ITEMS,
		term: term
	};
};

/**
 * Generator for the start media items search mode action, which allows to start searching for media items by term
 * @returns the action
 */
export const startMediaItemsSearchMode = (): StartMediaItemsSearchModeAction => {
	
	return {
		type: START_MEDIA_ITEMS_SEARCH_MODE
	};
};

/**
 * Generator for the start media items search mode action, which allows to stop searching for media items by term
 * @returns the action
 */
export const stopMediaItemsSearchMode = (): StopMediaItemsSearchModeAction => {
	
	return {
		type: STOP_MEDIA_ITEMS_SEARCH_MODE
	};
};

/**
 * Generator for the start media items view group mode action, which allows to start viewing all media items in a specific group
 * @param group the group whose media items are to be displayed
 * @returns the action
 */
export const startMediaItemsViewGroupMode = (group: GroupInternal): StartMediaItemsViewGroupModeAction => {
	
	return {
		type: START_MEDIA_ITEMS_VIEW_GROUP_MODE,
		group: group
	};
};

/**
 * Generator for the start media items view group mode action, which allows to stop viewing all media items in a specific group
 * @returns the action
 */
export const stopMediaItemsViewGroupMode = (): StopMediaItemsViewGroupModeAction => {
	
	return {
		type: STOP_MEDIA_ITEMS_VIEW_GROUP_MODE
	};
};

/**
 * Generator for the start media items "set filters" mode action, which allows to show the filter form for media items
 * @returns the action
 */
export const startMediaItemsSetFiltersMode = (): StartMediaItemsSetFiltersModeAction => {
	
	return {
		type: START_MEDIA_ITEMS_SET_FILTERS_MODE
	};
};

/**
 * Generator for the start media items "set filters" mode action, which allows to hide the filter form for media items
 * @returns the action
 */
export const stopMediaItemsSetFiltersMode = (): StopMediaItemsSetFiltersModeAction => {
	
	return {
		type: STOP_MEDIA_ITEMS_SET_FILTERS_MODE
	};
};

/**
 * Generator for the submit media items filters, which sets the current media item filters
 * @param filter the filter options
 * @param sortBy the sort by options
 * @returns the action
 */
export const submitMediaItemsFilters = (filter: MediaItemFilterInternal, sortBy: MediaItemSortByInternal[]): SubmitMediaItemsFiltersAction => {
	
	return {
		type: SUBMIT_MEDIA_ITEMS_FILTERS,
		filter: filter,
		sortBy: sortBy
	};
};

/**
 * Generator for the load new media item action, which resets the media item details state to the initial values
 * @param category the current category
 * @returns the action
 */
export const loadNewMediaItemDetails = (category: CategoryInternal): LoadNewMediaItemDetailsAction => {
	
	return {
		type: LOAD_NEW_MEDIA_ITEM_DETAILS,
		category: category
	};
};

/**
 * Generator for the load existing media item action, which sets the media item details state
 * @param mediaItem the media item data
 * @returns the action
 */
export const loadMediaItemDetails = (mediaItem: MediaItemInternal): LoadMediaItemDetailsAction => {
	
	return {
		type: LOAD_MEDIA_ITEM_DETAILS,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the set media item form status, which sets the current status of the media item details form
 * @param valid true if the form is currently valid (no validation errors)
 * @param dirty true if the form is currently dirty (one or more fields changed)
 * @returns the action
 */
export const setMediaItemFormStatus = (valid: boolean, dirty: boolean): SetMediaItemFormStatusAction => {
	
	return {
		type: SET_MEDIA_ITEM_FORM_STATUS,
		valid: valid,
		dirty: dirty
	};
};

/**
 * Generator for the request media item save action, which requests the media item form validation and, if OK, submission
 * @returns the action
 */
export const requestMediaItemSave = (): RequestMediaItemSaveAction => {
	
	return {
		type: REQUEST_MEDIA_ITEM_SAVE
	};
};

/**
 * Generator for the save media item action, which causes the start saving media item action, the async media item store and then the complete saving media item action
 * @param mediaItem the media item data
 * @param confirmSameName if the user confirmed to save the media item even if it has the same name as an existing item
 * @returns the action
 */
export const saveMediaItem = (mediaItem: MediaItemInternal, confirmSameName: boolean): SaveMediaItemAction => {
	
	return {
		type: SAVE_MEDIA_ITEM,
		mediaItem: mediaItem,
		confirmSameName: confirmSameName
	};
};

/**
 * Generator for the start saving media item action, which marks the start of the media item saving operation
 * @param mediaItem the media item data
 * @returns the action
 */
export const startSavingMediaItem = (mediaItem: MediaItemInternal): StartSavingMediaItemAction => {
	
	return {
		type: START_SAVING_MEDIA_ITEM,
		mediaItem: mediaItem
	};
};

/**
 * Generator for the ask confirmation before saving media item action, which triggers a user pop-up to confirm a media item save process (e.g. same-name check on insert)
 * @returns the action
 */
export const askConfirmationBeforeSavingMediaItem = (): AskConfirmationBeforeSavingMediaItemAction => {
	
	return {
		type: ASK_CONFIRMATION_BEFORE_SAVING_MEDIA_ITEM
	};
};

/**
 * Generator for the complete saving media item action, which marks the successful end of the media item saving operation
 * @returns the action
 */
export const completeSavingMediaItem = (): CompleteSavingMediaItemAction => {
	
	return {
		type: COMPLETE_SAVING_MEDIA_ITEM
	};
};

/**
 * Generator for the complete saving media item action, which marks the unsuccessful end of the media item saving operation
 * @returns the action
 */
export const failSavingMediaItem = (): FailSavingMediaItemAction => {
	
	return {
		type: FAIL_SAVING_MEDIA_ITEM
	};
};

/**
 * Generator for the search media items catalog list action, which causes the request media items catalog action, the async media items catalog search and then the receive media items catalog action
 * @param term the search term
 * @returns the action
 */
export const searchMediaItemsCatalog = (term: string): SearchMediaItemsCatalogAction => {
	
	return {
		type: SEARCH_MEDIA_ITEMS_CATALOG,
		term: term
	};
};

/**
 * Generator for the start searching media items catalog action, which marks the start of the media items catalog searching operation
 * @returns the action
 */
export const startSearchingMediaItemsCatalog = (): StartSearchingMediaItemsCatalogAction => {
	
	return {
		type: START_SEARCHING_MEDIA_ITEMS_CATALOG
	};
};

/**
 * Generator for the complete searching media items catalog action, which marks the successful end of the media items catalog searching operation
 * @param results the catalog search results, possibly an empty array
 * @returns the action
 */
export const completeSearchingMediaItemsCatalog = (results: SearchMediaItemCatalogResultInternal[]): CompleteSearchingMediaItemsCatalogAction => {
	
	return {
		type: COMPLETE_SEARCHING_MEDIA_ITEMS_CATALOG,
		results: results
	};
};

/**
 * Generator for the fail searching media items catalog action, which marks the unsuccessful end of the media items catalog searching operation
 * @returns the action
 */
export const failSearchingMediaItemsCatalog = (): FailSearchingMediaItemsCatalogAction => {
	
	return {
		type: FAIL_SEARCHING_MEDIA_ITEMS_CATALOG
	};
};

/**
 * Generator for the reset media items catalog search action, which clears any saved catalog results
 * @returns the action
 */
export const resetMediaItemsCatalogSearch = (): ResetMediaItemsCatalogSearchAction => {
	
	return {
		type: RESET_MEDIA_ITEMS_CATALOG_SEARCH
	};
};

/**
 * Generator for the get media item catalog details list action, which causes the request media item catalog details action, the async media item catalog details fetch and then the receive media item catalog details action
 * @param catalogId the ID of the element for which the details are required
 * @returns the action
 */
export const getMediaItemCatalogDetails = (catalogId: string): GetMediaItemCatalogDetailsAction => {
	
	return {
		type: GET_MEDIA_ITEM_CATALOG_DETAILS,
		catalogId: catalogId
	};
};

/**
 * Generator for the start getting media item catalog details action, which marks the start of the media item catalog details fetching operation
 * @returns the action
 */
export const startGettingMediaItemCatalogDetails = (): StartGettingMediaItemCatalogDetailsAction => {
	
	return {
		type: START_GETTING_MEDIA_ITEM_CATALOG_DETAILS
	};
};

/**
 * Generator for the complete getting media item catalog details action, which marks the successful end of the media item catalog details fetching operation
 * @param details the fetched media item catalog details
 * @returns the action
 */
export const completeGettingMediaItemCatalogDetails = (details: CatalogMediaItemInternal): CompleteGettingMediaItemCatalogDetailsAction => {
	
	return {
		type: COMPLETE_GETTING_MEDIA_ITEM_CATALOG_DETAILS,
		details: details
	};
};

/**
 * Generator for the fail getting media item catalog details action, which marks the unsuccessful end of the media item catalog details fetching operation
 * @returns the action
 */
export const failGettingMediaItemCatalogDetails = (): FailGettingMediaItemCatalogDetailsAction => {
	
	return {
		type: FAIL_GETTING_MEDIA_ITEM_CATALOG_DETAILS
	};
};

/**
 * Generator for the reset media item catalog details action, which clears any saved catalog details
 * @returns the action
 */
export const resetMediaItemCatalogDetails = (): ResetMediaItemCatalogDetailsAction => {
	
	return {
		type: RESET_MEDIA_ITEM_CATALOG_DETAILS
	};
};
