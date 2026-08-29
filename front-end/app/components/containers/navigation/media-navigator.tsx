import { Component, ReactElement, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CategoriesListScreenContainer } from 'app/components/containers/category/list/screen';
import { CategoryDetailsScreenContainer } from 'app/components/containers/category/details/screen';
import { MediaItemsListScreenContainer } from 'app/components/containers/media-item/list/screen';
import { MediaItemDetailsScreenContainer } from 'app/components/containers/media-item/details/screen';
import { MediaItemUnsavedChangesGuardContainer } from 'app/components/containers/media-item/details/unsaved-changes-guard';
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
				<Route path={mediaRelativePath(AppScreens.CategoryDetails)} element={<CategoryDetailsScreenContainer />} />
				<Route path={mediaRelativePath(AppScreens.MediaItemsList)} element={<MediaItemsListScreenContainer />} />
				<Route path={mediaRelativePath(AppScreens.MediaItemDetails)} element={<MediaItemDetailsScreenContainer />} />
				<Route path={mediaRelativePath(AppScreens.GroupsList)} element={mediaItemFormSubScreen(<GroupsListScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.GroupDetails)} element={mediaItemFormSubScreen(<GroupDetailsScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.OwnPlatformsList)} element={mediaItemFormSubScreen(<OwnPlatformsListScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.OwnPlatformDetails)} element={mediaItemFormSubScreen(<OwnPlatformDetailsScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.TvShowSeasonsList)} element={mediaItemFormSubScreen(<TvShowSeasonsListScreenContainer />)} />
				<Route path={mediaRelativePath(AppScreens.TvShowSeasonDetails)} element={mediaItemFormSubScreen(<TvShowSeasonDetailsScreenContainer />)} />
				<Route path='*' element={<Navigate to={mediaRelativePath(AppScreens.CategoriesList)} replace={true} />} />
			</Routes>
		);
	}
}
