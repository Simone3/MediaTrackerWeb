import { MediaItemDefinitionsController } from 'app/controllers/interfaces/entities/media-items/media-item';
import { MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, MediaItemSortFieldInternal } from 'app/data/models/internal/media-items/media-item';

/**
 * A sort option built only out of the fields every media type shares, i.e. what the defaults below can be written against
 */
type CommonMediaItemSortByInternal = MediaItemSortByInternal & {

	field: MediaItemSortFieldInternal;
};

/**
 * Base class for the media item definitions controllers, with the defaults that every media type currently shares. Only the three
 * type-specific extractions are left to the subclasses, so that a media type that starts wanting its own defaults says so with an override
 * @see MediaItemDefinitionsController
 */
export abstract class MediaItemDefinitionsControllerImpl<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> implements MediaItemDefinitionsController<TMediaItemInternal, TMediaItemSortByInternal, TMediaItemFilterInternal> {
	/**
	 * @override
	 */
	public getDefaultFilter(): TMediaItemFilterInternal {
		const filter: MediaItemFilterInternal = {
			status: 'CURRENT'
		};

		// The subtype filters add no fields of their own to the generic one, which is what makes one shared default valid for every media type
		return filter as TMediaItemFilterInternal;
	}

	/**
	 * @override
	 */
	public getDefaultSortBy(): TMediaItemSortByInternal[] {
		return this.toSubtypeSortBy([{
			field: 'ACTIVE',
			ascending: false
		}, {
			field: 'IMPORTANCE',
			ascending: false
		}, {
			field: 'RELEASE_DATE',
			ascending: true
		}]);
	}

	/**
	 * @override
	 */
	public getViewGroupSortBy(): TMediaItemSortByInternal[] {
		return this.toSubtypeSortBy([{
			field: 'GROUP',
			ascending: true
		}]);
	}

	/**
	 * @override
	 */
	public abstract getCreatorNames(mediaItem: TMediaItemInternal): string[] | undefined;

	/**
	 * @override
	 */
	public abstract getDurationValue(mediaItem: TMediaItemInternal): number | undefined;

	/**
	 * @override
	 */
	public abstract getDefaultMediaItem(): TMediaItemInternal;

	/**
	 * Helper to read the shared defaults as the sort options of a specific media type. Every subtype only widens the generic sort field
	 * with its own extra values, e.g. a book adds 'AUTHOR', so a default built out of the shared fields is always a valid one for it.
	 * TypeScript cannot prove that while the media type is still a type parameter, hence the conversion
	 * @param sortBy the shared sort options
	 * @returns the same sort options, as the subtype ones
	 */
	private toSubtypeSortBy(sortBy: CommonMediaItemSortByInternal[]): TMediaItemSortByInternal[] {
		return sortBy as unknown as TMediaItemSortByInternal[];
	}
}
