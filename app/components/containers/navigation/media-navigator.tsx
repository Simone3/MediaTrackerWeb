import { CategoriesListScreenContainer } from 'app/components/containers/category/list/screen';
import { CategoryDetailsScreenContainer } from 'app/components/containers/category/details/screen';
import { MediaItemsListScreenContainer } from 'app/components/containers/media-item/list/screen';
import { MediaItemDetailsScreenContainer } from 'app/components/containers/media-item/details/screen';
import { GroupsListScreenContainer } from 'app/components/containers/group/list/screen';
import { GroupDetailsScreenContainer } from 'app/components/containers/group/details/screen';
import { OwnPlatformsListScreenContainer } from 'app/components/containers/own-platform/list/screen';
import { OwnPlatformDetailsScreenContainer } from 'app/components/containers/own-platform/details/screen';
import { TvShowSeasonsListScreenContainer } from 'app/components/containers/tv-show-season/list/screen';
import { TvShowSeasonDetailsScreenContainer } from 'app/components/containers/tv-show-season/details/screen';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

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
				<Route
					path={mediaRelativePath(AppScreens.CategoryDetails)}
					element={<CategoryDetailsScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.MediaItemsList)}
					element={<MediaItemsListScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.MediaItemDetails)}
					element={<MediaItemDetailsScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.GroupsList)}
					element={<GroupsListScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.GroupDetails)}
					element={<GroupDetailsScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.OwnPlatformsList)}
					element={<OwnPlatformsListScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.OwnPlatformDetails)}
					element={<OwnPlatformDetailsScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.TvShowSeasonsList)}
					element={<TvShowSeasonsListScreenContainer />} />
				<Route
					path={mediaRelativePath(AppScreens.TvShowSeasonDetails)}
					element={<TvShowSeasonDetailsScreenContainer />} />
				<Route path='*' element={<Navigate to={mediaRelativePath(AppScreens.CategoriesList)} replace={true} />} />
			</Routes>
		);
	}
}
