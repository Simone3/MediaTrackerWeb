import type { MediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/media-item';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import statusReadingIcon from 'app/resources/images/ic_status_reading.svg';
import { i18n } from 'app/utilities/i18n';

export const bookMediaItemRowDataDefinition: MediaItemRowDataDefinition<BookInternal> = {
	getCreatorNames: (mediaItem) => {
		return mediaItem.authors;
	},
	getDurationLabel: (mediaItem) => {
		return mediaItem.pagesNumber ? i18n.t('mediaItem.list.duration.BOOK', { duration: mediaItem.pagesNumber }) : undefined;
	},
	getSecondaryMetadataMarkers: () => {
		return [];
	},
	activeStatusIcon: statusReadingIcon,
	hasRemainingActiveProgress: () => {
		return true;
	}
};
