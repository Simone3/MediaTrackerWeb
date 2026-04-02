import type { MediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.svg';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

export const tvShowMediaItemRowDataDefinition: MediaItemRowDataDefinition<TvShowInternal> = {
	getCreatorNames: (mediaItem) => {
		return mediaItem.creators;
	},
	getDurationLabel: (mediaItem) => {
		return mediaItem.averageEpisodeRuntimeMinutes ? i18n.t('mediaItem.list.duration.TV_SHOW', { duration: mediaItem.averageEpisodeRuntimeMinutes }) : undefined;
	},
	getSecondaryMetadataMarkers: (mediaItem) => {
		if(mediaItem.inProduction) {
			return [ i18n.t('mediaItem.list.production') ];
		}

		return [];
	},
	activeStatusIcon: statusWatchingIcon,
	hasRemainingActiveProgress: (mediaItem) => {
		return mediaItemUtils.getTvShowCounters(mediaItem.seasons).episodesToWatchNumber > 0;
	}
};
