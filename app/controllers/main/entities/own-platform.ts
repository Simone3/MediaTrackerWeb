import { config } from 'app/config/config';
import { OwnPlatformController } from 'app/controllers/interfaces/entities/own-platform';
import { OwnPlatformMockedController } from 'app/controllers/implementations/mocks/entities/own-platform';
import { OwnPlatformBackEndController } from 'app/controllers/implementations/real/entities/own-platform';

/**
 * Singleton implementation of the own platform controller
 */
export const ownPlatformController: OwnPlatformController = config.mocks.ownPlatforms ? new OwnPlatformMockedController() : new OwnPlatformBackEndController();
