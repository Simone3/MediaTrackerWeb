import { Method } from 'axios';
import { ClassType } from 'class-transformer-validator';

/**
 * Helper type for HTTP invocation parameters
 */
export type InvocationParams<TRequest, TResponse> = {
	url: string;
	method: Method;
	requestBody?: TRequest;
	responseBodyClass: ClassType<TResponse>;
	timeoutMilliseconds?: number;
	queryParams?: QueryParams;
	headers?: {[key: string]: string};
	assumeWellFormedResponse?: boolean;
}

/**
 * Helper type for URL query params
 */
export type QueryParams = {
	[key: string]: string;
};

/**
 * Helper type for URL path params
 */
export type PathParams = {
	[key: string]: string;
};

/**
 * Helper type to define a type starting from an array of options
 */
export type ValuesOf<T extends unknown[]> = T[number];

/**
 * Extracts the list of keys of T that are not optional (not ? nor undefined)
 */
export type RequiredKeys<T> = {
	[K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];

/**
 * Extracts the list of keys of T that are optional (? or undefined)
 */
export type OptionalKeys<T> = {
	[K in keyof T]-?: undefined extends T[K] ? K : never
}[keyof T];

/**
 * Picks only the fields of T that are not optional (not ? nor undefined)
 */
export type RequiredFields<T> = Pick<T, RequiredKeys<T>>;

/**
 * Picks only the fields of T that are optional (? or undefined)
 */
export type OptionalFields<T> = Pick<T, OptionalKeys<T>>;

/**
 * Makes all fields of T possibly undefined (which is different from the build-in Partial, which adds the "?")
 */
export type PossiblyUndefined<T> = {
	[K in keyof T]: T[K] | undefined
};

/**
 * Transforms all optional fields ("?") into possibly undefined fields, e.g. { myField?: string; another: boolean } --> { myField: string | undefined; another: boolean }
 */
export type OptionalToUndefined<T> = RequiredFields<T> & PossiblyUndefined<Required<OptionalFields<T>>>;
