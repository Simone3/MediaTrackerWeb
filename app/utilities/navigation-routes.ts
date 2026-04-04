import { AppError } from 'app/data/models/internal/error';
import { AppScreens, AppSections } from 'app/utilities/screens';

/**
 * Centralized map between app section/screen IDs and web paths
 */
export const navigationRoutes: { [screen: string]: string } = {
	[AppSections.Unauthenticated]: '/auth',
	[AppSections.Authenticated]: '/app',
	[AppSections.Media]: '/media',
	[AppSections.Settings]: '/settings',
	[AppSections.Credits]: '/credits',
	[AppScreens.AuthLoading]: '/auth/loading',
	[AppScreens.UserLogin]: '/auth/login',
	[AppScreens.UserSignup]: '/auth/signup',
	[AppScreens.CategoriesList]: '/media/categories',
	[AppScreens.CategoryDetails]: '/media/categories/details',
	[AppScreens.MediaItemsList]: '/media/items',
	[AppScreens.MediaItemDetails]: '/media/items/details',
	[AppScreens.TvShowSeasonsList]: '/media/tv-show-seasons',
	[AppScreens.TvShowSeasonDetails]: '/media/tv-show-seasons/details',
	[AppScreens.GroupsList]: '/media/groups',
	[AppScreens.GroupDetails]: '/media/groups/details',
	[AppScreens.OwnPlatformsList]: '/media/platforms',
	[AppScreens.OwnPlatformDetails]: '/media/platforms/details',
	[AppScreens.Settings]: '/settings',
	[AppScreens.Credits]: '/credits'
};

/**
 * Resolves a route name to a web path
 * @param routeName the screen or section route name
 * @returns the mapped web path
 */
export const screenToPath = (routeName: string): string => {
	if(routeName.startsWith('/')) {
		return routeName;
	}

	const path = navigationRoutes[routeName];
	if(!path) {
		throw AppError.GENERIC.withDetails(`Route ${routeName} has no mapped web path`);
	}
	return path;
};
