import { config } from 'app/config/config';
import { OwnPlatformMockedController } from 'app/controllers/impl-mocks/entities/own-platform';
import { OwnPlatformBackEndController } from 'app/controllers/impl-prod/entities/own-platform';
import { OwnPlatformFilterInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';

/**
 * The data controller for the own platform entities
 */
export interface OwnPlatformController {

	/**
	 * Gets all saved own platforms for the given category
	 * @param userId the user
	 * @param categoryId the category
	 * @returns the list of own platforms, as a promise
	 */
	getAllOwnPlatforms(userId: string, categoryId: string): Promise<OwnPlatformInternal[]>;

	/**
	 * Filters the own platforms of a given category
	 * @param userId the user
	 * @param categoryId the category
	 * @param filter the filter to apply
	 * @returns the list of own platforms, as a promise
	 */
	filter(userId: string, categoryId: string, filter?: OwnPlatformFilterInternal): Promise<OwnPlatformInternal[]>;

	/**
	 * Saves a own platform, adding it if the ID is not specified or updating it otherwise
	 * @param userId the user
	 * @param categoryId the category
	 * @param ownPlatform the own platform
	 */
	saveOwnPlatform(userId: string, categoryId: string, ownPlatform: OwnPlatformInternal): Promise<void>;

	/**
	 * Deletes a own platform
	 * @param userId the user
	 * @param categoryId the category
	 * @param ownPlatformId the own platform ID
	 */
	deleteOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<void>;
}

/**
 * Singleton implementation of the own platform controller
 */
export const ownPlatformController: OwnPlatformController = config.mocks.ownPlatforms ? new OwnPlatformMockedController() : new OwnPlatformBackEndController();

