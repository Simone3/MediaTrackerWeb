/**
 * The maximum number of elements a single page of a paginated list can contain. Mirrors the API bound in
 * PAGINATION_MAX_LIMIT, which the back end enforces
 */
export const PAGINATION_INTERNAL_MAX_LIMIT = 100;

/**
 * Pagination options for a list query, internal type NOT to be exposed via API
 */
export type PaginationInternal = {
	offset: number;
	limit: number;
};

/**
 * Result of a list query, carrying the requested elements together with the total number of elements that
 * matched the query, internal type NOT to be exposed via API
 * @template TElement the listed element
 */
export type PaginatedResultInternal<TElement> = {
	elements: TElement[];
	totalCount: number;
};
