import { AppError } from 'app/data/models/internal/error';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';

export type MediaItemRowData = {
	creatorNames?: string[];
	durationLabel?: string;
	secondaryMetadataMarkers: string[];
	activeStatusIcon: string;
	hasRemainingActiveProgress: boolean;
	statusLabel: string;
};

/**
 * Helper to define an accessible label for the status icon
 * @param mediaItem the media item
 * @returns the label
 */
const getStatusLabel = (mediaItem: MediaItemInternal): string => {
	switch (mediaItem.status) {
		case 'ACTIVE':
			return i18n.t(`mediaItem.list.markActive.${mediaItem.mediaType}`);

		case 'COMPLETE':
			return i18n.t(`mediaItem.list.markComplete.${mediaItem.mediaType}`);

		case 'REDO':
			return i18n.t(`mediaItem.list.markRedo.${mediaItem.mediaType}`);

		case 'UPCOMING':
			return i18n.t('mediaItem.list.status.upcoming');

		case 'NEW':
			return i18n.t(`mediaItem.common.importance.${mediaItem.importance}`);

		default:
			throw AppError.GENERIC.withDetails(`Status not recognized for media item status label`);
	}
};

/**
 * Helper to build generic row data from media-type-specific inputs
 * @param mediaItem the media item
 * @param rowData the media-type-specific row data
 * @returns the completed row data
 */
export const buildMediaItemRowData = (mediaItem: MediaItemInternal, rowData: MediaItemRowDataInput): MediaItemRowData => {
	return {
		...rowData,
		secondaryMetadataMarkers: rowData.secondaryMetadataMarkers ? rowData.secondaryMetadataMarkers : [],
		statusLabel: getStatusLabel(mediaItem)
	};
};

type MediaItemRowDataInput = Omit<MediaItemRowData, 'secondaryMetadataMarkers' | 'statusLabel'> & {
	secondaryMetadataMarkers?: string[];
};
