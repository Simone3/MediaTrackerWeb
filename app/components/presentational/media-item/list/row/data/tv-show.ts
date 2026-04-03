import { buildMediaItemRowData, MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { tvShowDefinitionsController } from 'app/controllers/main/entities/media-items-definitions/tv-show';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.svg';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

export const getTvShowMediaItemRowData = (mediaItem: TvShowInternal): MediaItemRowData => {
	const durationValue = tvShowDefinitionsController.getDurationValue(mediaItem);

	return buildMediaItemRowData(mediaItem, {
		creatorNames: tvShowDefinitionsController.getCreatorNames(mediaItem),
		durationLabel: durationValue ? i18n.t('mediaItem.list.duration.TV_SHOW', { duration: durationValue }) : undefined,
		secondaryMetadataMarkers: mediaItem.inProduction ? [ i18n.t('mediaItem.list.production') ] : [],
		activeStatusIcon: statusWatchingIcon,
		hasRemainingActiveProgress: mediaItemUtils.getTvShowCounters(mediaItem.seasons).episodesToWatchNumber > 0
	});
};
