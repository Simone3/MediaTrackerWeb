import { mediaItemDefinitionsControllerFactory } from 'app/factories/controller-factories';
import { ASK_CONFIRMATION_BEFORE_SAVING_MEDIA_ITEM, COMPLETE_GETTING_MEDIA_ITEM_CATALOG_DETAILS, COMPLETE_SAVING_MEDIA_ITEM, COMPLETE_SEARCHING_MEDIA_ITEMS_CATALOG, FAIL_GETTING_MEDIA_ITEM_CATALOG_DETAILS, FAIL_SAVING_MEDIA_ITEM, FAIL_SEARCHING_MEDIA_ITEMS_CATALOG, LOAD_MEDIA_ITEM_DETAILS, LOAD_NEW_MEDIA_ITEM_DETAILS, REQUEST_MEDIA_ITEM_SAVE, RESET_MEDIA_ITEMS_CATALOG_SEARCH, RESET_MEDIA_ITEM_CATALOG_DETAILS, SET_MEDIA_ITEM_FORM_STATUS, START_GETTING_MEDIA_ITEM_CATALOG_DETAILS, START_SAVING_MEDIA_ITEM, START_SEARCHING_MEDIA_ITEMS_CATALOG } from 'app/redux/actions/media-item/const';
import { CompleteGettingMediaItemCatalogDetailsAction, CompleteSearchingMediaItemsCatalogAction, LoadMediaItemDetailsAction, LoadNewMediaItemDetailsAction, SetMediaItemFormStatusAction, StartSavingMediaItemAction } from 'app/redux/actions/media-item/types';
import { MediaItemDetailsState } from 'app/redux/state/media-item';
import { Action } from 'redux';

/**
 * The initial state for the media item details
 */
const initialState: MediaItemDetailsState = {
	mediaItem: undefined,
	valid: false,
	dirty: false,
	saveStatus: 'IDLE',
	catalogSearchResults: undefined,
	catalogDetails: undefined,
	catalogStatus: 'IDLE'
};

/**
 * Reducer for the media item details portion of the global state
 * @param state previous state
 * @param action an action
 * @returns the new state
 */
export const mediaItemDetails = (state: MediaItemDetailsState = initialState, action: Action): MediaItemDetailsState => {
	
	switch(action.type) {

		// When the details page is started with a new media item, the status and other support fields are reset and the default media item is loaded
		case LOAD_NEW_MEDIA_ITEM_DETAILS: {

			const loadNewMediaItemAction = action as LoadNewMediaItemDetailsAction;
			const definitionsController = mediaItemDefinitionsControllerFactory.get(loadNewMediaItemAction.category);

			return {
				...state,
				saveStatus: 'IDLE',
				mediaItem: definitionsController.getDefaultMediaItem(),
				catalogSearchResults: undefined,
				catalogDetails: undefined,
				catalogStatus: 'IDLE'
			};
		}
	
		// When the details page is started with an existing media item, the status and other support fields are reset and the given media item is loaded
		case LOAD_MEDIA_ITEM_DETAILS: {

			const loadMediaItemAction = action as LoadMediaItemDetailsAction;
			
			return {
				...state,
				saveStatus: 'IDLE',
				mediaItem: loadMediaItemAction.mediaItem,
				catalogSearchResults: undefined,
				catalogDetails: undefined,
				catalogStatus: 'IDLE'
			};
		}
	
		// When the form status changes, the corresponding state fields are set
		case SET_MEDIA_ITEM_FORM_STATUS: {

			const setMediaItemFormStatusAction = action as SetMediaItemFormStatusAction;
			
			return {
				...state,
				valid: setMediaItemFormStatusAction.valid,
				dirty: setMediaItemFormStatusAction.dirty
			};
		}

		// When the media item save is requested, the status changes (e.g. allows header save button to notify the form about the request)
		case REQUEST_MEDIA_ITEM_SAVE: {

			return {
				...state,
				saveStatus: 'REQUESTED'
			};
		}
	
		// When the app starts saving a media item, the status changes to show the loading indicator
		case START_SAVING_MEDIA_ITEM: {

			const startSavingMediaItemAction = action as StartSavingMediaItemAction;

			return {
				...state,
				mediaItem: startSavingMediaItemAction.mediaItem,
				saveStatus: 'SAVING'
			};
		}
	
		// When the app requires a confirmation before saving a media item, the status changes to show the alert
		case ASK_CONFIRMATION_BEFORE_SAVING_MEDIA_ITEM: {

			return {
				...state,
				saveStatus: 'REQUIRES_CONFIRMATION'
			};
		}
	
		// When the app completes the save process, the status changes (at this point a navigation back to the list is expected)
		case COMPLETE_SAVING_MEDIA_ITEM: {

			return {
				...state,
				saveStatus: 'SAVED'
			};
		}
	
		// When the app fails to save a media item, the status is reset (an error is shown by the global handler)
		case FAIL_SAVING_MEDIA_ITEM: {

			return {
				...state,
				saveStatus: 'IDLE'
			};
		}

		// When the app starts searching the media items catalog, the status changes to show the loading indicator
		case START_SEARCHING_MEDIA_ITEMS_CATALOG: {

			return {
				...state,
				catalogStatus: 'FETCHING'
			};
		}

		// When the app completes searching the media items catalog, the status changes and the results are loaded
		case COMPLETE_SEARCHING_MEDIA_ITEMS_CATALOG: {

			const completeSearchingMediaItemsCatalog = action as CompleteSearchingMediaItemsCatalogAction;

			return {
				...state,
				catalogSearchResults: completeSearchingMediaItemsCatalog.results,
				catalogStatus: 'IDLE'
			};
		}

		// When the app fails to search the media items catalog, the status is reset (an error is shown by the global handler)
		case FAIL_SEARCHING_MEDIA_ITEMS_CATALOG: {

			return {
				...state,
				catalogStatus: 'IDLE'
			};
		}

		// When the catalog search is reset (e.g. user clicks outside the results list dialog), the results are cleared
		case RESET_MEDIA_ITEMS_CATALOG_SEARCH: {

			return {
				...state,
				catalogSearchResults: undefined
			};
		}

		// When the app starts loading a media item catalog details, the status changes to show the loading indicator
		case START_GETTING_MEDIA_ITEM_CATALOG_DETAILS: {

			return {
				...state,
				catalogStatus: 'FETCHING'
			};
		}

		// When the app completes loading a media item catalog details, the status changes, the search results are cleared and the details are loaded
		case COMPLETE_GETTING_MEDIA_ITEM_CATALOG_DETAILS: {

			const completeGettingMediaItemCatalogDetailsAction = action as CompleteGettingMediaItemCatalogDetailsAction;

			return {
				...state,
				catalogSearchResults: undefined,
				catalogDetails: completeGettingMediaItemCatalogDetailsAction.details,
				catalogStatus: 'IDLE'
			};
		}

		// When the app fails to load a media item catalog details, the status is reset (an error is shown by the global handler)
		case FAIL_GETTING_MEDIA_ITEM_CATALOG_DETAILS: {

			return {
				...state,
				catalogStatus: 'IDLE'
			};
		}

		// When the catalog details are reset (e.g. the form is done loading the input fields), the details are cleared
		case RESET_MEDIA_ITEM_CATALOG_DETAILS: {

			return {
				...state,
				catalogDetails: undefined
			};
		}

		default:
			return state;
	}
};
