import { buildMediaItemRowData, MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { movieDefinitionsController } from 'app/controllers/core/entities/media-items/definitions/movie';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.svg';
import { i18n } from 'app/utilities/i18n';

export const getMovieMediaItemRowData = (mediaItem: MovieInternal): MediaItemRowData => {
	const durationValue = movieDefinitionsController.getDurationValue(mediaItem);

	return buildMediaItemRowData(mediaItem, {
		creatorNames: movieDefinitionsController.getCreatorNames(mediaItem),
		durationLabel: durationValue ? i18n.t('mediaItem.list.duration.MOVIE', { duration: durationValue }) : undefined,
		activeStatusIcon: statusWatchingIcon,
		hasRemainingActiveProgress: true
	});
};
