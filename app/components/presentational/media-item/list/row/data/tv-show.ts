import { buildMediaItemRowData, MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.svg';
import { i18n } from 'app/utilities/i18n';
import { getTvShowCreatorNames, getTvShowDurationValue } from 'app/utilities/media-item-definitions';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

export const getTvShowMediaItemRowData = (mediaItem: TvShowInternal): MediaItemRowData => {
	const durationValue = getTvShowDurationValue(mediaItem);

	return buildMediaItemRowData(mediaItem, {
		creatorNames: getTvShowCreatorNames(mediaItem),
		durationLabel: durationValue ? i18n.t('mediaItem.list.duration.TV_SHOW', { duration: durationValue }) : undefined,
		secondaryMetadataMarkers: mediaItem.inProduction ? [ i18n.t('mediaItem.list.production') ] : [],
		activeStatusIcon: statusWatchingIcon,
		hasRemainingActiveProgress: mediaItemUtils.getTvShowCounters(mediaItem.seasons).episodesToWatchNumber > 0
	});
};
