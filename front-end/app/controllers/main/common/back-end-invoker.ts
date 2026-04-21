import { BackEndInvokerRestJson } from 'app/controllers/implementations/real/common/back-end-invoker';
import { BackEndInvoker } from 'app/controllers/interfaces/common/back-end-invoker';

/**
 * Singleton implementation of the Media Tracker back-end APIs invoker
 */
export const backEndInvoker: BackEndInvoker = new BackEndInvokerRestJson();
