import { ModelMapper } from 'app/data/mappers/common';
import { CategoryFilter, IdentifiedCategory } from 'app/data/models/api/category';
import { CategoryFilterInternal, CategoryInternal } from 'app/data/models/internal/category';

/**
 * Mapper for categories
 */
class CategoryMapper extends ModelMapper<CategoryInternal, IdentifiedCategory, {}> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: CategoryInternal): IdentifiedCategory {
		
		return {
			uid: source.id,
			name: source.name,
			mediaType: source.mediaType,
			color: source.color
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedCategory): CategoryInternal {
		
		return {
			id: source.uid,
			name: source.name,
			mediaType: source.mediaType,
			color: source.color
		};
	}
}

/**
 * Mapper for category filters
 */
class CategoryFilterMapper extends ModelMapper<CategoryFilterInternal, CategoryFilter, {}> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: CategoryFilterInternal): CategoryFilter {
		
		return {
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CategoryFilter): CategoryFilterInternal {
		
		return {
			name: source.name
		};
	}
}

/**
 * Singleton instance of the categories mapper
 */
export const categoryMapper = new CategoryMapper();

/**
 * Singleton instance of the category filter mapper
 */
export const categoryFilterMapper = new CategoryFilterMapper();
