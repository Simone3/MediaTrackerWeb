/**
 * Common type for entities that have a database ID
 */
export type PersistedEntityInternal = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_id?: any;
};

/**
 * Pagination options for a list query, internal type NOT to be exposed via API
 */
export type PaginationInternal = {
	offset: number;
	limit: number;
};

/**
 * Result of a list query, carrying the requested elements together with the total number of elements
 * that matched the query, internal type NOT to be exposed via API
 * @template TElement the listed element
 */
export type PaginatedResultInternal<TElement> = {
	elements: TElement[];
	totalCount: number;
};
