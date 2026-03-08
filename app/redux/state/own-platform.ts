import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * Portion of the internal state with the global own platform data
 */
export type OwnPlatformGlobalState = {

	/**
	 * The current own platform, e.g. to show the currently selected own platform for a media item
	 * Undefined means no own platform has been selected yet
	 */
	selectedOwnPlatform: OwnPlatformInternal | undefined;
}

/**
 * Portion of the internal state with the own platforms list information
 */
export type OwnPlatformsListState = {

	/**
	 * The list of available own platforms
	 */
	readonly ownPlatforms: OwnPlatformInternal[];

	/**
	 * The current status of the own platforms list
	 */
	readonly status: OwnPlatformsListStatus;

	/**
	 * The currently highlighted (e.g. context menu is open) own platform, or undefined if none is highlighted
	 */
	readonly highlightedOwnPlatform: OwnPlatformInternal | undefined;
}

/**
 * Portion of the internal state with the own platform details information
 */
export type OwnPlatformDetailsState = {

	/**
	 * The own platform data
	 */
	readonly ownPlatform?: OwnPlatformInternal;

	/**
	 * If the currently loaded own platform is valid (no validation error occurred)
	 */
	readonly valid: boolean;

	/**
	 * If the currently loaded own platform is dirty (one or more fields are different from initial values)
	 */
	readonly dirty: boolean;

	/**
	 * The current status of the own platform saving process
	 */
	readonly saveStatus: OwnPlatformSaveStatus;
}

/**
 * The current status of the own platforms list
 */
export type OwnPlatformsListStatus = 'REQUIRES_FETCH' | 'FETCHING' | 'FETCHED' | 'DELETING';

/**
 * The current status of the own platform saving process
 */
export type OwnPlatformSaveStatus = 'IDLE' | 'REQUESTED' | 'REQUIRES_CONFIRMATION' | 'SAVING' | 'SAVED';
