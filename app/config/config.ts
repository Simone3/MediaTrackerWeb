import { devConfig } from 'app/config/properties/config-dev';
import { prodConfig } from 'app/config/properties/config-prod';
import { Config } from 'app/config/type-config';
import { AppError } from 'app/data/models/internal/error';
import ReactNativeConfig from 'react-native-config';

/**
 * The application expects to find several configuration files:
 * - config-dev.ts for development environment
 * - config-prod.ts for production environment
 *
 * In general, config-{ENV}.ts where {ENV} is defined by the MEDIA_TRACKER_APP_ENV variable (defined in the ".env" files)
 *
 * config-dev.ts and config-prod.ts are NOT versioned. They can be defined starting from
 * the helper config-sample.ts
 */

const environment = ReactNativeConfig.MEDIA_TRACKER_APP_ENV;

// Get config based on environment
let envConfig: Config;
switch(environment) {

	case 'dev':
		envConfig = devConfig;
		break;

	case 'prod':
		envConfig = prodConfig;
		break;

	default:
		throw AppError.GENERIC.withDetails(`MEDIA_TRACKER_APP_ENV property is not set or is not recognized: ${environment}`);
}

/**
 * The application centralized configuration properties, varies by environment and during automatic testing
 */
export const config: Config = envConfig;
