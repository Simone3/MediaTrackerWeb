import { config } from 'app/config/config';
import { GroupController } from 'app/controllers/interfaces/entities/group';
import { GroupMockedController } from 'app/controllers/implementations/mocks/entities/group';
import { GroupBackEndController } from 'app/controllers/implementations/real/entities/group';

/**
 * Singleton implementation of the group controller
 */
export const groupController: GroupController = config.mocks.groups ? new GroupMockedController() : new GroupBackEndController();
