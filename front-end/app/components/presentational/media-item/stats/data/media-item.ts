import { MediaItemsStatsImportanceBox } from 'app/components/presentational/media-item/stats/importance-boxes';
import { MediaItemsStatsStatusDonutSegment } from 'app/components/presentational/media-item/stats/status-donut';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { MEDIA_ITEM_BACKLOG_STATUS_INTERNAL_VALUES, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MediaItemsStatsImportanceAndOwnPlatformInternal, MediaItemsStatsStatusInternal, MediaItemsStatsYearInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * The key of the "not owned" bucket, which is a row like any other but always the last one
 */
const NO_OWN_PLATFORM_KEY = 'NO_OWN_PLATFORM';

/**
 * Fills the completions the back end sent out into a continuous range of years, from the first year that has something to the current
 * one, both included.
 *
 * The gaps are filled here rather than sent over the wire because the payload would otherwise grow with the range instead of with the
 * data. They are filled at all, rather than skipped, because a year in which the user completed nothing is a fact about the history and
 * a missing bar would silently redraw it as a shorter, busier one.
 * @param byYear the years that have at least one completion, in ascending order
 * @param currentYear the year the range ends at
 * @returns every year of the range, in ascending order, with a count of zero for the ones that have nothing
 */
export const buildYearSeries = (byYear: MediaItemsStatsYearInternal[], currentYear: number): MediaItemsStatsYearInternal[] => {
	if(byYear.length === 0) {
		return [];
	}

	const countsByYear = new Map<number, number>();
	for(const year of byYear) {
		countsByYear.set(year.year, year.count);
	}

	// A completion dated in the future would otherwise be cut off the chart it belongs to, so the range ends at the later of the two
	const firstYear = Math.min(...countsByYear.keys());
	const lastYear = Math.max(currentYear, ...countsByYear.keys());

	const series: MediaItemsStatsYearInternal[] = [];
	for(let year = firstYear; year <= lastYear; year++) {
		series.push({
			year: year,
			count: countsByYear.get(year) || 0
		});
	}

	return series;
};

/**
 * Builds the segments of the backlog donut, in the fixed order the ring draws them and without the statuses that have nothing in them.
 *
 * The order is not arbitrary: the active green and the redo teal are almost indistinguishable when they touch, and the neutral grey and
 * the upcoming orange sitting between them are what keeps the ring readable.
 * @param byStatus the backlog counts per status
 * @param mediaType the media type, which decides the wording of the two statuses that are phrased per type
 * @returns the donut segments
 */
export const buildStatusSegments = (byStatus: MediaItemsStatsStatusInternal[], mediaType: MediaTypeInternal): MediaItemsStatsStatusDonutSegment[] => {
	const segments: MediaItemsStatsStatusDonutSegment[] = [];

	for(const status of MEDIA_ITEM_BACKLOG_STATUS_INTERNAL_VALUES) {
		const entry = byStatus.find((candidate) => {
			return candidate.status === status;
		});

		if(entry && entry.count > 0) {
			segments.push({
				key: status,
				label: i18n.t(`mediaItem.stats.byStatus.values.${status}.${mediaType}`),
				count: entry.count,
				className: `media-items-stats-status-${status.toLowerCase()}`
			});
		}
	}

	return segments;
};

/**
 * Builds the label of one own platform row of the backlog panel
 * @param ownPlatformId the own platform ID, or undefined for the "not owned" bucket
 * @param ownPlatforms the currently loaded own platforms
 * @returns the row label
 */
const buildOwnPlatformLabel = (ownPlatformId: string | undefined, ownPlatforms: OwnPlatformInternal[]): string => {
	if(ownPlatformId === undefined) {
		return i18n.t('mediaItem.stats.byPlatform.noOwnPlatform');
	}

	const ownPlatform = ownPlatforms.find((candidate) => {
		return candidate.id === ownPlatformId;
	});

	// The own platforms load beside the stats and can be missing, or can no longer contain a platform the backlog still counts: the
	// bar stays either way, since dropping it would understate the backlog it belongs to
	return ownPlatform ? ownPlatform.name : i18n.t('mediaItem.list.filter.values.ownPlatform.unknown', { id: ownPlatformId });
};

/**
 * Builds the four importance boxes of the backlog panel, each with one row per own platform that still holds something at that level.
 * The four boxes are always there, empty ones included: they are the app's importance scale, and dropping one would make the panel say
 * that the level does not exist rather than that it is clear.
 * @param byImportanceAndOwnPlatform the backlog counts per importance level and own platform
 * @param ownPlatforms the currently loaded own platforms, used to resolve the IDs to names
 * @returns the importance boxes, in the app's own importance order
 */
export const buildImportanceBoxes = (byImportanceAndOwnPlatform: MediaItemsStatsImportanceAndOwnPlatformInternal[], ownPlatforms: OwnPlatformInternal[]): MediaItemsStatsImportanceBox[] => {
	return MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES.map((importance) => {
		const entries = byImportanceAndOwnPlatform.filter((entry) => {
			return entry.importance === importance && entry.count > 0;
		});

		const owned = entries.filter((entry) => {
			return entry.ownPlatformId !== undefined;
		});
		const notOwned = entries.filter((entry) => {
			return entry.ownPlatformId === undefined;
		});

		// "Not owned" is a bucket like any other, but it always goes last: it is the absence of a platform, not one more of them
		const rows = [ ...owned, ...notOwned ].map((entry) => {
			return {
				key: entry.ownPlatformId === undefined ? NO_OWN_PLATFORM_KEY : entry.ownPlatformId,
				label: buildOwnPlatformLabel(entry.ownPlatformId, ownPlatforms),
				count: entry.count
			};
		});

		return {
			key: importance,
			label: i18n.t(`mediaItem.common.importance.${importance}`),
			total: rows.reduce((total, row) => {
				return total + row.count;
			}, 0),
			rows: rows
		};
	});
};
