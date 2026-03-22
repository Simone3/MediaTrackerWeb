import { MediaTypeInternal } from 'app/data/models/internal/category';
import bookIcon from 'app/resources/images/ic_media_book.svg';
import movieIcon from 'app/resources/images/ic_media_movie.svg';
import tvShowIcon from 'app/resources/images/ic_media_tvshow.svg';
import videogameIcon from 'app/resources/images/ic_media_videogame.svg';
import { ReactElement } from 'react';

const mediaTypeToIcon: Record<MediaTypeInternal, string> = {
	BOOK: bookIcon,
	MOVIE: movieIcon,
	TV_SHOW: tvShowIcon,
	VIDEOGAME: videogameIcon
};

/**
 * Presentational component to display a category icon based on its media type
 * @param props the input props
 * @returns the component
 */
export const MediaIconComponent = (props: MediaIconComponentProps): ReactElement => {
	return (
		<img
			src={mediaTypeToIcon[props.mediaType]}
			alt={props.alt ?? ''}
			className={props.className}
		/>
	);
};

type MediaIconComponentProps = {
	mediaType: MediaTypeInternal;
	className?: string;
	alt?: string;
}
