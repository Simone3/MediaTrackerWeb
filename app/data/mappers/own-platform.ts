import { ModelMapper } from 'app/data/mappers/common';
import { IdentifiedOwnPlatform, OwnPlatformFilter } from 'app/data/models/api/own-platform';
import { OwnPlatformFilterInternal, OwnPlatformInternal, OWN_PLATFORM_ICON_INTERNAL_VALUES } from 'app/data/models/internal/own-platform';

/**
 * Mapper for own platforms
 */
class OwnPlatformMapper extends ModelMapper<OwnPlatformInternal, IdentifiedOwnPlatform, {}> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: OwnPlatformInternal): IdentifiedOwnPlatform {
		
		return {
			uid: source.id,
			name: source.name,
			color: source.color,
			icon: source.icon
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedOwnPlatform): OwnPlatformInternal {
		
		const ownPlatformIcon = OWN_PLATFORM_ICON_INTERNAL_VALUES.find((icon) => {
			return icon === source.icon;
		});

		return {
			id: source.uid,
			name: source.name,
			color: source.color,
			icon: ownPlatformIcon ? ownPlatformIcon : 'default'
		};
	}
}

/**
 * Mapper for own platform filters
 */
class OwnPlatformFilterMapper extends ModelMapper<OwnPlatformFilterInternal, OwnPlatformFilter, {}> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: OwnPlatformFilterInternal): OwnPlatformFilter {
		
		return {
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: OwnPlatformFilter): OwnPlatformFilterInternal {
		
		return {
			name: source.name
		};
	}
}

/**
 * Singleton instance of the own platforms mapper
 */
export const ownPlatformMapper = new OwnPlatformMapper();

/**
 * Singleton instance of the own platform filter mapper
 */
export const ownPlatformFilterMapper = new OwnPlatformFilterMapper();
