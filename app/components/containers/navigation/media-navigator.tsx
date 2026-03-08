import { CategoriesListScreenContainer } from 'app/components/containers/category/list/screen';
import { CategoryDetailsScreenContainer } from 'app/components/containers/category/details/screen';
import { MediaItemsListScreenContainer } from 'app/components/containers/media-item/list/screen';
import { PlaceholderScreenComponent } from 'app/components/presentational/generic/placeholder-screen';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const phase2Message = 'TODO phase2: this screen is not migrated yet. Navigation and state wiring are ready.';

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
				<Route path={screenToPath(AppScreens.CategoriesList)} element={<CategoriesListScreenContainer />} />
				<Route
					path={screenToPath(AppScreens.CategoryDetails)}
					element={<CategoryDetailsScreenContainer />} />
				<Route
					path={screenToPath(AppScreens.MediaItemsList)}
					element={<MediaItemsListScreenContainer />} />
				<Route
					path={screenToPath(AppScreens.MediaItemDetails)}
					element={<PlaceholderScreenComponent title='Media Item Details' message={phase2Message} />} />
				<Route
					path={screenToPath(AppScreens.GroupsList)}
					element={<PlaceholderScreenComponent title={i18n.t('group.list.title')} message={phase2Message} />} />
				<Route
					path={screenToPath(AppScreens.GroupDetails)}
					element={<PlaceholderScreenComponent title='Group Details' message={phase2Message} />} />
				<Route
					path={screenToPath(AppScreens.OwnPlatformsList)}
					element={<PlaceholderScreenComponent title={i18n.t('ownPlatform.list.title')} message={phase2Message} />} />
				<Route
					path={screenToPath(AppScreens.OwnPlatformDetails)}
					element={<PlaceholderScreenComponent title='Own Platform Details' message={phase2Message} />} />
				<Route
					path={screenToPath(AppScreens.TvShowSeasonsList)}
					element={<PlaceholderScreenComponent title={i18n.t('tvShowSeason.list.title')} message={phase2Message} />} />
				<Route
					path={screenToPath(AppScreens.TvShowSeasonDetails)}
					element={<PlaceholderScreenComponent title='TV Show Season Details' message={phase2Message} />} />
				<Route path='*' element={<Navigate to={screenToPath(AppScreens.CategoriesList)} replace={true} />} />
			</Routes>
		);
	}
}
