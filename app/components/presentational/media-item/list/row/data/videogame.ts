import { buildMediaItemRowData, MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import statusPlayingIcon from 'app/resources/images/ic_status_playing.svg';
import { i18n } from 'app/utilities/i18n';
import { getVideogameCreatorNames, getVideogameDurationValue } from 'app/utilities/media-item-definitions';

export const getVideogameMediaItemRowData = (mediaItem: VideogameInternal): MediaItemRowData => {
	const durationValue = getVideogameDurationValue(mediaItem);

	return buildMediaItemRowData(mediaItem, {
		creatorNames: getVideogameCreatorNames(mediaItem),
		durationLabel: durationValue ? i18n.t('mediaItem.list.duration.VIDEOGAME', { duration: durationValue }) : undefined,
		activeStatusIcon: statusPlayingIcon,
		hasRemainingActiveProgress: true
	});
};
