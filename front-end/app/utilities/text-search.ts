/**
 * Helper class with useful methods for the client-side text searches of the lists
 */
class TextSearchUtils {
	/**
	 * Normalizes a value for a case- and accent-insensitive comparison
	 * @param value the source value
	 * @returns the normalized value
	 */
	public normalize(value: string | undefined): string {
		if(!value) {
			return '';
		}

		return value
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '');
	}

	/**
	 * Tells if some text matches the given search term, i.e. if it contains it ignoring case, accents and surrounding spaces
	 * @param text the text to check
	 * @param searchTerm the current search term
	 * @returns true if the text matches, or if the search term is empty
	 */
	public matches(text: string | undefined, searchTerm: string | undefined): boolean {
		const normalizedSearchTerm = this.normalize(searchTerm);

		if(!normalizedSearchTerm) {
			return true;
		}

		return this.normalize(text).includes(normalizedSearchTerm);
	}

	/**
	 * Filters a list keeping only the items whose text matches the given search term
	 * @param items the source list
	 * @param searchTerm the current search term
	 * @param getItemText callback that extracts the searchable text of an item
	 * @returns the filtered list, or the source list if the search term is empty
	 */
	public filter<T>(items: T[], searchTerm: string | undefined, getItemText: (item: T) => string): T[] {
		if(!this.normalize(searchTerm)) {
			return items;
		}

		return items.filter((item) => {
			return this.matches(getItemText(item), searchTerm);
		});
	}
}

/**
 * Singleton implementation of the text search utilities
 */
export const textSearchUtils = new TextSearchUtils();
