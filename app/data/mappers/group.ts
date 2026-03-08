import { ModelMapper } from 'app/data/mappers/common';
import { GroupFilter, IdentifiedGroup } from 'app/data/models/api/group';
import { GroupFilterInternal, GroupInternal } from 'app/data/models/internal/group';

/**
 * Mapper for groups
 */
class GroupMapper extends ModelMapper<GroupInternal, IdentifiedGroup, {}> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: GroupInternal): IdentifiedGroup {
		
		return {
			uid: source.id,
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedGroup): GroupInternal {
		
		return {
			id: source.uid,
			name: source.name
		};
	}
}

/**
 * Mapper for group filters
 */
class GroupFilterMapper extends ModelMapper<GroupFilterInternal, GroupFilter, {}> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: GroupFilterInternal): GroupFilter {
		
		return {
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GroupFilter): GroupFilterInternal {
		
		return {
			name: source.name
		};
	}
}

/**
 * Singleton instance of the groups mapper
 */
export const groupMapper = new GroupMapper();

/**
 * Singleton instance of the group filter mapper
 */
export const groupFilterMapper = new GroupFilterMapper();
