import { CategoriesListScreenContainer } from 'app/components/containers/category/list/screen';
import { CategoryDetailsScreenContainer } from 'app/components/containers/category/details/screen';
import { MediaItemsListScreenContainer } from 'app/components/containers/media-item/list/screen';
import { MediaItemDetailsScreenContainer } from 'app/components/containers/media-item/details/screen';
import { PlaceholderScreenComponent } from 'app/components/presentational/generic/placeholder-screen';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const phase2Message = 'TODO phase2: this screen is not migrated yet. Navigation and state wiring are ready.';
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
					element={<PlaceholderScreenComponent title={i18n.t('group.list.title')} message={phase2Message} />} />
				<Route
					path={mediaRelativePath(AppScreens.GroupDetails)}
					element={<PlaceholderScreenComponent title='Group Details' message={phase2Message} />} />
				<Route
					path={mediaRelativePath(AppScreens.OwnPlatformsList)}
					element={<PlaceholderScreenComponent title={i18n.t('ownPlatform.list.title')} message={phase2Message} />} />
				<Route
					path={mediaRelativePath(AppScreens.OwnPlatformDetails)}
					element={<PlaceholderScreenComponent title='Own Platform Details' message={phase2Message} />} />
				<Route
					path={mediaRelativePath(AppScreens.TvShowSeasonsList)}
					element={<PlaceholderScreenComponent title={i18n.t('tvShowSeason.list.title')} message={phase2Message} />} />
				<Route
					path={mediaRelativePath(AppScreens.TvShowSeasonDetails)}
					element={<PlaceholderScreenComponent title='TV Show Season Details' message={phase2Message} />} />
				<Route path='*' element={<Navigate to={mediaRelativePath(AppScreens.CategoriesList)} replace={true} />} />
			</Routes>
		);
	}
}
