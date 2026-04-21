import { devConfig } from 'app/config/properties/config-dev';
import { prodConfig } from 'app/config/properties/config-prod';
import { Config } from 'app/config/type-config';
import { AppError } from 'app/data/models/internal/error';
import { getEnvValue } from 'app/utilities/env';

const environment = getEnvValue('MEDIA_TRACKER_APP_ENV') || 'dev';

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
