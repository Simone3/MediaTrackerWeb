import { Method } from 'axios';

/**
 * Helper type for HTTP invocation parameters
 */
export type InvocationParams<TRequest, TResponse> = {
	url: string;
	method: Method;
	requestBody?: TRequest;
	requestContentType?: string;
	responseBodyClass?: ClassType<TResponse>;
	timeoutMilliseconds?: number;
	queryParams?: QueryParams;
	headers?: { [key: string]: string };
	assumeWellFormedResponse?: boolean;
	discardInvalidResponseItems?: boolean;
	hideRequestBodyInLogs?: boolean;
	hideResponseBodyInLogs?: boolean;
};

/**
 * Helper type for the result of a parse that may have discarded invalid list items
 */
export type LenientParseResult<T> = {
	value: T;
	discardedItems: number;
};

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
 * Helper type to define a class type (constructor)
 */
export declare type ClassType<T> = {
	new (...args: unknown[]): T;
};
