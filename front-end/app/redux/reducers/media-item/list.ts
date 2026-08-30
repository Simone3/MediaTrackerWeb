import { Action } from 'redux';
import { config } from 'app/config/config';
import { mediaItemDefinitionsControllerFactory } from 'app/controllers/main/entities/media-items/factories';
import { SELECT_CATEGORY } from 'app/redux/actions/category/const';
import { SelectCategoryAction } from 'app/redux/actions/category/types';
import { CHANGE_MEDIA_ITEMS_PAGE, COMPLETE_DELETING_MEDIA_ITEM, COMPLETE_FETCHING_MEDIA_ITEMS, COMPLETE_INLINE_UPDATING_MEDIA_ITEM, COMPLETE_SAVING_MEDIA_ITEM, FAIL_DELETING_MEDIA_ITEM, FAIL_FETCHING_MEDIA_ITEMS, FAIL_INLINE_UPDATING_MEDIA_ITEM, HIGHLIGHT_MEDIA_ITEM, INVALIDATE_MEDIA_ITEMS, REMOVE_MEDIA_ITEM_HIGHLIGHT, SEARCH_MEDIA_ITEMS, START_DELETING_MEDIA_ITEM, START_FETCHING_MEDIA_ITEMS, START_INLINE_UPDATING_MEDIA_ITEM, START_MEDIA_ITEMS_SEARCH_MODE, START_MEDIA_ITEMS_SET_FILTERS_MODE, START_MEDIA_ITEMS_VIEW_GROUP_MODE, STOP_MEDIA_ITEMS_SEARCH_MODE, STOP_MEDIA_ITEMS_SET_FILTERS_MODE, STOP_MEDIA_ITEMS_VIEW_GROUP_MODE, SUBMIT_MEDIA_ITEMS_FILTERS } from 'app/redux/actions/media-item/const';
import { ChangeMediaItemsPageAction, CompleteFetchingMediaItemsAction, HighlightMediaItemAction, SearchMediaItemsAction, StartMediaItemsViewGroupModeAction, SubmitMediaItemsFiltersAction } from 'app/redux/actions/media-item/types';
import { MediaItemsListState, mediaItemsListStateInitialValue } from 'app/redux/state/media-item';

/**
 * Reducer for the media items list portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const mediaItemsList = (state: MediaItemsListState = mediaItemsListStateInitialValue, action: Action): MediaItemsListState => {
	switch(action.type) {
		// When a category is selected (i.e. the media items page is opened), its default settings are loaded
		case SELECT_CATEGORY: {
			const openMediaItemsListAction = action as SelectCategoryAction;

			const category = openMediaItemsListAction.category;

			const mediaItemDefinitionsController = mediaItemDefinitionsControllerFactory.get(category);
			const defaultFilter = mediaItemDefinitionsController.getDefaultFilter();
			const defaultSortBy = mediaItemDefinitionsController.getDefaultSortBy();

			return {
				...mediaItemsListStateInitialValue,
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
	
		// When the app completes the fetching process, the status is reset and the retrieved page is saved
		case COMPLETE_FETCHING_MEDIA_ITEMS: {
			const receiveMediaItemsAction = action as CompleteFetchingMediaItemsAction;

			const totalCount = receiveMediaItemsAction.totalCount;
			const lastPage = Math.max(0, Math.ceil(totalCount / config.ui.mediaItemsPageSize) - 1);

			// The current page can stop existing while the user is on it, e.g. after deleting the only media item it
			// contained: fall back to the last page that does exist and reload, unless nothing matches at all anymore
			if(state.currentPage > lastPage) {
				return {
					...state,
					status: totalCount === 0 ? 'FETCHED' : 'REQUIRES_FETCH',
					currentPage: lastPage,
					mediaItems: receiveMediaItemsAction.mediaItems,
					totalCount: totalCount
				};
			}

			return {
				...state,
				status: 'FETCHED',
				mediaItems: receiveMediaItemsAction.mediaItems,
				totalCount: totalCount
			};
		}

		// When another page is requested, it is saved in the state and the list is marked for reload
		case CHANGE_MEDIA_ITEMS_PAGE: {
			const changeMediaItemsPageAction = action as ChangeMediaItemsPageAction;

			return {
				...state,
				status: 'REQUIRES_FETCH',
				currentPage: changeMediaItemsPageAction.page
			};
		}

		// When the app fails to fetch the media items, the status is updated without clearing the last known list
		case FAIL_FETCHING_MEDIA_ITEMS: {
			return {
				...state,
				status: 'FETCH_FAILED'
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
				searchTerm: searchMediaItemsAction.term,
				currentPage: 0
			};
		}
		
		// When the search mode is closed, the mode and term fields are reset and the list is marked for reload (i.e. the standard version of the list is fetched)
		case STOP_MEDIA_ITEMS_SEARCH_MODE: {
			return {
				...state,
				mode: 'NORMAL',
				status: 'REQUIRES_FETCH',
				searchTerm: undefined,
				currentPage: 0
			};
		}
		
		// When the view group mode is started, the mode field is set and the selected group is set
		case START_MEDIA_ITEMS_VIEW_GROUP_MODE: {
			const startMediaItemsViewGroupModeAction = action as StartMediaItemsViewGroupModeAction;

			return {
				...state,
				mode: 'VIEW_GROUP',
				viewGroup: startMediaItemsViewGroupModeAction.group,
				currentPage: 0
			};
		}
		
		// When the view group mode is closed, the mode and group fields are reset and the list is marked for reload (i.e. the standard version of the list is fetched)
		case STOP_MEDIA_ITEMS_VIEW_GROUP_MODE: {
			return {
				...state,
				mode: 'NORMAL',
				status: 'REQUIRES_FETCH',
				viewGroup: undefined,
				currentPage: 0
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
				status: 'REQUIRES_FETCH',
				currentPage: 0
			};
		}

		// When the "set filters" mode is closed, the mode field is reset
		case STOP_MEDIA_ITEMS_SET_FILTERS_MODE: {
			return {
				...state,
				mode: 'NORMAL'
			};
		}

		default:
			return state;
	}
};
