import { MediaItemCatalogController, MediaItemController } from 'app/controllers/core/entities/media-items/media-item';
import { MockControllerHelper } from 'app/controllers/impl-mocks/common/mock-helper';
import { AppError } from 'app/data/models/internal/error';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { MovieSortByInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Mocked implementation of the MediaItemController that contains an in-memory list of media items
 * @see MediaItemController
 */
export abstract class MediaItemMockedController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> extends MockControllerHelper implements MediaItemController<TMediaItemInternal, TMediaItemSortByInternal, TMediaItemFilterInternal> {

	protected delay = 0;
	protected errorProbability = 0;

	protected readonly mediaItems: {[user: string]: {[category: string]: TMediaItemInternal[]}} = {};

	/**
	 * @override
	 */
	public async filter(userId: string, categoryId: string, filter?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[]): Promise<TMediaItemInternal[]> {

		return this.resolveResult(() => {

			let categoryMediaItems = this.getCategoryMediaItems(userId, categoryId);
			
			categoryMediaItems = this.mockFilter(categoryMediaItems, filter);
			categoryMediaItems = this.mockSort(categoryMediaItems, sortBy);

			return categoryMediaItems.slice();
		});
	}
	
	/**
	 * @override
	 */
	public async search(userId: string, categoryId: string, searchTerm: string): Promise<TMediaItemInternal[]> {
			
		return this.resolveResult(() => {

			return this.getCategoryMediaItems(userId, categoryId)
				.filter((item) => {
					return item.name.toLowerCase().includes(searchTerm.toLowerCase());
				})
				.slice();
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
		const groupsIdsFilter = filter.groups ? filter.groups.groupIds : undefined;
		const importanceFilter = filter.importanceLevels;

		if(nameFilter) {

			mediaItems = mediaItems.filter((item) => {

				return nameFilter.toUpperCase() === item.name.toUpperCase();
			});
		}
		
		if(groupsIdsFilter && groupsIdsFilter.length > 0) {

			mediaItems = mediaItems.filter((item) => {

				return item.group && groupsIdsFilter.includes(item.group.id);
			});
		}

		if(importanceFilter) {

			mediaItems = mediaItems.filter((item) => {

				return importanceFilter.includes(item.importance);
			});
		}

		return mediaItems;
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
	protected readonly catalogDetails: {[catalogId: string]: TCatalogMediaItemInternal} = {};
	
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
