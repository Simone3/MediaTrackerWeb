import type { MediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import statusPlayingIcon from 'app/resources/images/ic_status_playing.svg';
import { i18n } from 'app/utilities/i18n';

export const videogameMediaItemRowDataDefinition: MediaItemRowDataDefinition<VideogameInternal> = {
	getCreatorNames: (mediaItem) => {
		return mediaItem.developers;
	},
	getDurationLabel: (mediaItem) => {
		return mediaItem.averageLengthHours ? i18n.t('mediaItem.list.duration.VIDEOGAME', { duration: mediaItem.averageLengthHours }) : undefined;
	},
	getSecondaryMetadataMarkers: () => {
		return [];
	},
	activeStatusIcon: statusPlayingIcon,
	hasRemainingActiveProgress: () => {
		return true;
	}
};
