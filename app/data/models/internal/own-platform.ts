import { config } from 'app/config/config';
import { ValuesOf } from 'app/utilities/helper-types';

/**
 * A media item own platform, internal type just for display purposes
 */
export type OwnPlatformInternal = {

	id: string;
	name: string;
	color: string;
	icon: OwnPlatformIconInternal;
}

/**
 * Array of all own platform icons, internal type just for display purposes
 */
export const OWN_PLATFORM_ICON_INTERNAL_VALUES: [ 'default', 'android', 'apple', 'book', 'disc', 'disney', 'download', 'epic', 'gog', 'hulu', 'kindle', 'netflix', 'origin', 'playstation', 'steam', 'switch', 'uplay' ] = [ 'default', 'android', 'apple', 'book', 'disc', 'disney', 'download', 'epic', 'gog', 'hulu', 'kindle', 'netflix', 'origin', 'playstation', 'steam', 'switch', 'uplay' ];

/**
 * The own platform icon, internal type just for display purposes
 */
export type OwnPlatformIconInternal = ValuesOf<typeof OWN_PLATFORM_ICON_INTERNAL_VALUES>;

/**
 * A filter for own platforms, internal type just for display purposes
 */
export type OwnPlatformFilterInternal = {

	name?: string;
}

/**
 * The default initial own platform, internal type just for display purposes
 */
export const DEFAULT_OWN_PLATFORM: OwnPlatformInternal = {
	id: '',
	name: '',
	color: config.ui.colors.availableOwnPlatformColors[0],
	icon: 'default'
};
