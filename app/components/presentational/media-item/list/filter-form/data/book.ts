import { MediaItemFilterFormMapper, MediaItemFilterFormSortBy, mediaItemFilterFormValidationShape, MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { bookDefinitionsController } from 'app/controllers/core/entities/media-items/book';
import { AppError } from 'app/data/models/internal/error';
import { BookFilterInternal, BookSortByInternal } from 'app/data/models/internal/media-items/book';
import { object, ObjectSchema } from 'yup';

/**
 * The book filter form model
 */
export type BookFilterFormValues = MediaItemFilterFormValues & {

}

/**
 * The book filter form validation
 */
export const bookFilterFormValidationSchema: ObjectSchema<BookFilterFormValues> = object().required().shape(mediaItemFilterFormValidationShape);

/**
 * Mapper for the book filter form values
 */
class BookFilterFormMapper extends MediaItemFilterFormMapper<BookFilterInternal, BookSortByInternal, BookFilterFormValues> {
	
	/**
	 * @override
	 */
	public toFormValues(filter: BookFilterInternal, sortBy: BookSortByInternal[]): BookFilterFormValues {
		
		return {
			...this.toCommonFormValues(filter),
			sortBy: this.toSortByFormValue(sortBy)
		};
	}
	
	/**
	 * @override
	 */
	public toFilterModel(formValues: BookFilterFormValues): BookFilterInternal {
		
		return this.toCommonFilterModel(formValues);
	}

	/**
	 * @override
	 */
	public toSortByModel(formValues: BookFilterFormValues): BookSortByInternal[] {
		
		switch(formValues.sortBy) {

			case 'DEFAULT':
				return bookDefinitionsController.getDefaultSortBy();
			
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
	private toSortByFormValue(sortBy: BookSortByInternal[]): MediaItemFilterFormSortBy {
		
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
 * Singleton implementation of the book filter form mapper
 */
export const bookFilterFormMapper = new BookFilterFormMapper();
