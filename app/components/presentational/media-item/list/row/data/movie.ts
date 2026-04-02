import { buildMediaItemRowData, MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.svg';
import { i18n } from 'app/utilities/i18n';
import { getMovieCreatorNames, getMovieDurationValue } from 'app/utilities/media-item-definitions';

export const getMovieMediaItemRowData = (mediaItem: MovieInternal): MediaItemRowData => {
	const durationValue = getMovieDurationValue(mediaItem);

	return buildMediaItemRowData(mediaItem, {
		creatorNames: getMovieCreatorNames(mediaItem),
		durationLabel: durationValue ? i18n.t('mediaItem.list.duration.MOVIE', { duration: durationValue }) : undefined,
		activeStatusIcon: statusWatchingIcon,
		hasRemainingActiveProgress: true
	});
};
