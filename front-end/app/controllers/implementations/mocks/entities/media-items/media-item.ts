import { MockControllerHelper } from 'app/controllers/implementations/mocks/common/mock-helper';
import { MediaItemCatalogController, MediaItemController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { PaginatedResultInternal, PaginationInternal } from 'app/data/models/internal/common';
import { AppError } from 'app/data/models/internal/error';
import { CatalogMediaItemInternal, MEDIA_ITEM_BACKLOG_STATUS_INTERNAL_VALUES, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemsStatsFilterInternal, MediaItemsStatsImportanceAndOwnPlatformInternal, MediaItemsStatsInternal, MediaItemsStatsStatusInternal, MediaItemsStatsYearInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { MovieSortByInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Mocked implementation of the MediaItemController that contains an in-memory list of media items
 * @see MediaItemController
 */
export abstract class MediaItemMockedController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> extends MockControllerHelper implements MediaItemController<TMediaItemInternal, TMediaItemSortByInternal, TMediaItemFilterInternal> {
	protected delay = 0;
	protected errorProbability = 0;

	protected readonly mediaItems: { [user: string]: { [category: string]: TMediaItemInternal[] } } = {};

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[], pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		return this.resolveResult(() => {
			let categoryMediaItems = this.getCategoryMediaItems(userId, categoryId);
			
			categoryMediaItems = this.mockFilter(categoryMediaItems, filter);
			categoryMediaItems = this.mockSort(categoryMediaItems, sortBy);

			return this.mockPaginate(categoryMediaItems, pagination);
		});
	}
	
	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string, pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		return this.resolveResult(() => {
			const matches = this.getCategoryMediaItems(userId, categoryId)
				.filter((item) => {
					return item.name.toLowerCase().includes(searchTerm.toLowerCase());
				});

			return this.mockPaginate(matches, pagination);
		});
	}
	
	/**
	 * @override
	 */
	public async getStats(userId: string, categoryId: string, filter?: MediaItemsStatsFilterInternal): Promise<MediaItemsStatsInternal> {
		return this.resolveResult(() => {
			const categoryMediaItems = this.getCategoryMediaItems(userId, categoryId);

			// The stats filter is a subset of the list filter, so the same incomplete mock filtering applies to both
			const filtered = this.mockFilter(categoryMediaItems, filter as TMediaItemFilterInternal | undefined);

			return {
				mediaItems: {
					total: categoryMediaItems.length,
					filtered: filtered.length
				},
				completions: this.mockCompletions(filtered),
				backlog: this.mockBacklog(filtered)
			};
		});
	}

	/**
	 * @override
	 */
	public async save(userId: string, categoryId: string, mediaItem: TMediaItemInternal): Promise<void> {
		return this.resolveResult(() => {
			const categoryMediaItems = this.getCategoryMediaItems(userId, categoryId);
			
			if(mediaItem.id) {
				const i = categoryMediaItems.findIndex((item) => {
					return item.id === mediaItem.id;
				});

				categoryMediaItems[i] = mediaItem;
			}
			else {
				categoryMediaItems.push({
					...mediaItem,
					id: this.randomId()
				});
			}
			
			this.mediaItems[userId][categoryId] = categoryMediaItems;
		});
	}

	/**
	 * @override
	 */
	public async delete(userId: string, categoryId: string, mediaItemId: string): Promise<void> {
		return this.resolveResult(() => {
			const categoryMediaItems = this.getCategoryMediaItems(userId, categoryId);
			
			const i = categoryMediaItems.findIndex((item) => {
				return item.id === mediaItemId;
			});
			
			categoryMediaItems.splice(i, 1);

			this.mediaItems[userId][categoryId] = categoryMediaItems;
		});
	}

	/**
	 * Allows to mock-paginate a list, i.e. to cut out the requested page and report how many elements matched
	 * @param mediaItems every matching media item
	 * @param pagination the optional pagination options
	 * @returns the requested page and the total number of matches
	 */
	protected mockPaginate(mediaItems: TMediaItemInternal[], pagination?: PaginationInternal): PaginatedResultInternal<TMediaItemInternal> {
		return {
			elements: pagination ? mediaItems.slice(pagination.offset, pagination.offset + pagination.limit) : mediaItems.slice(),
			totalCount: mediaItems.length
		};
	}

	/**
	 * Allows to mock-sort a list
	 * @param mediaItems the media items
	 * @param sortBy the sort request
	 * @returns the sorted media items
	 */
	protected mockSort(mediaItems: TMediaItemInternal[], sortBy?: TMediaItemSortByInternal[]): TMediaItemInternal[] {
		if(!sortBy) {
			return mediaItems;
		}

		console.log(`Back-End would sort by ${JSON.stringify(sortBy)} - mocked implementation is non complete...`);
		
		const mockSortBy = sortBy as unknown as MovieSortByInternal[];
		if(mockSortBy[0].field === 'NAME') {
			return mediaItems.sort((first, second) => {
				if(first.name < second.name) {
					return -1;
				}
				if(first.name > second.name) {
					return 1;
				}
				return 0;
			});
		}
		else {
			return mediaItems;
		}
	}

	/**
	 * Allows to mock-filter a list
	 * @param mediaItems the media items
	 * @param filter the filter
	 * @returns the filtered media items
	 */
	protected mockFilter(mediaItems: TMediaItemInternal[], filter?: TMediaItemFilterInternal): TMediaItemInternal[] {
		if(!filter) {
			return mediaItems;
		}

		console.log(`Back-End would filter by ${JSON.stringify(filter)} - mocked implementation is non complete...`);

		const nameFilter = filter.name;
		const groupsFilter = filter.groups;
		const ownPlatformsFilter = filter.ownPlatforms;
		const importanceFilter = filter.importanceLevels;

		if(nameFilter) {
			mediaItems = mediaItems.filter((item) => {
				return nameFilter.toUpperCase() === item.name.toUpperCase();
			});
		}
		
		if(groupsFilter) {
			// Specific IDs win over the generic options, just like they do in the back-end query
			if(groupsFilter.groupIds && groupsFilter.groupIds.length > 0) {
				const groupIds = groupsFilter.groupIds;
				mediaItems = mediaItems.filter((item) => {
					return item.group && groupIds.includes(item.group.id);
				});
			}
			else if(groupsFilter.anyGroup && !groupsFilter.noGroup) {
				mediaItems = mediaItems.filter((item) => {
					return Boolean(item.group);
				});
			}
			else if(!groupsFilter.anyGroup && groupsFilter.noGroup) {
				mediaItems = mediaItems.filter((item) => {
					return !item.group;
				});
			}
		}

		if(ownPlatformsFilter) {
			// Specific IDs win over the generic options, just like they do in the back-end query
			if(ownPlatformsFilter.ownPlatformIds && ownPlatformsFilter.ownPlatformIds.length > 0) {
				const ownPlatformIds = ownPlatformsFilter.ownPlatformIds;
				mediaItems = mediaItems.filter((item) => {
					return item.ownPlatform && ownPlatformIds.includes(item.ownPlatform.id);
				});
			}
			else if(ownPlatformsFilter.anyOwnPlatform && !ownPlatformsFilter.noOwnPlatform) {
				mediaItems = mediaItems.filter((item) => {
					return Boolean(item.ownPlatform);
				});
			}
			else if(!ownPlatformsFilter.anyOwnPlatform && ownPlatformsFilter.noOwnPlatform) {
				mediaItems = mediaItems.filter((item) => {
					return !item.ownPlatform;
				});
			}
		}

		if(importanceFilter) {
			mediaItems = mediaItems.filter((item) => {
				return importanceFilter.includes(item.importance);
			});
		}

		return mediaItems;
	}

	/**
	 * Helper to aggregate the completions half of the stats: it counts completion dates, whatever the status of the media items
	 * carrying them, and reports the years in ascending order and without the empty ones, exactly as the back end does
	 * @param mediaItems the media items the stats cover
	 * @returns the completions block
	 */
	private mockCompletions(mediaItems: TMediaItemInternal[]): MediaItemsStatsInternal['completions'] {
		const countsByYear = new Map<number, number>();
		let total = 0;
		let completedMediaItems = 0;

		for(const mediaItem of mediaItems) {
			if(!mediaItem.completedOn || mediaItem.completedOn.length === 0) {
				continue;
			}

			completedMediaItems += 1;
			for(const completion of mediaItem.completedOn) {
				const year = completion.getFullYear();
				countsByYear.set(year, (countsByYear.get(year) || 0) + 1);
				total += 1;
			}
		}

		const byYear: MediaItemsStatsYearInternal[] = Array.from(countsByYear.entries())
			.map(([ year, count ]) => {
				return {
					year: year,
					count: count
				};
			})
			.sort((first, second) => {
				return first.year - second.year;
			});

		return {
			total: total,
			mediaItems: completedMediaItems,
			byYear: byYear
		};
	}

	/**
	 * Helper to aggregate the backlog half of the stats, i.e. everything that is not complete. The status is read off the media item
	 * rather than derived again: the mapper already resolved it when the item was built
	 * @param mediaItems the media items the stats cover
	 * @returns the backlog block
	 */
	private mockBacklog(mediaItems: TMediaItemInternal[]): MediaItemsStatsInternal['backlog'] {
		const backlog = mediaItems.filter((mediaItem) => {
			return mediaItem.status !== 'COMPLETE';
		});

		const byStatus: MediaItemsStatsStatusInternal[] = [];
		for(const status of MEDIA_ITEM_BACKLOG_STATUS_INTERNAL_VALUES) {
			const count = backlog.filter((mediaItem) => {
				return mediaItem.status === status;
			}).length;

			if(count > 0) {
				byStatus.push({
					status: status,
					count: count
				});
			}
		}

		const byImportanceAndOwnPlatform: MediaItemsStatsImportanceAndOwnPlatformInternal[] = [];
		for(const importance of MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES) {
			const countsByOwnPlatform = new Map<string | undefined, number>();

			for(const mediaItem of backlog) {
				if(mediaItem.importance !== importance) {
					continue;
				}

				const ownPlatformId = mediaItem.ownPlatform ? mediaItem.ownPlatform.id : undefined;
				countsByOwnPlatform.set(ownPlatformId, (countsByOwnPlatform.get(ownPlatformId) || 0) + 1);
			}

			for(const [ ownPlatformId, count ] of countsByOwnPlatform.entries()) {
				byImportanceAndOwnPlatform.push({
					importance: importance,
					ownPlatformId: ownPlatformId,
					count: count
				});
			}
		}

		return {
			total: backlog.length,
			byStatus: byStatus,
			byImportanceAndOwnPlatform: byImportanceAndOwnPlatform
		};
	}

	/**
	 * Helper to get all media items in the category
	 * @param userId the user
	 * @param categoryId the category
	 * @returns the media items
	 */
	private getCategoryMediaItems(userId: string, categoryId: string): TMediaItemInternal[] {
		let categoryMediaItems: TMediaItemInternal[];
		if(userId in this.mediaItems && categoryId in this.mediaItems[userId]) {
			categoryMediaItems = this.mediaItems[userId][categoryId];
		}
		else {
			categoryMediaItems = [];
		}
		return categoryMediaItems;
	}
}

/**
 * Mocked implementation of the MediaItemCatalogController that contains an in-memory list of media items
 * @see MediaItemCatalogController
 */
export class MediaItemMockedCatalogController<TSearchMediaItemCatalogResultInternal extends SearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal extends CatalogMediaItemInternal> extends MockControllerHelper implements MediaItemCatalogController<TSearchMediaItemCatalogResultInternal, TCatalogMediaItemInternal> {
	protected delay = 0;
	protected errorProbability = 0;
	
	protected readonly catalogList: TSearchMediaItemCatalogResultInternal[] = [];
	protected readonly catalogDetails: { [catalogId: string]: TCatalogMediaItemInternal } = {};
	
	/**
	 * @override
	 */
	public async search(searchTerm: string): Promise<TSearchMediaItemCatalogResultInternal[]> {
		return this.resolveResult(() => {
			return this.catalogList
				.filter((item) => {
					return item.name.toLowerCase().includes(searchTerm.toLowerCase());
				})
				.slice();
		});
	}
	
	/**
	 * @override
	 */
	public async getDetails(catalogId: string): Promise<TCatalogMediaItemInternal> {
		return this.resolveResult(() => {
			if(catalogId in this.catalogDetails) {
				const catalog = this.catalogDetails[catalogId];
				return {
					...catalog,
					catalogLoadId: `${catalog.catalogId}_${Date.now()}`
				};
			}
			else {
				throw AppError.GENERIC.withDetails('Mocked catalog details not found');
			}
		});
	}
}
