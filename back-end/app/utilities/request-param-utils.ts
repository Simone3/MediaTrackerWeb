type PathParam = string | string[] | undefined;

/**
 * Utility helpers to normalize Express 5 path params.
 */
export const requestParamUtils = {
	getOptionalString(param: PathParam): string | undefined {
		return Array.isArray(param) ? param[0] : param;
	},

	getRequiredString(param: PathParam, paramName: string): string {
		const value = requestParamUtils.getOptionalString(param);
		if(!value) {
			throw new Error(`Missing required path param: ${paramName}`);
		}

		return value;
	}
};
