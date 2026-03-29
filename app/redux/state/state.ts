import { CategoriesListState, CategoryDetailsState, CategoryGlobalState, mapCategoriesListForPersistence, mapCategoryDetailsForPersistence, mapCategoryGlobalForPersistence } from 'app/redux/state/category';
import { ErrorState, mapErrorForPersistence } from 'app/redux/state/error';
import { GroupDetailsState, GroupGlobalState, GroupsListState, mapGroupDetailsForPersistence, mapGroupGlobalForPersistence, mapGroupsListForPersistence } from 'app/redux/state/group';
import { MediaItemDetailsState, MediaItemsListState, mapMediaItemDetailsForPersistence, mapMediaItemsListForPersistence } from 'app/redux/state/media-item';
import { OwnPlatformDetailsState, OwnPlatformGlobalState, OwnPlatformsListState, mapOwnPlatformDetailsForPersistence, mapOwnPlatformGlobalForPersistence, mapOwnPlatformsListForPersistence } from 'app/redux/state/own-platform';
import { TvShowSeasonDetailsState, TvShowSeasonsListState, mapTvShowSeasonDetailsForPersistence, mapTvShowSeasonsListForPersistence } from 'app/redux/state/tv-show-season';
import { UserGlobalState, UserOperationsState, mapUserGlobalForPersistence, mapUserOperationsForPersistence } from 'app/redux/state/user';

/**
 * The global application state (handled by Redux)
 */
export class State {

	/**
	 * Portion of the state with the global error data
	 */
	public readonly error!: ErrorState;

	/**
	 * Portion of the state with the global user information
	 */
	public readonly userGlobal!: UserGlobalState;

	/**
	 * Portion of the state with the user operations progress state
	 */
	public readonly userOperations!: UserOperationsState;

	/**
	 * Portion of the state with the global category data
	 */
	public readonly categoryGlobal!: CategoryGlobalState;

	/**
	 * Portion of the state with the categories list information
	 */
	public readonly categoriesList!: CategoriesListState;

	/**
	 * Portion of the state with the category details information
	 */
	public readonly categoryDetails!: CategoryDetailsState;

	/**
	 * Portion of the state with the media items list information
	 */
	public readonly mediaItemsList!: MediaItemsListState;

	/**
	 * Portion of the state with the media item details information
	 */
	public readonly mediaItemDetails!: MediaItemDetailsState;

	/**
	 * Portion of the state with the TV show seasons list information
	 */
	public readonly groupsList!: GroupsListState;

	/**
	 * Portion of the state with the TV shows season details information
	 */
	public readonly groupDetails!: GroupDetailsState;

	/**
	 * Portion of the state with the global group data
	 */
	public readonly groupGlobal!: GroupGlobalState;

	/**
	 * Portion of the state with the TV show seasons list information
	 */
	public readonly tvShowSeasonsList!: TvShowSeasonsListState;

	/**
	 * Portion of the state with the TV show season details information
	 */
	public readonly tvShowSeasonDetails!: TvShowSeasonDetailsState;

	/**
	 * Portion of the state with the global own platform data
	 */
	public readonly ownPlatformGlobal!: OwnPlatformGlobalState;

	/**
	 * Portion of the state with the own platforms list information
	 */
	public readonly ownPlatformsList!: OwnPlatformsListState;

	/**
	 * Portion of the state with the own platform details information
	 */
	public readonly ownPlatformDetails!: OwnPlatformDetailsState;

}

/**
 * Utility to map the state for persistence
 * @param state the current state
 * @returns the mapped state
 */
export const mapStateForPersistence = (state: State): State => {
	return {
		error: mapErrorForPersistence(),
		userGlobal: mapUserGlobalForPersistence(),
		userOperations: mapUserOperationsForPersistence(),
		categoryGlobal: mapCategoryGlobalForPersistence(state.categoryGlobal),
		categoriesList: mapCategoriesListForPersistence(state.categoriesList),
		categoryDetails: mapCategoryDetailsForPersistence(state.categoryDetails),
		mediaItemsList: mapMediaItemsListForPersistence(state.mediaItemsList),
		mediaItemDetails: mapMediaItemDetailsForPersistence(state.mediaItemDetails),
		tvShowSeasonsList: mapTvShowSeasonsListForPersistence(state.tvShowSeasonsList),
		tvShowSeasonDetails: mapTvShowSeasonDetailsForPersistence(state.tvShowSeasonDetails),
		groupGlobal: mapGroupGlobalForPersistence(state.groupGlobal),
		groupsList: mapGroupsListForPersistence(state.groupsList),
		groupDetails: mapGroupDetailsForPersistence(state.groupDetails),
		ownPlatformGlobal: mapOwnPlatformGlobalForPersistence(state.ownPlatformGlobal),
		ownPlatformsList: mapOwnPlatformsListForPersistence(state.ownPlatformsList),
		ownPlatformDetails: mapOwnPlatformDetailsForPersistence(state.ownPlatformDetails)
	};
};
