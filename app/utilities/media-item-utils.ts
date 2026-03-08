import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Helper class with useful methods for media items
 */
class MediaItemUtils {

	/**
	 * Helper to count the number of seasons and episodes of a TV show
	 * @param tvShowSeasons the TV show seasons
	 * @returns the counters
	 */
	public getTvShowCounters(tvShowSeasons?: TvShowSeasonInternal[]): { seasonsNumber: number, episodesNumber: number, watchedEpisodesNumber: number, episodesToWatchNumber: number} {

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
}

/**
 * Singleton implementation of the media item utilities
 */
export const mediaItemUtils = new MediaItemUtils();
