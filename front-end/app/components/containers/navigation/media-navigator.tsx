import { Component, ReactElement, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CategoriesListScreenContainer } from 'app/components/containers/category/list/screen';
import { CategoryDetailsScreenContainer } from 'app/components/containers/category/details/screen';
import { MediaItemsListScreenContainer } from 'app/components/containers/media-item/list/screen';
import { MediaItemDetailsScreenContainer } from 'app/components/containers/media-item/details/screen';
import { MediaItemUnsavedChangesGuardContainer } from 'app/components/containers/media-item/details/unsaved-changes-guard';
import { MediaItemsStatsScreenContainer } from 'app/components/containers/media-item/stats/screen';
import { ScreenContextGuardContainer } from 'app/components/containers/navigation/screen-context-guard';
import { GroupsListScreenContainer } from 'app/components/containers/group/list/screen';
import { GroupDetailsScreenContainer } from 'app/components/containers/group/details/screen';
import { OwnPlatformsListScreenContainer } from 'app/components/containers/own-platform/list/screen';
import { OwnPlatformDetailsScreenContainer } from 'app/components/containers/own-platform/details/screen';
import { TvShowSeasonsListScreenContainer } from 'app/components/containers/tv-show-season/list/screen';
import { TvShowSeasonDetailsScreenContainer } from 'app/components/containers/tv-show-season/details/screen';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';

const mediaSectionPath = screenToPath(AppSections.Media);

/**
 * Converts an absolute media screen path into a path relative to the media section route.
 * @param screen the app screen
 * @returns the media-relative route path
 */
const mediaRelativePath = (screen: string): string => {
	return screenToPath(screen).replace(`${mediaSectionPath}/`, '');
};

/**
 * Wraps a screen that the media item form opens (group, own platform and TV show season selection) with the unsaved changes guard, so
 * that leaving the app shell from there cannot silently discard the media item draft. Browser back is left alone, since it simply
 * returns to the form.
 * @param screen the screen to wrap
 * @returns the guarded screen
 */
const mediaItemFormSubScreen = (screen: ReactElement): ReactElement => {
	return (
		<MediaItemUnsavedChangesGuardContainer interceptBrowserBack={false}>
			{screen}
		</MediaItemUnsavedChangesGuardContainer>
	);
};

/**
 * Wraps a screen that cannot render without global context with the guard that redirects to the categories list when that
 * context is missing, e.g. when the route was opened directly instead of being reached from inside the app.
 * @param screen the app screen
 * @param element the screen to guard
 * @returns the guarded screen
 */
const contextGuardedScreen = (screen: string, element: ReactElement): ReactElement => {
	return (
		<ScreenContextGuardContainer screen={screen}>
			{element}
		</ScreenContextGuardContainer>
	);
};

/**
 * The navigator for the main section of the authenticated app, with the categories and media items lists
 */
export class MediaNavigator extends Component {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<Routes>
				<Route path={mediaRelativePath(AppScreens.CategoriesList)} element={<CategoriesListScreenContainer />} />
				<Route path={mediaRelativePath(AppScreens.CategoryDetails)} element={contextGuardedScreen(AppScreens.CategoryDetails, <CategoryDetailsScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.MediaItemsList)} element={contextGuardedScreen(AppScreens.MediaItemsList, <MediaItemsListScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.MediaItemDetails)} element={contextGuardedScreen(AppScreens.MediaItemDetails, <MediaItemDetailsScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.MediaItemsStats)} element={contextGuardedScreen(AppScreens.MediaItemsStats, <MediaItemsStatsScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.GroupsList)} element={contextGuardedScreen(AppScreens.GroupsList, mediaItemFormSubScreen(<GroupsListScreenContainer />))} />
				<Route path={mediaRelativePath(AppScreens.GroupDetails)} element={contextGuardedScreen(AppScreens.GroupDetails, mediaItemFormSubScreen(<GroupDetailsScreenContainer />))} />
				<Route path={mediaRelativePath(AppScreens.OwnPlatformsList)} element={contextGuardedScreen(AppScreens.OwnPlatformsList, mediaItemFormSubScreen(<OwnPlatformsListScreenContainer />))} />
				<Route path={mediaRelativePath(AppScreens.OwnPlatformDetails)} element={contextGuardedScreen(AppScreens.OwnPlatformDetails, mediaItemFormSubScreen(<OwnPlatformDetailsScreenContainer />))} />
				<Route path={mediaRelativePath(AppScreens.TvShowSeasonsList)} element={contextGuardedScreen(AppScreens.TvShowSeasonsList, mediaItemFormSubScreen(<TvShowSeasonsListScreenContainer />))} />
				<Route path={mediaRelativePath(AppScreens.TvShowSeasonDetails)} element={contextGuardedScreen(AppScreens.TvShowSeasonDetails, mediaItemFormSubScreen(<TvShowSeasonDetailsScreenContainer />))} />
				<Route path='*' element={<Navigate to={mediaRelativePath(AppScreens.CategoriesList)} replace={true} />} />
			</Routes>
		);
	}
}
