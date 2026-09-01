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
				return this.toString(date);
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
				return this.toDate(dateString);
			});
		}
		else {
			return undefined;
		}
	}

	/**
	 * Helper to read the time zone the browser is in, e.g. 'Europe/Rome'. Needed by the calls that ask the back end to group dates by a
	 * calendar unit: the app writes dates at local midnight, so a date grouped by year in UTC would land in the previous year for any
	 * user east of Greenwich
	 * @returns the IANA time zone identifier, or undefined if the environment does not resolve one
	 */
	public getCurrentTimeZone(): string | undefined {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	/**
	 * Helper to read the current year in the browser's own time zone, which is the year the back end counted the latest completions in
	 * @returns the current year
	 */
	public getCurrentYear(): number {
		return new Date().getFullYear();
	}
}

/**
 * Singleton implementation of date utils
 */
export const dateUtils = new DateUtils();
