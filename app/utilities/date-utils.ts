/**
 * Some utilities for dates
 */
class DateUtils {

	/**
	 * Helper to format a date to ISO string with a null check
	 * @param date the optionally undefined date
	 * @returns undefined if date is undefined, the ISO string otherwise
	 */
	public toString(date: Date | undefined | null): string | undefined {

		return date ? date.toISOString() : undefined;
	}

	/**
	 * Helper to format a list of dates to ISO strings with a null check
	 * @param dates the optionally undefined dates array
	 * @returns undefined if dates is undefined, the array of ISO strings otherwise
	 */
	public toStringList(dates: Date[] | undefined | null): string[] | undefined {

		if(dates) {
			
			return dates.map((date) => {

				return this.toString(date) as string;
			});
		}
		else {
			
			return undefined;
		}
	}

	/**
	 * Helper to parse a UTC date with a null check
	 * @param dateString the optionally undefined string
	 * @returns undefined if dateString is undefined, the parsed date otherwise
	 */
	public toDate(dateString: string | undefined | null): Date | undefined {

		if(dateString) {

			return new Date(dateString);
		}
		else {

			return undefined;
		}
	}

	/**
	 * Helper to parse UTC dates with a null check
	 * @param dateStrings the optionally undefined date strings array
	 * @returns undefined if dateStrings is undefined, the array of parsed dates otherwise
	 */
	public toDateList(dateStrings: string[] | undefined | null): Date[] | undefined {

		if(dateStrings) {
			
			return dateStrings.map((dateString) => {

				return this.toDate(dateString) as Date;
			});
		}
		else {
			
			return undefined;
		}
	}
}

/**
 * Singleton implementation of date utils
 */
export const dateUtils = new DateUtils();
