import { mediaItemDefinitionsControllerFactory } from 'app/factories/controller-factories';
import { SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { SelectCategoryAction } from 'app/redux/actions/category/types';
import { COMPLETE_IMPORTING_OLD_APP_EXPORT } from 'app/redux/actions/import-export/const';
import { COMPLETE_DELETING_MEDIA_ITEM, COMPLETE_FETCHING_MEDIA_ITEMS, COMPLETE_INLINE_UPDATING_MEDIA_ITEM, COMPLETE_SAVING_MEDIA_ITEM, FAIL_DELETING_MEDIA_ITEM, FAIL_FETCHING_MEDIA_ITEMS, FAIL_INLINE_UPDATING_MEDIA_ITEM, HIGHLIGHT_MEDIA_ITEM, INVALIDATE_MEDIA_ITEMS, REMOVE_MEDIA_ITEM_HIGHLIGHT, SEARCH_MEDIA_ITEMS, START_DELETING_MEDIA_ITEM, START_FETCHING_MEDIA_ITEMS, START_INLINE_UPDATING_MEDIA_ITEM, START_MEDIA_ITEMS_SEARCH_MODE, START_MEDIA_ITEMS_SET_FILTERS_MODE, START_MEDIA_ITEMS_VIEW_GROUP_MODE, STOP_MEDIA_ITEMS_SEARCH_MODE, STOP_MEDIA_ITEMS_SET_FILTERS_MODE, STOP_MEDIA_ITEMS_VIEW_GROUP_MODE, SUBMIT_MEDIA_ITEMS_FILTERS } from 'app/redux/actions/media-item/const';
import { CompleteFetchingMediaItemsAction, HighlightMediaItemAction, SearchMediaItemsAction, StartMediaItemsViewGroupModeAction, SubmitMediaItemsFiltersAction } from 'app/redux/actions/media-item/types';
import { MediaItemsListState } from 'app/redux/state/media-item';
import { Action } from 'redux';

/**
 * The initial state for the media items list
 */
const initialState: MediaItemsListState = {
	status: 'REQUIRES_FETCH',
	mode: 'NORMAL',
	filter: undefined,
	sortBy: undefined,
	searchTerm: undefined,
	viewGroup: undefined,
	mediaItems: [],
	highlightedMediaItem: undefined
};

/**
 * Reducer for the media items list portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const mediaItemsList = (state: MediaItemsListState = initialState, action: Action): MediaItemsListState => {
	
	switch(action.type) {
	
		// When a category is selected (i.e. the media items page is opened), its default settings are loaded
		case SELECT_CATEGORY: {

			const openMediaItemsListAction = action as SelectCategoryAction;

			const category = openMediaItemsListAction.category;

			const mediaItemDefinitionsController = mediaItemDefinitionsControllerFactory.get(category);
			const defaultFilter = mediaItemDefinitionsController.getDefaultFilter();
			const defaultSortBy = mediaItemDefinitionsController.getDefaultSortBy();

			return {
				...initialState,
				filter: defaultFilter,
				sortBy: defaultSortBy
			};
		}

		// When the app starts fetching the list of media items, the status changes to show the loading indicator
		case START_FETCHING_MEDIA_ITEMS: {

			return {
				...state,
				status: 'FETCHING'
			};
		}
	
		// When the app completes the fetching process, the status is reset and the retrieved list is saved
		case COMPLETE_FETCHING_MEDIA_ITEMS: {

			const receiveMediaItemsAction = action as CompleteFetchingMediaItemsAction;
			
			return {
				...state,
				status: 'FETCHED',
				mediaItems: receiveMediaItemsAction.mediaItems
			};
		}

		// When the app fails to fetch the media items, the status is reset and an empty list is loaded (an error is shown by the global handler)
		case FAIL_FETCHING_MEDIA_ITEMS: {

			return {
				...state,
				status: 'FETCHED',
				mediaItems: []
			};
		}

		// When the list is explicitly invalidated, the list is marked for reload
		case INVALIDATE_MEDIA_ITEMS: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When a new media item has been successfully saved, the list is marked for reload
		case COMPLETE_SAVING_MEDIA_ITEM: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app starts deleting a media item, the status changes to show the loading indicator
		case START_DELETING_MEDIA_ITEM: {

			return {
				...state,
				status: 'DELETING'
			};
		}

		// When the app completes the delete process, the list is marked for reload
		case COMPLETE_DELETING_MEDIA_ITEM: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app fails to delete a media item, the status is reset (an error is shown by the global handler)
		case FAIL_DELETING_MEDIA_ITEM: {
		
			return {
				...state,
				status: 'FETCHED'
			};
		}
		
		// When the app starts an inline media item update, the status changes to show the loading indicator
		case START_INLINE_UPDATING_MEDIA_ITEM: {

			return {
				...state,
				status: 'INLINE_UPDATING'
			};
		}

		// When the app completes the inline update process, the list is marked for reload
		case COMPLETE_INLINE_UPDATING_MEDIA_ITEM: {
		
			return {
				...state,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the app fails to inline update a media item, the status is reset (an error is shown by the global handler)
		case FAIL_INLINE_UPDATING_MEDIA_ITEM: {
		
			return {
				...state,
				status: 'FETCHED'
			};
		}
		
		// When a media item is highlighted (e.g. to open the context menu), the corresponding state field is set
		case HIGHLIGHT_MEDIA_ITEM: {

			const highlightMediaItemAction = action as HighlightMediaItemAction;

			return {
				...state,
				highlightedMediaItem: highlightMediaItemAction.mediaItem
			};
		}

		// When a media item is no longer highlighted (e.g. to close the context menu), the corresponding state field is reset
		case REMOVE_MEDIA_ITEM_HIGHLIGHT: {

			return {
				...state,
				highlightedMediaItem: undefined
			};
		}
		
		// When the search mode is started, the mode field is set
		case START_MEDIA_ITEMS_SEARCH_MODE: {

			return {
				...state,
				mode: 'SEARCH'
			};
		}

		// When a search is submitted, the state field is set (the rest of the logic is handled by a saga, which is executed right after this reducer)
		case SEARCH_MEDIA_ITEMS: {

			const searchMediaItemsAction = action as SearchMediaItemsAction;

			return {
				...state,
				searchTerm: searchMediaItemsAction.term
			};
		}
		
		// When the search mode is closed, the mode and term fields are reset and the list is marked for reload (i.e. the standard version of the list is fetched)
		case STOP_MEDIA_ITEMS_SEARCH_MODE: {

			return {
				...state,
				mode: 'NORMAL',
				status: 'REQUIRES_FETCH',
				searchTerm: undefined
			};
		}
		
		// When the view group mode is started, the mode field is set and the selected group is set
		case START_MEDIA_ITEMS_VIEW_GROUP_MODE: {

			const startMediaItemsViewGroupModeAction = action as StartMediaItemsViewGroupModeAction;

			return {
				...state,
				mode: 'VIEW_GROUP',
				viewGroup: startMediaItemsViewGroupModeAction.group
			};
		}
		
		// When the view group mode is closed, the mode and group fields are reset and the list is marked for reload (i.e. the standard version of the list is fetched)
		case STOP_MEDIA_ITEMS_VIEW_GROUP_MODE: {

			return {
				...state,
				mode: 'NORMAL',
				status: 'REQUIRES_FETCH',
				viewGroup: undefined
			};
		}

		// When the "set filters" mode is started, the mode field is set
		case START_MEDIA_ITEMS_SET_FILTERS_MODE: {

			return {
				...state,
				mode: 'SET_FILTERS'
			};
		}

		// When the filters are submitted, they are saved in the state and the list is marked for reload
		case SUBMIT_MEDIA_ITEMS_FILTERS: {

			const submitMediaItemsFiltersAction = action as SubmitMediaItemsFiltersAction;

			return {
				...state,
				filter: submitMediaItemsFiltersAction.filter,
				sortBy: submitMediaItemsFiltersAction.sortBy,
				status: 'REQUIRES_FETCH'
			};
		}

		// When the "set filters" mode is closed, the mode field is reset
		case STOP_MEDIA_ITEMS_SET_FILTERS_MODE: {

			return {
				...state,
				mode: 'NORMAL'
			};
		}

		// When a bulk import completes, the list is reset
		case COMPLETE_IMPORTING_OLD_APP_EXPORT: {

			return {
				...initialState
			};
		}

		default:
			return state;
	}
};
