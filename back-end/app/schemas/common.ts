/**
 * Collation options shared by every database read and by the indexes that serve them (for case insensitive ordering).
 * An index is only usable by a query that runs under the same collation, so the two must be declared from the same
 * constant: a query with the English collation cannot use a plain index, and vice versa
 */
export const DATABASE_COLLATION = {
	locale: 'en'
};
