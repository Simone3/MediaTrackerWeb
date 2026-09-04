import { Populatable, QueryHelper, Sortable } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { AppError } from 'app/data/models/error/error';
import { CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';
import { PaginatedResultInternal, PaginationInternal, PersistedEntityInternal } from 'app/data/models/internal/common';
import { GroupInternal } from 'app/data/models/internal/group';
import { INTERNAL_MEDIA_ITEM_BACKLOG_STATUSES, MediaItemBacklogStatusInternal, MediaItemFilterInternal, MediaItemImportanceInternal, MediaItemInternal, MediaItemsStatsImportanceAndOwnPlatformInternal, MediaItemsStatsInternal, MediaItemsStatsStatusInternal, MediaItemsStatsYearInternal, MediaItemSortByInternal, MediaItemSortFieldInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { logger } from 'app/loggers/logger';
import { miscUtils } from 'app/utilities/misc-utils';
import { HydratedDocument, Model, PipelineStage, QueryFilter, SortOrder, UpdateQuery } from 'mongoose';

const COMPLETE_STATUS = 'COMPLETE';
const ACTIVE_STATUS = 'ACTIVE';
const REDO_STATUS = 'REDO';
const UPCOMING_STATUS = 'UPCOMING';
const NEW_STATUS = 'NEW';

/**
 * Raw shape of the media items stats aggregation result, i.e. one array per facet branch
 */
type MediaItemsStatsAggregationResult = {
	categoryTotal: { value: number }[];
	filteredTotal: { value: number }[];
	completionMediaItems: { value: number }[];
	completionsByYear: { _id: number; count: number }[];
	backlogByStatus: { _id: MediaItemBacklogStatusInternal; count: number }[];
	backlogByImportanceAndOwnPlatform: { _id: { importance: MediaItemImportanceInternal; ownPlatform: unknown }; count: number }[];
};
/**
 * Abstract controller for media item entities
 * @template TMediaItemInternal the media item entity
 * @template TMediaItemSortByInternal the media item sort conditions
 * @template TMediaItemFilterInternal the media item filter conditions
 */
export abstract class MediaItemEntityController<TMediaItemInternal extends MediaItemInternal, TMediaItemSortByInternal extends MediaItemSortByInternal, TMediaItemFilterInternal extends MediaItemFilterInternal> extends AbstractEntityController {
	private readonly queryHelper: QueryHelper<TMediaItemInternal>;

	/**
	 * Constructor
	 * @param model the source DB model
	 */
	protected constructor(model: Model<TMediaItemInternal>) {
		super();
		this.queryHelper = new QueryHelper(model);
	}

	/**
	 * Gets a single media item
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param mediaItemId media item ID
	 * @returns the media item or undefined if not found, as a promise
	 */
	public getMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<TMediaItemInternal | undefined> {
		const conditions: QueryFilter<MediaItemInternal> = {
			_id: mediaItemId,
			category: categoryId,
			owner: userId
		};
		
		return this.queryHelper.findOne(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all saved media items for the given user and category
	 * @param userId user ID
	 * @param categoryId category ID
	 * @returns the retrieved media items, as a promise
	 */
	public async getAllMediaItems(userId: string, categoryId: string): Promise<TMediaItemInternal[]> {
		const sortBy: TMediaItemSortByInternal[] = this.getDefaultSortBy();

		const result = await this.filterAndOrderMediaItems(userId, categoryId, undefined, sortBy);
		return result.elements;
	}

	/**
	 * Gets all saved media items for the given group
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param groupId the group ID
	 * @returns the media items, as a promise
	 */
	public getAllMediaItemsInGroup(userId: string, categoryId: string, groupId: string): Promise<TMediaItemInternal[]> {
		const conditions: QueryFilter<MediaItemInternal> = {
			owner: userId,
			category: categoryId,
			group: groupId
		};

		return this.queryHelper.find(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all saved media items linked to the given own platform
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param ownPlatformId the own platform ID
	 * @returns the media items, as a promise
	 */
	public getAllMediaItemsInOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<TMediaItemInternal[]> {
		const conditions: QueryFilter<MediaItemInternal> = {
			owner: userId,
			category: categoryId,
			ownPlatform: ownPlatformId
		};

		return this.queryHelper.find(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all saved media items for the given category
	 * @param userId user ID
	 * @param categoryId the category ID
	 * @returns the media items, as a promise
	 */
	public getAllMediaItemsInCategory(userId: string, categoryId: string): Promise<TMediaItemInternal[]> {
		const conditions: QueryFilter<MediaItemInternal> = {
			owner: userId,
			category: categoryId
		};
		
		return this.queryHelper.find(this.castFilterQuery(conditions));
	}

	/**
	 * Gets all media items matching the given filter and ordered with the given ordering options
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filterBy filter options
	 * @param sortBy sort otions
	 * @param pagination optional pagination options. If omitted, every matching media item is returned
	 * @returns the media items and their total count, as a promise
	 */
	public filterAndOrderMediaItems(userId: string, categoryId: string, filterBy?: TMediaItemFilterInternal, sortBy?: TMediaItemSortByInternal[], pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		const andConditions: QueryFilter<MediaItemInternal>[] = [];
		this.addConditionsFromFilter(userId, categoryId, this.castFilterQueryArray(andConditions), filterBy);
		const conditions: QueryFilter<MediaItemInternal> = {
			$and: andConditions
		};

		const sortConditions: Sortable<TMediaItemInternal> = {};
		if(sortBy) {
			for(const value of sortBy) {
				const sortDirection: SortOrder = value.ascending ? 'asc' : 'desc';
				this.setSortConditions(value, sortDirection, sortConditions);
			}
		}
		this.setTiebreakerSortCondition(sortConditions);

		return this.findAndCount(this.castFilterQuery(conditions), sortConditions, pagination);
	}

	/**
	 * Searches media items by term, returning the results divided in two lists: those matching the given filters and those not matching them
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param term the search term
	 * @param filterBy the optional filters
	 * @param pagination optional pagination options. If omitted, every matching media item is returned
	 * @returns the media items and their total count, as a promise
	 */
	public searchMediaItems(userId: string, categoryId: string, term: string, filterBy?: TMediaItemFilterInternal, pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		const termRegExp = new RegExp(miscUtils.escapeRegExp(term), 'i');
		
		// Common search conditions
		const searchConditions: QueryFilter<MediaItemInternal>[] = [];
		const nameCondition: QueryFilter<MediaItemInternal> = {
			name: termRegExp
		};
		searchConditions.push(nameCondition);

		// Specific search conditions
		this.setSearchByTermConditions(term, termRegExp, this.castFilterQueryArray(searchConditions));
		
		// Complete query conditions, with active filter
		const andConditions: QueryFilter<MediaItemInternal>[] = [];
		this.addConditionsFromFilter(userId, categoryId, this.castFilterQueryArray(andConditions), filterBy);
		andConditions.push({
			$or: searchConditions
		});
		const conditions: QueryFilter<MediaItemInternal> = {
			$and: andConditions
		};

		// Sort
		const sortBy: Sortable<TMediaItemInternal> = {};
		sortBy.name = 'asc';
		this.setTiebreakerSortCondition(sortBy);

		return this.findAndCount(this.castFilterQuery(conditions), sortBy, pagination);
	}

	/**
	 * Computes the aggregated statistics of the media items matching the given filter, in a single database round trip:
	 * a category can hold thousands of media items and the result is a few dozen numbers, so nothing is loaded into the
	 * application to be reduced here
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filterBy the optional filters. Only the group and own platform blocks are meaningful here
	 * @param timezone the optional IANA time zone the completion years are computed in, defaulting to UTC
	 * @returns the statistics, as a promise
	 */
	public async getMediaItemsStats(userId: string, categoryId: string, filterBy?: MediaItemFilterInternal, timezone?: string): Promise<MediaItemsStatsInternal> {
		// A single "now" for the whole aggregation, so that every branch agrees on which media items are still upcoming
		const now = new Date();

		// Mongoose does not cast an aggregation pipeline, so every condition inside it has to be cast by hand
		const categoryConditions = this.queryHelper.castConditions(this.castFilterQuery({
			owner: userId,
			category: categoryId
		}));

		const filterAndConditions: QueryFilter<MediaItemInternal>[] = [];
		this.addCommonConditionsFromFilter(userId, categoryId, filterAndConditions, filterBy);
		const filterStage: PipelineStage.Match = {
			$match: this.queryHelper.castConditions(this.castFilterQuery({
				$and: filterAndConditions
			}))
		};

		// The backlog branches share their first stages: filter, resolve the status, and drop what is complete
		const backlogStages: PipelineStage.FacetPipelineStage[] = [
			filterStage,
			{
				$project: {
					_id: 0,
					importance: 1,
					ownPlatform: 1,
					status: this.buildBacklogStatusExpression(now)
				}
			},
			{
				$match: {
					status: {
						$ne: COMPLETE_STATUS
					}
				}
			}
		];

		const results = await this.queryHelper.aggregate<MediaItemsStatsAggregationResult>([
			{
				$match: categoryConditions
			},
			{
				$facet: {
					categoryTotal: [
						{ $count: 'value' }
					],
					filteredTotal: [
						filterStage,
						{ $count: 'value' }
					],
					completionMediaItems: [
						filterStage,
						{ $match: { 'completedOn.0': { $exists: true } } },
						{ $count: 'value' }
					],
					completionsByYear: [
						filterStage,
						{ $unwind: '$completedOn' },
						{ $group: { _id: this.buildCompletionYearExpression(timezone), count: { $sum: 1 } } },
						{ $sort: { _id: 1 } }
					],
					backlogByStatus: [
						...backlogStages,
						{ $group: { _id: '$status', count: { $sum: 1 } } }
					],
					backlogByImportanceAndOwnPlatform: [
						...backlogStages,
						{ $group: { _id: { importance: '$importance', ownPlatform: { $ifNull: [ '$ownPlatform', null ] } }, count: { $sum: 1 } } },
						{ $sort: { '_id.importance': -1, '_id.ownPlatform': 1 } }
					]
				}
			}
		]);

		return this.buildStatsResult(results[0]);
	}

	/**
	 * Saves a new or an existing media item
	 * @param mediaItem the media item to insert or update
	 * @param skipCheckPreconditions if true, skips existance preconditions
	 * @returns the saved media item, as a promise
	 */
	public async saveMediaItem(mediaItem: TMediaItemInternal, skipCheckPreconditions?: boolean): Promise<TMediaItemInternal> {
		if(!skipCheckPreconditions) {
			await this.checkWritePreconditions(
				AppError.DATABASE_SAVE.withDetails(mediaItem._id ? 'Media item or group or own platform does not exist for given user/category' : 'User or category or group or own platform does not exist'),
				mediaItem.owner,
				mediaItem.category,
				mediaItem.group,
				mediaItem.ownPlatform,
				mediaItem._id
			);
		}
		
		return this.queryHelper.save(mediaItem, this.getNewEmptyDocument());
	}

	/**
	 * Deletes a media item with the given ID
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param mediaItemId the media item ID
	 * @returns the number of deleted media items, as a promise
	 */
	public async deleteMediaItem(userId: string, categoryId: string, mediaItemId: string): Promise<number> {
		await this.checkWritePreconditions(
			AppError.DATABASE_DELETE.withDetails('Media item does not exist for given user/category'),
			userId,
			categoryId,
			undefined,
			undefined,
			mediaItemId
		);

		return this.queryHelper.delete(this.castFilterQuery({
			_id: mediaItemId,
			owner: userId,
			category: categoryId
		}));
	}

	/**
	 * Delets all saved media items for the given group
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param groupId the group ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllMediaItemsInGroup(userId: string, categoryId: string, groupId: string): Promise<number> {
		const conditions: QueryFilter<MediaItemInternal> = {
			owner: userId,
			category: categoryId,
			group: groupId
		};

		return this.queryHelper.delete(this.castFilterQuery(conditions));
	}

	/**
	 * Deletes all media items for the given category
	 * @param userId user ID
	 * @param categoryId category ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllMediaItemsInCategory(userId: string, categoryId: string): Promise<number> {
		const conditions: QueryFilter<MediaItemInternal> = {
			owner: userId,
			category: categoryId
		};

		return this.queryHelper.delete(this.castFilterQuery(conditions));
	}

	/**
	 * Replaces an own platform in all media items in the given category
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param oldOwnPlatformId the old own platform
	 * @param newOwnPlatformId the new own platform
	 * @returns the number of updated media items, as a promise
	 */
	public replaceOwnPlatformInAllMediaItems(userId: string, categoryId: string, oldOwnPlatformId: string | string[], newOwnPlatformId: string | undefined): Promise<number> {
		const set: UpdateQuery<MediaItemInternal> = {
			ownPlatform: newOwnPlatformId
		};

		const conditions: QueryFilter<MediaItemInternal> = {
			owner: userId,
			category: categoryId
		};

		if(oldOwnPlatformId instanceof Array) {
			conditions.ownPlatform = { $in: oldOwnPlatformId };
		}
		else {
			conditions.ownPlatform = oldOwnPlatformId;
		}
		
		return this.queryHelper.updateSelectiveMany(this.castUpdateQuery(set), this.castFilterQuery(conditions));
	}

	/**
	 * Must be implemented by subclasses to define the default (e.g. for the 'get all media items' API) sort conditions
	 * @returns at least one sort condition
	 */
	protected abstract getDefaultSortBy(): TMediaItemSortByInternal[];

	/**
	 * Must be implemented by subclasses to provide an empty Mongoose document of the linked model
	 * @returns an empty Mongoose document
	 */
	protected abstract getNewEmptyDocument(): HydratedDocument<TMediaItemInternal>;

	/**
	 * Must be implemented by subclasses to set the correct sort condition from a sortBy object. Implementations can call setCommonSortConditions()
	 * to handle the sortBy values common to all media items.
	 * @param sortBy the source sort object
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected abstract setSortConditions(sortBy: TMediaItemSortByInternal, sortDirection: SortOrder, sortConditions: Sortable<TMediaItemInternal>): void;

	/**
	 * Must be implemented by subclasses to add search conditions for the 'filter media item' API. Implementations can call addCommonConditionsFromFilter()
	 * to handle the filter values common to all media items.
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param andConditions the target array of AND conditions
	 * @param filterBy the optional source filters
	 */
	protected abstract addConditionsFromFilter(userId: string, categoryId: string, andConditions: QueryFilter<TMediaItemInternal>[], filterBy?: TMediaItemFilterInternal): void;

	/**
	 * Must be implemented by subclasses to (possibly) add more search conditions for the 'search media item' API
	 * @param term the search term
	 * @param termRegExp the pre-computed RegExp of the search term
	 * @param searchConditions the common search conditions where the implementation can push other fields
	 */
	protected abstract setSearchByTermConditions(term: string, termRegExp: RegExp, searchConditions: QueryFilter<TMediaItemInternal>[]): void;

	/**
	 * Must be implemented by subclasses to define the linked media type
	 * @returns the linked media type
	 */
	protected abstract getLinkedMediaType(): MediaTypeInternal;

	/**
	 * Helper for subclasses that can be called during addConditionsFromFilter() to handle the filter values common to all media items.
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param andConditions the target array of AND conditions
	 * @param filterBy the optional source filters
	 */
	protected addCommonConditionsFromFilter(userId: string, categoryId: string, andConditions: QueryFilter<MediaItemInternal>[], filterBy?: MediaItemFilterInternal): void {
		andConditions.push({
			owner: userId,
			category: categoryId
		});

		if(filterBy) {
			if(filterBy.importanceLevels && filterBy.importanceLevels.length > 0) {
				andConditions.push({
					importance: {
						$in: filterBy.importanceLevels
					}
				});
			}

			if(filterBy.complete !== undefined && filterBy.complete !== null) {
				if(filterBy.complete) {
					andConditions.push({
						completedLastOn: {
							$ne: undefined
						},
						markedAsRedo: {
							$ne: true
						}
					});
				}
				else {
					andConditions.push({
						$or: [{
							completedLastOn: undefined
						}, {
							markedAsRedo: true
						}]
					});
				}
			}

			if(filterBy.name) {
				// Case insensitive exact match
				andConditions.push({
					name: new RegExp(`^${miscUtils.escapeRegExp(filterBy.name)}$`, 'i')
				});
			}

			if(filterBy.groups) {
				if(filterBy.groups.groupIds && filterBy.groups.groupIds.length > 0) {
					andConditions.push({
						group: {
							$in: filterBy.groups.groupIds
						}
					});
				}
				else {
					const any = filterBy.groups.anyGroup;
					const no = filterBy.groups.noGroup;
					if(any && !no) {
						andConditions.push({
							group: {
								$ne: undefined
							}
						});
					}
					else if(!any && no) {
						andConditions.push({
							group: undefined
						});
					}
				}
			}

			if(filterBy.ownPlatforms) {
				if(filterBy.ownPlatforms.ownPlatformIds && filterBy.ownPlatforms.ownPlatformIds.length > 0) {
					andConditions.push({
						ownPlatform: {
							$in: filterBy.ownPlatforms.ownPlatformIds
						}
					});
				}
				else {
					const any = filterBy.ownPlatforms.anyOwnPlatform;
					const no = filterBy.ownPlatforms.noOwnPlatform;
					if(any && !no) {
						andConditions.push({
							ownPlatform: {
								$ne: undefined
							}
						});
					}
					else if(!any && no) {
						andConditions.push({
							ownPlatform: undefined
						});
					}
				}
			}
		}
	}

	/**
	 * Helper for subclasses that can be called during setSortConditions() to handle the sortBy values common to all media items.
	 * @param sortByField the source sort field
	 * @param sortDirection the pre-computed sort direction to be assigned to the sort field
	 * @param sortConditions the sort conditions where the sortDirection should be set according to the sortBy value
	 */
	protected setCommonSortConditions(sortByField: MediaItemSortFieldInternal, sortDirection: SortOrder, sortConditions: Sortable<TMediaItemInternal>): void {
		switch(sortByField) {
			case 'IMPORTANCE':
				sortConditions.importance = sortDirection;
				break;

			case 'NAME':
				sortConditions.name = sortDirection;
				break;

			case 'GROUP':
				sortConditions.group = sortDirection;
				sortConditions.orderInGroup = sortDirection;
				break;

			case 'OWN_PLATFORM':
				sortConditions.ownPlatform = sortDirection;
				break;

			case 'COMPLETION_DATE':
				sortConditions.completedLastOn = sortDirection;
				break;

			case 'ACTIVE':
				sortConditions.active = sortDirection;
				break;

			case 'RELEASE_DATE':
				sortConditions.releaseDate = sortDirection;
				break;

			default:
				logger.error('Unexpected order by value: %s', sortByField);
				throw AppError.GENERIC.withDetails('Unhandled orderBy value');
		}
	}

	/**
	 * Helper to get the "populate" options for linked entities
	 * @returns the "populate" options
	 */
	protected getPopulateAll(): Populatable<TMediaItemInternal> {
		const populate: Populatable<TMediaItemInternal> = {};
		populate.group = true;
		populate.ownPlatform = true;
		return populate;
	}

	/**
	 * Helper to build the aggregation expression that resolves the status of a media item.
	 *
	 * THIS RULE IS DUPLICATED IN THE FRONT END, in MediaItemMapper.buildStatusLabel: the four statuses are not persisted
	 * anywhere, they are derived from other fields, and the alternative to computing them here would be shipping enough
	 * per-item data for the client to bucket the whole backlog itself. The precedence below is the contract between the
	 * two sides, and changing it on one of them silently makes this aggregate disagree with the list rows.
	 *
	 * Note that 'UPCOMING' is decided against the server clock here and against the browser clock there, so an item
	 * releasing today can be counted differently by the two. That is harmless and is not worth solving
	 * @param now the instant a release date is compared against
	 * @returns the aggregation expression
	 */
	private buildBacklogStatusExpression(now: Date): PipelineStage.Project['$project'][string] {
		const hasCompletions = {
			$gt: [{ $size: { $ifNull: [ '$completedOn', []] } }, 0 ]
		};

		return {
			$switch: {
				branches: [{
					// Completed and not marked for redo: what the backlog leaves out
					case: { $and: [ hasCompletions, { $ne: [ '$markedAsRedo', true ] }] },
					then: COMPLETE_STATUS
				}, {
					// Marked as currently active, whatever else it carries
					case: { $eq: [ '$active', true ] },
					then: ACTIVE_STATUS
				}, {
					// Completed in the past but moved back to the current list
					case: { $and: [ hasCompletions, { $eq: [ '$markedAsRedo', true ] }] },
					then: REDO_STATUS
				}, {
					// Not released yet
					case: { $gt: [ '$releaseDate', now ] },
					then: UPCOMING_STATUS
				}],
				default: NEW_STATUS
			}
		};
	}

	/**
	 * Helper to build the aggregation expression that extracts the year of a completion date.
	 *
	 * The time zone matters: completion dates are written by the client at local midnight and stored as the
	 * corresponding instant, so a completion dated the 1st of January is stored in the previous year for any client east
	 * of Greenwich. Extracting the year in UTC would put those completions in the wrong year
	 * @param timezone the optional IANA time zone, defaulting to UTC
	 * @returns the aggregation expression
	 */
	private buildCompletionYearExpression(timezone?: string): PipelineStage.Group['$group']['_id'] {
		if(timezone) {
			return {
				$year: {
					date: '$completedOn',
					timezone: timezone
				}
			};
		}

		return {
			$year: '$completedOn'
		};
	}

	/**
	 * Helper to turn the raw aggregation result into the internal stats model
	 * @param result the raw aggregation result
	 * @returns the internal stats model
	 */
	private buildStatsResult(result: MediaItemsStatsAggregationResult): MediaItemsStatsInternal {
		const byYear: MediaItemsStatsYearInternal[] = result.completionsByYear.map((entry) => {
			return {
				year: entry._id,
				count: entry.count
			};
		});

		// The statuses come out of the database in group order: they are reordered here so that the result is stable
		const byStatus: MediaItemsStatsStatusInternal[] = [];
		for(const status of INTERNAL_MEDIA_ITEM_BACKLOG_STATUSES) {
			const entry = result.backlogByStatus.find((candidate) => {
				return candidate._id === status;
			});

			if(entry) {
				byStatus.push({
					status: status,
					count: entry.count
				});
			}
		}

		const byImportanceAndOwnPlatform: MediaItemsStatsImportanceAndOwnPlatformInternal[] = result.backlogByImportanceAndOwnPlatform.map((entry) => {
			return {
				importance: entry._id.importance,
				ownPlatformId: entry._id.ownPlatform === null || entry._id.ownPlatform === undefined ? undefined : String(entry._id.ownPlatform),
				count: entry.count
			};
		});

		return {
			mediaItems: {
				total: this.readAggregationCount(result.categoryTotal),
				filtered: this.readAggregationCount(result.filteredTotal)
			},
			completions: {
				// The total is the sum of the years rather than another branch: they cannot disagree if there is only one source
				total: byYear.reduce((total, entry) => {
					return total + entry.count;
				}, 0),
				mediaItems: this.readAggregationCount(result.completionMediaItems),
				byYear: byYear
			},
			backlog: {
				total: byStatus.reduce((total, entry) => {
					return total + entry.count;
				}, 0),
				byStatus: byStatus,
				byImportanceAndOwnPlatform: byImportanceAndOwnPlatform
			}
		};
	}

	/**
	 * Helper to read a $count facet branch, which is an empty array (and not a zero) when nothing matched
	 * @param branch the raw branch result
	 * @returns the count
	 */
	private readAggregationCount(branch: { value: number }[]): number {
		return branch.length > 0 ? branch[0].value : 0;
	}

	/**
	 * Helper to run a list query and pair its results with the total number of matching media items. The count is
	 * a second query, so it only runs when a page was actually requested: without pagination the results ARE the total
	 * @param conditions the query conditions
	 * @param sortBy the sort conditions
	 * @param pagination the optional pagination options
	 * @returns the media items and their total count, as a promise
	 */
	private async findAndCount(conditions: QueryFilter<TMediaItemInternal>, sortBy: Sortable<TMediaItemInternal>, pagination?: PaginationInternal): Promise<PaginatedResultInternal<TMediaItemInternal>> {
		const elements = await this.queryHelper.find(conditions, sortBy, this.getPopulateAll(), pagination);

		return {
			elements: elements,
			totalCount: pagination ? await this.queryHelper.count(conditions) : elements.length
		};
	}

	/**
	 * Helper to append the ID as the last sort condition. None of the sortable fields is unique, so without a
	 * tiebreaker the order of two media items with the same sort value is undefined: harmless when the whole list
	 * is returned at once, but enough to make a paginated request repeat one media item and skip another
	 * @param sortConditions the sort conditions to complete
	 */
	private setTiebreakerSortCondition(sortConditions: Sortable<TMediaItemInternal>): void {
		sortConditions._id = 'asc';
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param userId the user
	 * @param category the category
	 * @param group the group (optional)
	 * @param ownPlatform the own platform (optional)
	 * @param mediaItemId the media item ID (optional to use this method for new inserts)
	 * @returns a void promise that resolves if all preconditions are OK
	 */
	private checkWritePreconditions(errorToThow: AppError, userId: string, category: string | CategoryInternal, group?: string | GroupInternal, ownPlatform?: string | OwnPlatformInternal, mediaItemId?: string): Promise<void> {
		return new Promise((resolve, reject): void => {
			this.checkExistencePreconditionsHelper(errorToThow, () => {
				const categoryId = this.getEntityStringId(category);
				const groupId = group ? this.getEntityStringId(group) : undefined;
				const ownPlatformId = ownPlatform ? this.getEntityStringId(ownPlatform) : undefined;

				const checkPromises: Promise<PersistedEntityInternal | undefined>[] = [];

				// Preconditions are different when it's a new media item or an existing one
				if(mediaItemId) {
					// Make sure the media item exists
					checkPromises.push(this.getMediaItem(userId, categoryId, mediaItemId));
				}
				else {
					// Get the category
					const categoryCheckPromise = categoryController.getCategory(userId, categoryId);

					// Check that media item and category media types are compatible (first then())
					categoryCheckPromise.then((retrievedCategory) => {
						if(retrievedCategory && retrievedCategory.mediaType !== this.getLinkedMediaType()) {
							reject(AppError.DATABASE_SAVE.withDetails('Media item and category have incompatible media types'));
						}
					});

					// Check that the category actually exists (second then(), handled by checkExistencePreconditionsHelper())
					checkPromises.push(categoryCheckPromise);
				}

				// If a group was set, also make sure the group exists
				if(groupId) {
					checkPromises.push(groupController.getGroup(userId, categoryId, groupId));
				}

				// If an own platform was set, also make sure the platform exists
				if(ownPlatformId) {
					checkPromises.push(ownPlatformController.getOwnPlatform(userId, categoryId, ownPlatformId));
				}

				return Promise.all(checkPromises);
			})
				.then(() => {
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	/**
	 * As per https://github.com/DefinitelyTyped/DefinitelyTyped/issues/39358 FilterQuery does not work with generics, as intended.
	 * Since here I know subclasses won't cause any problem, I can safely cast the object.
	 * @param conditions source
	 * @returns cast source
	 */
	private castFilterQuery(conditions: QueryFilter<MediaItemInternal>): QueryFilter<TMediaItemInternal> {
		return conditions as QueryFilter<TMediaItemInternal>;
	}
	
	private castFilterQueryArray(conditions: QueryFilter<MediaItemInternal>[]): QueryFilter<TMediaItemInternal>[] {
		return conditions as QueryFilter<TMediaItemInternal>[];
	}

	private castUpdateQuery(set: UpdateQuery<MediaItemInternal>): UpdateQuery<TMediaItemInternal> {
		return set as UpdateQuery<TMediaItemInternal>;
	}
}
