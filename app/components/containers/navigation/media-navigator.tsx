import { createStackNavigator } from '@react-navigation/stack';
import { CategoryDetailsHeaderContainer } from 'app/components/containers/category/details/header';
import { CategoryDetailsHeaderBackButtonContainer } from 'app/components/containers/category/details/header-back-button';
import { CategoryDetailsHeaderSaveIconContainer } from 'app/components/containers/category/details/header-save-icon';
import { CategoryDetailsScreenContainer } from 'app/components/containers/category/details/screen';
import { CategoriesListScreenContainer } from 'app/components/containers/category/list/screen';
import { GroupDetailsHeaderContainer } from 'app/components/containers/group/details/header';
import { GroupDetailsHeaderBackButtonContainer } from 'app/components/containers/group/details/header-back-button';
import { GroupDetailsHeaderSaveIconContainer } from 'app/components/containers/group/details/header-save-icon';
import { GroupDetailsScreenContainer } from 'app/components/containers/group/details/screen';
import { GroupsListScreenContainer } from 'app/components/containers/group/list/screen';
import { MediaItemDetailsHeaderContainer } from 'app/components/containers/media-item/details/header';
import { MediaItemDetailsHeaderBackButtonContainer } from 'app/components/containers/media-item/details/header-back-button';
import { MediaItemDetailsHeaderSaveIconContainer } from 'app/components/containers/media-item/details/header-save-icon';
import { MediaItemDetailsScreenContainer } from 'app/components/containers/media-item/details/screen';
import { MediaItemsListHeaderContainer } from 'app/components/containers/media-item/list/header';
import { MediaItemsListHeaderFilterIconContainer } from 'app/components/containers/media-item/list/header-filter-icon';
import { MediaItemsListHeaderSearchIconContainer } from 'app/components/containers/media-item/list/header-search-icon';
import { MediaItemsListScreenContainer } from 'app/components/containers/media-item/list/screen';
import { defaultScreenOptions } from 'app/components/containers/navigation/global';
import { OwnPlatformDetailsHeaderContainer } from 'app/components/containers/own-platform/details/header';
import { OwnPlatformDetailsHeaderBackButtonContainer } from 'app/components/containers/own-platform/details/header-back-button';
import { OwnPlatformDetailsHeaderSaveIconContainer } from 'app/components/containers/own-platform/details/header-save-icon';
import { OwnPlatformDetailsScreenContainer } from 'app/components/containers/own-platform/details/screen';
import { OwnPlatformsListScreenContainer } from 'app/components/containers/own-platform/list/screen';
import { TvShowSeasonDetailsHeaderContainer } from 'app/components/containers/tv-show-season/details/header';
import { TvShowSeasonDetailsHeaderBackButtonContainer } from 'app/components/containers/tv-show-season/details/header-back-button';
import { TvShowSeasonDetailsHeaderSaveIconContainer } from 'app/components/containers/tv-show-season/details/header-save-icon';
import { TvShowSeasonDetailsScreenContainer } from 'app/components/containers/tv-show-season/details/screen';
import { TvShowSeasonsListHeaderBackButtonContainer } from 'app/components/containers/tv-show-season/list/header-back-button';
import { TvShowSeasonsListScreenContainer } from 'app/components/containers/tv-show-season/list/screen';
import { HeaderComponent } from 'app/components/presentational/generic/header';
import { HeaderBackComponent } from 'app/components/presentational/generic/header-back';
import { HeaderHamburgerComponent } from 'app/components/presentational/generic/header-hamburger';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { AppScreens } from 'app/utilities/screens';
import React, { Component, ReactNode } from 'react';

const MediaStack = createStackNavigator();

/**
 * The navigator for the main section of the authenticated app, with the categories and media items lists
 */
export class MediaNavigator extends Component {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<MediaStack.Navigator
				initialRouteName={AppScreens.CategoriesList}
				screenOptions={defaultScreenOptions}>
				<MediaStack.Screen
					name={AppScreens.CategoriesList}
					component={CategoriesListScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: () => {
								return (
									<HeaderComponent
										title={i18n.t('category.list.title')}
										componentsLeft={<HeaderHamburgerComponent navigationScreenProps={navigationScreenProps} />}
									/>
								);
							}
						};
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.CategoryDetails}
					component={CategoryDetailsScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<CategoryDetailsHeaderContainer
										componentsLeft={<CategoryDetailsHeaderBackButtonContainer navigation={navigationScreenProps.navigation} />}
										componentsRight={<CategoryDetailsHeaderSaveIconContainer />}
									/>
								);
							}
						};
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.MediaItemsList}
					component={MediaItemsListScreenContainer}
					options={{
						headerTitle: (): ReactNode => {
							return (
								<MediaItemsListHeaderContainer
									componentsLeft={
										<HeaderBackComponent />
									}
									componentsRight={[
										<MediaItemsListHeaderFilterIconContainer
											key='herader-filter-icon'
											source={images.filterButton()}
											clickStatus='ENABLED'
										/>,
										<MediaItemsListHeaderSearchIconContainer
											key='herader-search-icon'
											source={images.searchButton()}
											clickStatus='ENABLED'
										/>
									]}
								/>
							);
						}
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.MediaItemDetails}
					component={MediaItemDetailsScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<MediaItemDetailsHeaderContainer
										componentsLeft={<MediaItemDetailsHeaderBackButtonContainer navigation={navigationScreenProps.navigation} />}
										componentsRight={<MediaItemDetailsHeaderSaveIconContainer />}
									/>
								);
							}
						};
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.OwnPlatformsList}
					component={OwnPlatformsListScreenContainer}
					options={{
						headerTitle: (): ReactNode => {
							return (
								<HeaderComponent
									title={i18n.t('ownPlatform.list.title')}
									componentsLeft={
										<HeaderBackComponent />
									}
								/>
							);
						}
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.GroupsList}
					component={GroupsListScreenContainer}
					options={{
						headerTitle: (): ReactNode => {
							return (
								<HeaderComponent
									title={i18n.t('group.list.title')}
									componentsLeft={
										<HeaderBackComponent />
									}
								/>
							);
						}
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.GroupDetails}
					component={GroupDetailsScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<GroupDetailsHeaderContainer
										componentsLeft={<GroupDetailsHeaderBackButtonContainer navigation={navigationScreenProps.navigation} />}
										componentsRight={<GroupDetailsHeaderSaveIconContainer />}
									/>
								);
							}
						};
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.OwnPlatformDetails}
					component={OwnPlatformDetailsScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<OwnPlatformDetailsHeaderContainer
										componentsLeft={<OwnPlatformDetailsHeaderBackButtonContainer navigation={navigationScreenProps.navigation} />}
										componentsRight={<OwnPlatformDetailsHeaderSaveIconContainer />}
									/>
								);
							}
						};
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.TvShowSeasonsList}
					component={TvShowSeasonsListScreenContainer}
					options={{
						headerTitle: (): ReactNode => {
							return (
								<HeaderComponent
									title={i18n.t('tvShowSeason.list.title')}
									componentsLeft={
										<TvShowSeasonsListHeaderBackButtonContainer />
									}
								/>
							);
						}
					}}
				/>
				<MediaStack.Screen
					name={AppScreens.TvShowSeasonDetails}
					component={TvShowSeasonDetailsScreenContainer}
					options={(navigationScreenProps) => {
						return {
							headerTitle: (): ReactNode => {
								return (
									<TvShowSeasonDetailsHeaderContainer
										componentsLeft={<TvShowSeasonDetailsHeaderBackButtonContainer navigation={navigationScreenProps.navigation} />}
										componentsRight={<TvShowSeasonDetailsHeaderSaveIconContainer />}
									/>
								);
							}
						};
					}}
				/>
			</MediaStack.Navigator>
		);
	}
}
