import { ModelMapper } from 'app/data/mappers/common';
import { groupMapper } from 'app/data/mappers/group';
import { ownPlatformMapper } from 'app/data/mappers/own-platform';
import { CatalogMediaItem, GetMediaItemsStatsResponse, MediaItem, MediaItemFilter, MediaItemsStatsFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResult } from 'app/data/models/api/media-items/media-item';
import { AppError } from 'app/data/models/error/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemsStatsInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Helper type
 */
export type MediaItemMapperParams = {
	userId: string;
	categoryId: string;
};

/**
 * Abstract mapper for media items
 * @template TMediaItemInternal the class of the internal media item entity
 * @template TMediaItem the class of the API media item entity
 */
export abstract class MediaItemMapper<TMediaItemInternal extends MediaItemInternal, TMediaItem extends MediaItem> extends ModelMapper<TMediaItemInternal, TMediaItem, MediaItemMapperParams> {
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: MediaItemInternal): MediaItem {
		const target: MediaItem = {
			name: source.name,
			importance: source.importance,
			genres: source.genres,
			description: source.description,
			userComment: source.userComment,
			completedOn: dateUtils.toStringList(source.completedOn),
			releaseDate: dateUtils.toString(source.releaseDate),
			active: miscUtils.parseBoolean(source.active),
			markedAsRedo: miscUtils.parseBoolean(source.markedAsRedo),
			catalogId: source.catalogId,
			imageUrl: source.imageUrl
		};

		if(source.group && source.orderInGroup !== undefined && typeof source.group !== 'string') {
			target.group = {
				groupId: String(source.group._id),
				groupData: groupMapper.toExternal(source.group),
				orderInGroup: source.orderInGroup
			};
		}

		if(source.ownPlatform && typeof source.ownPlatform !== 'string') {
			target.ownPlatform = {
				ownPlatformId: String(source.ownPlatform._id),
				ownPlatformData: ownPlatformMapper.toExternal(source.ownPlatform)
			};
		}

		return target;
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @param extraParams the required extra params
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItem, extraParams?: MediaItemMapperParams): MediaItemInternal {
		if(!extraParams) {
			throw AppError.GENERIC.withDetails('convertToInternal.extraParams cannot be undefined');
		}

		let targetCompletedOn = dateUtils.toDateList(source.completedOn);
		let targetCompletedLastOn;
		if(targetCompletedOn && targetCompletedOn.length > 0) {
			targetCompletedOn = targetCompletedOn.sort((date1, date2) => {
				return date1.getTime() - date2.getTime();
			});

			targetCompletedLastOn = targetCompletedOn[targetCompletedOn.length - 1];
		}

		return {
			_id: null,
			name: source.name,
			category: extraParams.categoryId,
			owner: extraParams.userId,
			group: source.group ? source.group.groupId : undefined,
			ownPlatform: source.ownPlatform ? source.ownPlatform.ownPlatformId : undefined,
			orderInGroup: source.group ? source.group.orderInGroup : undefined,
			importance: source.importance,
			genres: source.genres,
			description: source.description,
			userComment: source.userComment,
			completedOn: targetCompletedOn,
			completedLastOn: targetCompletedLastOn,
			releaseDate: dateUtils.toDate(source.releaseDate),
			active: miscUtils.parseBoolean(source.active),
			markedAsRedo: miscUtils.parseBoolean(source.markedAsRedo),
			catalogId: source.catalogId,
			imageUrl: source.imageUrl
		};
	}
}

/**
 * Abstract mapper for media item filters
 * @template TMediaItemFilterInternal the class of the internal media item entity
 * @template TMediaItemFilter the class of the API media item entity
 */
export abstract class MediaItemFilterMapper<TMediaItemFilterInternal extends MediaItemFilterInternal, TMediaItemFilter extends MediaItemFilter> extends ModelMapper<TMediaItemFilterInternal, TMediaItemFilter, never> {
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: MediaItemFilterInternal): MediaItemFilter {
		const target: MediaItemFilter = {
			importanceLevels: source.importanceLevels,
			complete: source.complete,
			name: source.name
		};

		if(source.groups) {
			target.groups = {
				anyGroup: source.groups.anyGroup,
				noGroup: source.groups.noGroup,
				groupIds: source.groups.groupIds
			};
		}

		if(source.ownPlatforms) {
			target.ownPlatforms = {
				anyOwnPlatform: source.ownPlatforms.anyOwnPlatform,
				noOwnPlatform: source.ownPlatforms.noOwnPlatform,
				ownPlatformIds: source.ownPlatforms.ownPlatformIds
			};
		}

		return target;
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItemFilter): MediaItemFilterInternal {
		const target: MediaItemFilterInternal = {
			importanceLevels: source.importanceLevels,
			complete: source.complete,
			name: source.name
		};

		if(source.groups) {
			target.groups = {
				anyGroup: source.groups.anyGroup,
				noGroup: source.groups.noGroup,
				groupIds: source.groups.groupIds
			};
		}

		if(source.ownPlatforms) {
			target.ownPlatforms = {
				anyOwnPlatform: source.ownPlatforms.anyOwnPlatform,
				noOwnPlatform: source.ownPlatforms.noOwnPlatform,
				ownPlatformIds: source.ownPlatforms.ownPlatformIds
			};
		}

		return target;
	}
}

/**
 * Abstract mapper for media item sort options
 * @template TMediaItemSortByInternal the class of the internal media item entity
 * @template TMediaItemSortBy the class of the API media item entity
 */
export abstract class MediaItemSortMapper<TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemSortBy extends MediaItemSortBy> extends ModelMapper<TMediaItemSortByInternal, TMediaItemSortBy, never> {
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: MediaItemSortByInternal): MediaItemSortBy {
		return {
			ascending: source.ascending
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItemSortBy): MediaItemSortByInternal {
		return {
			ascending: source.ascending
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternalField(source: MediaItemSortFieldInternal): string {
		switch(source) {
			case 'IMPORTANCE': return MediaItemSortField.IMPORTANCE;
			case 'NAME': return MediaItemSortField.NAME;
			case 'GROUP': return MediaItemSortField.GROUP;
			case 'OWN_PLATFORM': return MediaItemSortField.OWN_PLATFORM;
			case 'COMPLETION_DATE': return MediaItemSortField.COMPLETION_DATE;
			case 'ACTIVE': return MediaItemSortField.ACTIVE;
			case 'RELEASE_DATE': return MediaItemSortField.RELEASE_DATE;
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternalField(source: MediaItemSortField): MediaItemSortFieldInternal {
		switch(source) {
			case MediaItemSortField.IMPORTANCE: return 'IMPORTANCE';
			case MediaItemSortField.NAME: return 'NAME';
			case MediaItemSortField.GROUP: return 'GROUP';
			case MediaItemSortField.OWN_PLATFORM: return 'OWN_PLATFORM';
			case MediaItemSortField.COMPLETION_DATE: return 'COMPLETION_DATE';
			case MediaItemSortField.ACTIVE: return 'ACTIVE';
			case MediaItemSortField.RELEASE_DATE: return 'RELEASE_DATE';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}
}

/**
 * Abstract mapper for media item catalog search results
 * @template TSearchMediaItemCatalogResultInternal the class of the internal media item entity
 * @template TSearchMediaItemCatalogResult the class of the API media item entity
 */
export abstract class MediaItemCatalogSearchMapper<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TSearchMediaItemCatalogResult extends SearchMediaItemCatalogResult> extends ModelMapper<TSearchMediaItemCatalogResultInternal, TSearchMediaItemCatalogResult, never> {
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: SearchMediaItemCatalogResultInternal): SearchMediaItemCatalogResult {
		return {
			catalogId: source.catalogId,
			name: source.name,
			releaseDate: dateUtils.toString(source.releaseDate)
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: SearchMediaItemCatalogResult): SearchMediaItemCatalogResultInternal {
		return {
			catalogId: source.catalogId,
			name: source.name,
			releaseDate: dateUtils.toDate(source.releaseDate)
		};
	}
}

/**
 * Abstract mapper for media item catalog details
 * @template TCatalogMediaItemInternal the class of the internal media item entity
 * @template TCatalogMediaItem the class of the API media item entity
 */
export abstract class MediaItemCatalogDetailsMapper<TCatalogMediaItemInternal extends CatalogMediaItemInternal, TCatalogMediaItem extends CatalogMediaItem> extends ModelMapper<TCatalogMediaItemInternal, TCatalogMediaItem, never> {
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToExternal(source: CatalogMediaItemInternal): CatalogMediaItem {
		return {
			name: source.name,
			genres: source.genres,
			description: source.description,
			releaseDate: dateUtils.toString(source.releaseDate),
			imageUrl: source.imageUrl,
			catalogId: source.catalogId
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: CatalogMediaItem): CatalogMediaItemInternal {
		return {
			name: source.name,
			genres: source.genres,
			description: source.description,
			releaseDate: dateUtils.toDate(source.releaseDate),
			imageUrl: source.imageUrl,
			catalogId: source.catalogId
		};
	}
}

/**
 * Mapper for the media items stats filter. It maps into the same internal filter the list APIs use, with only the
 * group and own platform blocks set: the stats controller then runs the very same query conditions as the list, which
 * is what keeps the two screens agreeing on what a filter means
 */
class MediaItemsStatsFilterMapper extends ModelMapper<MediaItemFilterInternal, MediaItemsStatsFilter, never> {
	/**
	 * @override
	 */
	protected convertToExternal(source: MediaItemFilterInternal): MediaItemsStatsFilter {
		const target: MediaItemsStatsFilter = {};

		if(source.groups) {
			target.groups = {
				anyGroup: source.groups.anyGroup,
				noGroup: source.groups.noGroup,
				groupIds: source.groups.groupIds
			};
		}

		if(source.ownPlatforms) {
			target.ownPlatforms = {
				anyOwnPlatform: source.ownPlatforms.anyOwnPlatform,
				noOwnPlatform: source.ownPlatforms.noOwnPlatform,
				ownPlatformIds: source.ownPlatforms.ownPlatformIds
			};
		}

		return target;
	}

	/**
	 * @override
	 */
	protected convertToInternal(source: MediaItemsStatsFilter): MediaItemFilterInternal {
		const target: MediaItemFilterInternal = {};

		if(source.groups) {
			target.groups = {
				anyGroup: source.groups.anyGroup,
				noGroup: source.groups.noGroup,
				groupIds: source.groups.groupIds
			};
		}

		if(source.ownPlatforms) {
			target.ownPlatforms = {
				anyOwnPlatform: source.ownPlatforms.anyOwnPlatform,
				noOwnPlatform: source.ownPlatforms.noOwnPlatform,
				ownPlatformIds: source.ownPlatforms.ownPlatformIds
			};
		}

		return target;
	}
}

/**
 * Mapper for the media items stats
 */
class MediaItemsStatsMapper extends ModelMapper<MediaItemsStatsInternal, GetMediaItemsStatsResponse, never> {
	/**
	 * @override
	 */
	protected convertToExternal(source: MediaItemsStatsInternal): GetMediaItemsStatsResponse {
		return {
			mediaItems: {
				total: source.mediaItems.total,
				filtered: source.mediaItems.filtered
			},
			completions: {
				total: source.completions.total,
				mediaItems: source.completions.mediaItems,
				byYear: source.completions.byYear.map((year) => {
					return {
						year: year.year,
						count: year.count
					};
				})
			},
			backlog: {
				total: source.backlog.total,
				byStatus: source.backlog.byStatus.map((status) => {
					return {
						status: status.status,
						count: status.count
					};
				}),
				byImportanceAndOwnPlatform: source.backlog.byImportanceAndOwnPlatform.map((entry) => {
					return {
						importance: entry.importance,

						// Explicitly null and not simply absent: "not owned" is a bucket of the result, not a missing value
						ownPlatformId: entry.ownPlatformId === undefined ? null : entry.ownPlatformId,
						count: entry.count
					};
				})
			}
		};
	}

	/**
	 * @override
	 */
	protected convertToInternal(): MediaItemsStatsInternal {
		throw AppError.GENERIC.withDetails('Media items stats are computed by the database and never travel inwards');
	}
}

/**
 * Singleton instance of the media items stats filter mapper
 */
export const mediaItemsStatsFilterMapper = new MediaItemsStatsFilterMapper();

/**
 * Singleton instance of the media items stats mapper
 */
export const mediaItemsStatsMapper = new MediaItemsStatsMapper();
