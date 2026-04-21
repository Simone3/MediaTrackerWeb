import { buildMediaItemRowData, MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { bookDefinitionsController } from 'app/controllers/main/entities/media-items-definitions/book';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import statusReadingIcon from 'app/resources/images/ic_status_reading.svg';
import { i18n } from 'app/utilities/i18n';

export const getBookMediaItemRowData = (mediaItem: BookInternal): MediaItemRowData => {
	const durationValue = bookDefinitionsController.getDurationValue(mediaItem);

	return buildMediaItemRowData(mediaItem, {
		creatorNames: bookDefinitionsController.getCreatorNames(mediaItem),
		durationLabel: durationValue ? i18n.t('mediaItem.list.duration.BOOK', { duration: durationValue }) : undefined,
		activeStatusIcon: statusReadingIcon,
		hasRemainingActiveProgress: true
	});
};
