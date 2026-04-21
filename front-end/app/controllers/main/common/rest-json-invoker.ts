import { RestJsonInvokerAxios } from 'app/controllers/implementations/real/common/rest-json-invoker';
import { RestJsonInvoker } from 'app/controllers/interfaces/common/rest-json-invoker';

/**
 * Singleton implementation of the JSON REST invoker
 */
export const restJsonInvoker: RestJsonInvoker = new RestJsonInvokerAxios();
