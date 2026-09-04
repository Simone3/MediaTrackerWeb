import { MediaItemInternal, MediaItemStatusInternal } from 'app/data/models/internal/media-items/media-item';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * The media item fields the "status" label is derived from
 */
export type MediaItemStatusSourceInternal = Pick<MediaItemInternal, 'completedOn' | 'releaseDate' | 'active' | 'markedAsRedo'>;

/**
 * Helper class with useful methods for media items
 */
class MediaItemUtils {
	/**
	 * Helper to count the number of seasons and episodes of a TV show
	 * @param tvShowSeasons the TV show seasons
	 * @returns the counters
	 */
	public getTvShowCounters(tvShowSeasons?: TvShowSeasonInternal[]): { seasonsNumber: number, episodesNumber: number, watchedEpisodesNumber: number, episodesToWatchNumber: number } {
		let seasonsNumber = 0;
		let episodesNumber = 0;
		let watchedEpisodesNumber = 0;

		if(tvShowSeasons) {
			for(const season of tvShowSeasons) {
				seasonsNumber += 1;
				episodesNumber += season.episodesNumber ? season.episodesNumber : 0;
				watchedEpisodesNumber += season.watchedEpisodesNumber ? season.watchedEpisodesNumber : 0;
			}
		}

		const episodesToWatchNumber = episodesNumber - watchedEpisodesNumber;

		return {
			seasonsNumber: seasonsNumber,
			episodesNumber: episodesNumber,
			watchedEpisodesNumber: watchedEpisodesNumber,
			episodesToWatchNumber: episodesToWatchNumber
		};
	}

	/**
	 * Helper to build the "status" label of a media item. The label is derived from other fields and never stored, so
	 * this is the single place the front end resolves it: mapping an API media item, and applying an inline list update,
	 * both go through here rather than assigning a label of their own.
	 *
	 * THIS RULE IS DUPLICATED IN THE BACK END, in MediaItemEntityController.buildBacklogStatusExpression, which applies
	 * the same precedence as a MongoDB expression to bucket the stats backlog. The two are pinned together by a shared
	 * table of cases, in tests/media-item-status-rule.test.ts here and in test/integration/routes/media-items/
	 * status-rule-test.ts there: change the precedence below and both tables have to change with it
	 * @param source the media item fields the label is derived from
	 * @param now the instant a release date is compared against, defaulting to the current one
	 * @returns the "status" label
	 */
	public buildStatusLabel(source: MediaItemStatusSourceInternal, now: Date = new Date()): MediaItemStatusInternal {
		const hasCompletions = source.completedOn ? source.completedOn.length > 0 : false;

		if(hasCompletions && !source.markedAsRedo) {
			// Items that have been completed
			return 'COMPLETE';
		}
		else if(source.active) {
			// Items marked as currently active (e.g. currently reading)
			return 'ACTIVE';
		}
		else if(hasCompletions && source.markedAsRedo) {
			// Items that have been completed but have been marked for redo (e.g. rewatch)
			return 'REDO';
		}
		else if(source.releaseDate && source.releaseDate > now) {
			// Items with a future release date
			return 'UPCOMING';
		}
		else {
			// All other items
			return 'NEW';
		}
	}
}

/**
 * Singleton implementation of the media item utilities
 */
export const mediaItemUtils = new MediaItemUtils();
