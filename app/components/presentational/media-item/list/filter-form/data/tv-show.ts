import { MediaItemFilterFormMapper, MediaItemFilterFormSortBy, mediaItemFilterFormValidationShape, MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { tvShowDefinitionsController } from 'app/controllers/core/entities/media-items/tv-show';
import { AppError } from 'app/data/models/internal/error';
import { TvShowFilterInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';
import { object, ObjectSchema } from 'yup';

/**
 * The TV show filter form model
 */
export type TvShowFilterFormValues = MediaItemFilterFormValues & {

}

/**
 * The TV show filter form validation
 */
export const tvShowFilterFormValidationSchema: ObjectSchema<TvShowFilterFormValues> = object().required().shape(mediaItemFilterFormValidationShape);

/**
 * Mapper for the TV show filter form values
 */
class TvShowFilterFormMapper extends MediaItemFilterFormMapper<TvShowFilterInternal, TvShowSortByInternal, TvShowFilterFormValues> {
	
	/**
	 * @override
	 */
	public toFormValues(filter: TvShowFilterInternal, sortBy: TvShowSortByInternal[]): TvShowFilterFormValues {
		
		return {
			...this.toCommonFormValues(filter),
			sortBy: this.toSortByFormValue(sortBy)
		};
	}
	
	/**
	 * @override
	 */
	public toFilterModel(formValues: TvShowFilterFormValues): TvShowFilterInternal {
		
		return this.toCommonFilterModel(formValues);
	}

	/**
	 * @override
	 */
	public toSortByModel(formValues: TvShowFilterFormValues): TvShowSortByInternal[] {
		
		switch(formValues.sortBy) {

			case 'DEFAULT':
				return tvShowDefinitionsController.getDefaultSortBy();
			
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
	private toSortByFormValue(sortBy: TvShowSortByInternal[]): MediaItemFilterFormSortBy {
		
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
 * Singleton implementation of the TV show filter form mapper
 */
export const tvShowFilterFormMapper = new TvShowFilterFormMapper();
