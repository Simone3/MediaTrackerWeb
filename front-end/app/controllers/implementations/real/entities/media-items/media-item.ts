import { config } from 'app/config/config';
import { backEndInvoker } from 'app/controllers/main/common/back-end-invoker';
import { mediaItemsStatsFilterMapper, mediaItemsStatsMapper } from 'app/data/mappers/media-items/media-item';
import { GetMediaItemsStatsRequest, GetMediaItemsStatsResponse } from 'app/data/models/api/media-items/media-item';
import { MediaItemsStatsFilterInternal, MediaItemsStatsInternal } from 'app/data/models/internal/media-items/media-item';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Base class for the media item controllers that query the back-end APIs, with the calls whose request, response and behavior are the
 * same for every media type: only the path segment tells them apart, which is why subclasses just declare their own
 */
export abstract class MediaItemBackEndController {
	/**
	 * The path segment of the media type, e.g. "movies"
	 */
	protected abstract readonly mediaItemPathName: string;

	/**
	 * @override
	 */
	public async getStats(userId: string, categoryId: string, filter?: MediaItemsStatsFilterInternal): Promise<MediaItemsStatsInternal> {
		const request: GetMediaItemsStatsRequest = {
			filter: filter ? mediaItemsStatsFilterMapper.toExternal(filter) : undefined,

			// The back end groups the completions by year in this time zone: the dates are written here at local midnight, so a completion
			// dated the 1st of January would land in the previous year for anyone east of Greenwich if the server grouped them in UTC
			timezone: dateUtils.getCurrentTimeZone()
		};

		const response = await backEndInvoker.invoke({
			method: 'POST',
			url: miscUtils.buildUrl([ config.backEnd.baseUrl, `/users/:userId/categories/:categoryId/${this.mediaItemPathName}/stats` ], {
				userId: userId,
				categoryId: categoryId
			}),
			requestBody: request,
			responseBodyClass: GetMediaItemsStatsResponse
		});

		return mediaItemsStatsMapper.toInternal(response);
	}
}
