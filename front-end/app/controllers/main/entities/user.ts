import { config } from 'app/config/config';
import { UserController } from 'app/controllers/interfaces/entities/user';
import { UserMockedController } from 'app/controllers/implementations/mocks/entities/user';
import { UserFirebaseController } from 'app/controllers/implementations/real/entities/user';

/**
 * Singleton implementation of the user controller
 */
export const userController: UserController = config.mocks.user ? new UserMockedController() : new UserFirebaseController();
