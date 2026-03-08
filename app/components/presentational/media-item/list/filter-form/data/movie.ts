import { MediaItemFilterFormMapper, MediaItemFilterFormSortBy, mediaItemFilterFormValidationShape, MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { movieDefinitionsController } from 'app/controllers/core/entities/media-items/movie';
import { AppError } from 'app/data/models/internal/error';
import { MovieFilterInternal, MovieSortByInternal } from 'app/data/models/internal/media-items/movie';
import { object, ObjectSchema } from 'yup';

/**
 * The movie filter form model
 */
export type MovieFilterFormValues = MediaItemFilterFormValues & {

}

/**
 * The movie filter form validation
 */
export const movieFilterFormValidationSchema: ObjectSchema<MovieFilterFormValues> = object().required().shape(mediaItemFilterFormValidationShape);

/**
 * Mapper for the movie filter form values
 */
class MovieFilterFormMapper extends MediaItemFilterFormMapper<MovieFilterInternal, MovieSortByInternal, MovieFilterFormValues> {
	
	/**
	 * @override
	 */
	public toFormValues(filter: MovieFilterInternal, sortBy: MovieSortByInternal[]): MovieFilterFormValues {
		
		return {
			...this.toCommonFormValues(filter),
			sortBy: this.toSortByFormValue(sortBy)
		};
	}
	
	/**
	 * @override
	 */
	public toFilterModel(formValues: MovieFilterFormValues): MovieFilterInternal {
		
		return this.toCommonFilterModel(formValues);
	}

	/**
	 * @override
	 */
	public toSortByModel(formValues: MovieFilterFormValues): MovieSortByInternal[] {
		
		switch(formValues.sortBy) {

			case 'DEFAULT':
				return movieDefinitionsController.getDefaultSortBy();
			
			case 'COMPLETION_DATE':
				return [{ field: 'COMPLETION_DATE', ascending: false }];

			case 'NAME':
				return [{ field: 'NAME', ascending: true }];

			default:
				throw AppError.GENERIC.withDetails(`Cannot map sort form value ${formValues.sortBy}`);
		}
	}

	/**
	 * Helper for nested object mapping
	 * @param sortBy the source
	 * @returns the target
	 */
	private toSortByFormValue(sortBy: MovieSortByInternal[]): MediaItemFilterFormSortBy {
		
		if(sortBy.length === 1) {

			if(sortBy[0].field === 'NAME') {

				return 'NAME';
			}
			else if(sortBy[0].field === 'COMPLETION_DATE') {

				return 'COMPLETION_DATE';
			}
		}
		
		return 'DEFAULT';
	}
}

/**
 * Singleton implementation of the movie filter form mapper
 */
export const movieFilterFormMapper = new MovieFilterFormMapper();
