import { CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';

/**
 * Common class for all media factories, that get some value from a category/media type
 * @template R the factory result
 * @template P the optional extra parameters
 */
export abstract class MediaFactory<R, P = undefined> {

	/**
	 * Gets the correct value from a category or a media type
	 * @param categoryOrMediaType the category or the media type
	 * @param extraParams optional extra parameters
	 * @returns the value corresponding to the given category or media type
	 */
	public get(category: CategoryInternal, extraParams?: P): R;
	public get(mediaType: MediaTypeInternal, extraParams?: P): R;
	public get(categoryOrMediaType: CategoryInternal | MediaTypeInternal, extraParams?: P): R {

		if(typeof categoryOrMediaType === 'string') {

			return this.getInternal(categoryOrMediaType, extraParams);
		}
		else {

			return this.getInternal(categoryOrMediaType.mediaType, extraParams);
		}
	}

	/**
	 * Internal helper to switch on the media type
	 * @param mediaType the media type
	 * @param extraParams optional extra parameters
	 * @returns the value corresponding to the given media type
	 */
	protected abstract getInternal(mediaType: MediaTypeInternal, extraParams?: P): R;
}
