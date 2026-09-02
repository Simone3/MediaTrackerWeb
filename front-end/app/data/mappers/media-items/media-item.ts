import { stripHtml } from 'string-strip-html';
import { ModelMapper } from 'app/data/mappers/common';
import { groupMapper } from 'app/data/mappers/group';
import { ownPlatformMapper } from 'app/data/mappers/own-platform';
import { CatalogMediaItem, GetMediaItemsStatsResponse, MediaItem, MediaItemFilter, MediaItemGroupFilter, MediaItemOwnPlatformFilter, MediaItemSortBy, MediaItemSortField, MediaItemsStatsFilter, SearchMediaItemCatalogResult } from 'app/data/models/api/media-items/media-item';
import { AppError } from 'app/data/models/internal/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemGroupFilterInternal, MediaItemInternal, MediaItemOwnPlatformFilterInternal, MediaItemSortByInternal, MediaItemSortFieldInternal, MediaItemStatusFilterInternal, MediaItemsStatsFilterInternal, MediaItemsStatsInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { dateUtils } from 'app/utilities/date-utils';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

/**
 * Abstract mapper for media items
 * @template TMediaItemInternal the class of the internal media item entity
 * @template TMediaItem the class of the API media item entity
 */
export abstract class MediaItemMapper<TMediaItemInternal extends MediaItemInternal, TMediaItem extends MediaItem> extends ModelMapper<TMediaItemInternal, TMediaItem, {}> {
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
			active: source.active,
			markedAsRedo: source.markedAsRedo,
			catalogId: source.catalogId,
			imageUrl: source.imageUrl
		};

		if(source.group && source.orderInGroup !== undefined) {
			target.group = {
				groupId: source.group.id,
				groupData: groupMapper.toExternal(source.group),
				orderInGroup: source.orderInGroup
			};
		}
		else if(source.group || source.orderInGroup !== undefined) {
			throw AppError.GENERIC.withDetails('Should never have "group" and not "orderInGroup" or vice-versa: either both or none');
		}

		if(source.ownPlatform) {
			target.ownPlatform = {
				ownPlatformId: source.ownPlatform.id,
				ownPlatformData: ownPlatformMapper.toExternal(source.ownPlatform)
			};
		}

		return target;
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItem): MediaItemInternal {
		// The status is derived from the internal values, not the API ones, so that the rule compares dates and never strings
		const completedOn = dateUtils.toDateList(source.completedOn);
		const releaseDate = dateUtils.toDate(source.releaseDate);

		const target: MediaItemInternal = {
			
			// These two will be overridden by the specific mappers. Done like this to avoid setting the fields as optional (= useless undefined checks throughout the app)
			id: '',
			mediaType: 'BOOK',
			
			name: source.name,
			status: mediaItemUtils.buildStatusLabel({
				completedOn: completedOn,
				releaseDate: releaseDate,
				active: source.active,
				markedAsRedo: source.markedAsRedo
			}),
			importance: source.importance,
			genres: source.genres,
			description: source.description,
			userComment: source.userComment,
			completedOn: completedOn,
			releaseDate: releaseDate,
			active: source.active,
			markedAsRedo: source.markedAsRedo,
			catalogId: source.catalogId,
			imageUrl: source.imageUrl
		};

		if(source.group && source.group.groupData) {
			target.group = groupMapper.toInternal({
				...source.group.groupData,
				uid: source.group.groupId
			});
			
			target.orderInGroup = source.group.orderInGroup;
		}

		if(source.ownPlatform && source.ownPlatform.ownPlatformData) {
			target.ownPlatform = ownPlatformMapper.toInternal({
				...source.ownPlatform.ownPlatformData,
				uid: source.ownPlatform.ownPlatformId
			});
		}

		return target;
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
			groups: this.toExternalGroupFilter(source.groups),
			ownPlatforms: this.toExternalOwnPlatformFilter(source.ownPlatforms),
			name: source.name
		};
		return this.setStatusFilterExternal(source.status, target);
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: MediaItemFilter): MediaItemFilterInternal {
		return {
			importanceLevels: source.importanceLevels,
			groups: this.toInternalGroupFilter(source.groups),
			ownPlatforms: this.toInternalOwnPlatformFilter(source.ownPlatforms),
			status: this.toInternalStatusFilter(source),
			name: source.name
		};
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	private toExternalGroupFilter(source: MediaItemGroupFilterInternal | undefined): MediaItemGroupFilter | undefined {
		if(source) {
			return {
				anyGroup: source.anyGroup,
				noGroup: source.noGroup,
				groupIds: source.groupIds
			};
		}
		else {
			return undefined;
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	private toExternalOwnPlatformFilter(source: MediaItemOwnPlatformFilterInternal | undefined): MediaItemOwnPlatformFilter | undefined {
		if(source) {
			return {
				anyOwnPlatform: source.anyOwnPlatform,
				noOwnPlatform: source.noOwnPlatform,
				ownPlatformIds: source.ownPlatformIds
			};
		}
		else {
			return undefined;
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	private toInternalGroupFilter(source: MediaItemGroupFilter | undefined): MediaItemGroupFilterInternal | undefined {
		if(source) {
			return {
				anyGroup: source.anyGroup,
				noGroup: source.noGroup,
				groupIds: source.groupIds
			};
		}
		else {
			return undefined;
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	private toInternalOwnPlatformFilter(source: MediaItemOwnPlatformFilter | undefined): MediaItemOwnPlatformFilterInternal | undefined {
		if(source) {
			return {
				anyOwnPlatform: source.anyOwnPlatform,
				noOwnPlatform: source.noOwnPlatform,
				ownPlatformIds: source.ownPlatformIds
			};
		}
		else {
			return undefined;
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @param target the target
	 * @returns the target
	 */
	private setStatusFilterExternal(source: MediaItemStatusFilterInternal | undefined, target: MediaItemFilter): MediaItemFilter {
		if(source) {
			switch(source) {
				case 'CURRENT':
					target.complete = false;
					break;

				case 'COMPLETE':
					target.complete = true;
					break;

				default:
					throw AppError.GENERIC.withDetails(`Cannot map status filter!`);
			}
		}
		
		return target;
	}

	/**
	 * Helper for nested object mapping
	 * @param source the source
	 * @returns the target
	 */
	private toInternalStatusFilter(source: MediaItemFilter): MediaItemStatusFilterInternal | undefined {
		if(source.complete) {
			return 'COMPLETE';
		}
		else if(source.complete === false) {
			return 'CURRENT';
		}
		else {
			return undefined;
		}
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
			case 'ACTIVE': return MediaItemSortField.ACTIVE;
			case 'COMPLETION_DATE': return MediaItemSortField.COMPLETION_DATE;
			case 'RELEASE_DATE': return MediaItemSortField.RELEASE_DATE;
			default: throw AppError.GENERIC.withDetails(`Cannot map common to external field!`);
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
			default: throw AppError.GENERIC.withDetails(`Cannot map common to internal field!`);
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
			catalogId: source.catalogId,
			name: source.name,
			genres: source.genres,
			description: source.description,
			releaseDate: dateUtils.toString(source.releaseDate),
			imageUrl: source.imageUrl
		};
	}
	
	/**
	 * Common mapping helper for implementations
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected commonToInternal(source: CatalogMediaItem): CatalogMediaItemInternal {
		return {
			catalogId: source.catalogId,
			catalogLoadId: `${source.catalogId}_${Date.now()}`,
			name: source.name,
			genres: source.genres,
			description: source.description ? stripHtml(source.description).result : undefined,
			releaseDate: dateUtils.toDate(source.releaseDate),
			imageUrl: source.imageUrl
		};
	}
}

/**
 * Mapper for the media items stats filter
 */
class MediaItemsStatsFilterMapper extends ModelMapper<MediaItemsStatsFilterInternal, MediaItemsStatsFilter, never> {
	/**
	 * @override
	 */
	protected convertToExternal(source: MediaItemsStatsFilterInternal): MediaItemsStatsFilter {
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
	protected convertToInternal(): MediaItemsStatsFilterInternal {
		throw AppError.GENERIC.withDetails('The media items stats filter is built by the app and never travels inwards');
	}
}

/**
 * Mapper for the media items stats
 */
class MediaItemsStatsMapper extends ModelMapper<MediaItemsStatsInternal, GetMediaItemsStatsResponse, never> {
	/**
	 * @override
	 */
	protected convertToExternal(): GetMediaItemsStatsResponse {
		throw AppError.GENERIC.withDetails('The media items stats are computed by the back end and never travel outwards');
	}

	/**
	 * @override
	 */
	protected convertToInternal(source: GetMediaItemsStatsResponse): MediaItemsStatsInternal {
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

						// The API says "not owned" with an explicit null, which is simply the absence of an own platform in here
						ownPlatformId: entry.ownPlatformId === null ? undefined : entry.ownPlatformId,
						count: entry.count
					};
				})
			}
		};
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
