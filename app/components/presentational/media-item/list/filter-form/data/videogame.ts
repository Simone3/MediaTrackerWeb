import { MediaItemFilterFormMapper, MediaItemFilterFormSortBy, mediaItemFilterFormValidationShape, MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { videogameDefinitionsController } from 'app/controllers/core/entities/media-items/videogame';
import { AppError } from 'app/data/models/internal/error';
import { VideogameFilterInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { object, ObjectSchema } from 'yup';

/**
 * The videogame filter form model
 */
export type VideogameFilterFormValues = MediaItemFilterFormValues & {

}

/**
 * The videogame filter form validation
 */
export const videogameFilterFormValidationSchema: ObjectSchema<VideogameFilterFormValues> = object().required().shape(mediaItemFilterFormValidationShape);

/**
 * Mapper for the videogame filter form values
 */
class VideogameFilterFormMapper extends MediaItemFilterFormMapper<VideogameFilterInternal, VideogameSortByInternal, VideogameFilterFormValues> {
	
	/**
	 * @override
	 */
	public toFormValues(filter: VideogameFilterInternal, sortBy: VideogameSortByInternal[]): VideogameFilterFormValues {
		
		return {
			...this.toCommonFormValues(filter),
			sortBy: this.toSortByFormValue(sortBy)
		};
	}
	
	/**
	 * @override
	 */
	public toFilterModel(formValues: VideogameFilterFormValues): VideogameFilterInternal {
		
		return this.toCommonFilterModel(formValues);
	}

	/**
	 * @override
	 */
	public toSortByModel(formValues: VideogameFilterFormValues): VideogameSortByInternal[] {
		
		switch(formValues.sortBy) {

			case 'DEFAULT':
				return videogameDefinitionsController.getDefaultSortBy();
			
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
	private toSortByFormValue(sortBy: VideogameSortByInternal[]): MediaItemFilterFormSortBy {
		
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
 * Singleton implementation of the videogame filter form mapper
 */
export const videogameFilterFormMapper = new VideogameFilterFormMapper();
