import type { MediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.svg';
import { i18n } from 'app/utilities/i18n';

export const movieMediaItemRowDataDefinition: MediaItemRowDataDefinition<MovieInternal> = {
	getCreatorNames: (mediaItem) => {
		return mediaItem.directors;
	},
	getDurationLabel: (mediaItem) => {
		return mediaItem.durationMinutes ? i18n.t('mediaItem.list.duration.MOVIE', { duration: mediaItem.durationMinutes }) : undefined;
	},
	getSecondaryMetadataMarkers: () => {
		return [];
	},
	activeStatusIcon: statusWatchingIcon,
	hasRemainingActiveProgress: () => {
		return true;
	}
};
