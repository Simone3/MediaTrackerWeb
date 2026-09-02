import { PaginationRequest } from 'app/data/models/api/common';
import { PaginationInternal } from 'app/data/models/internal/common';

/**
 * Generic model mapper between some internal model and some external model,
 * with optional extra supporting parameters
 * @template TInternal internal class/type
 * @template TExternal external class/type
 * @template TParams supporting parameters
 */
export abstract class ModelMapper<TInternal, TExternal, TParams> {
	/**
	 * Transforms a list of internal models into a list of external models
	 * @param sources the mapping sources
	 * @param extraParams the optional additional mapping parameters
	 * @returns the mapping targets
	 */
	public toExternalList(sources: TInternal[], extraParams?: TParams): TExternal[] {
		return sources.map((source) => {
			return this.toExternal(source, extraParams);
		});
	}

	/**
	 * Transforms a list of external models into a list of internal models
	 * @param sources the mapping sources
	 * @param extraParams the optional additional mapping parameters
	 * @returns the mapping targets
	 */
	public toInternalList(sources: TExternal[], extraParams?: TParams): TInternal[] {
		return sources.map((source) => {
			return this.toInternal(source, extraParams);
		});
	}

	/**
	 * Transforms a an internal model into an external model
	 * @param source the mapping source
	 * @param extraParams the optional additional mapping parameters
	 * @returns the mapping target
	 */
	public toExternal(source: TInternal, extraParams?: TParams): TExternal {
		return this.convertToExternal(source, extraParams);
	}

	/**
	 * Transforms a an external model into an internal model
	 * @param source the mapping source
	 * @param extraParams the optional additional mapping parameters
	 * @returns the mapping target
	 */
	public toInternal(source: TExternal, extraParams?: TParams): TInternal {
		return this.convertToInternal(source, extraParams);
	}

	/**
	 * For subclasses, to actually implement the internal to external conversion
	 * @param source the mapping source
	 * @param extraParams the optional additional mapping parameters
	 * @returns the mapping target
	 */
	protected abstract convertToExternal(source: TInternal, extraParams?: TParams): TExternal;

	/**
	 * For subclasses, to actually implement the external to internal conversion
	 * @param source the mapping source
	 * @param extraParams the optional additional mapping parameters
	 * @returns the mapping target
	 */
	protected abstract convertToInternal(source: TExternal, extraParams?: TParams): TInternal;
}

/**
 * Mapper for pagination options
 */
class PaginationMapper extends ModelMapper<PaginationInternal, PaginationRequest, never> {
	/**
	 * @override
	 */
	protected convertToExternal(source: PaginationInternal): PaginationRequest {
		return {
			offset: source.offset,
			limit: source.limit
		};
	}

	/**
	 * @override
	 */
	protected convertToInternal(source: PaginationRequest): PaginationInternal {
		return {
			offset: source.offset,
			limit: source.limit
		};
	}
}

/**
 * Singleton instance of the pagination mapper
 */
export const paginationMapper = new PaginationMapper();
