import { bookMediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/book';
import { movieMediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/movie';
import { tvShowMediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/tv-show';
import { videogameMediaItemRowDataDefinition } from 'app/components/presentational/media-item/list/row/data/videogame';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';

export type MediaItemRowDataDefinition<TMediaItemInternal extends MediaItemInternal = MediaItemInternal> = {
	getCreatorNames: (mediaItem: TMediaItemInternal) => string[] | undefined;
	getDurationLabel: (mediaItem: TMediaItemInternal) => string | undefined;
	getSecondaryMetadataMarkers: (mediaItem: TMediaItemInternal) => string[];
	activeStatusIcon: string;
	hasRemainingActiveProgress: (mediaItem: TMediaItemInternal) => boolean;
};

export type MediaItemRowData = {
	creatorNames?: string[];
	durationLabel?: string;
	secondaryMetadataMarkers: string[];
	activeStatusIcon: string;
	hasRemainingActiveProgress: boolean;
	statusLabel: string;
};

/**
 * Helper to get the media-type-specific row data definition
 * @param mediaType the media type
 * @returns the definition
 */
const getMediaItemRowDataDefinition = (mediaType: MediaTypeInternal): MediaItemRowDataDefinition => {
	switch(mediaType) {
		case 'BOOK':
			return bookMediaItemRowDataDefinition;

		case 'MOVIE':
			return movieMediaItemRowDataDefinition;

		case 'TV_SHOW':
			return tvShowMediaItemRowDataDefinition;

		case 'VIDEOGAME':
			return videogameMediaItemRowDataDefinition;

		default:
			throw AppError.GENERIC.withDetails(`Media type not recognized for media item row data`);
	}
};

/**
 * Helper to define an accessible label for the status icon
 * @param mediaItem the media item
 * @returns the label
 */
const getStatusLabel = (mediaItem: MediaItemInternal): string => {
	switch(mediaItem.status) {
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
 * Helper to gather the full row presentation data for a media item
 * @param mediaItem the media item
 * @returns the row data
 */
export const getMediaItemRowData = (mediaItem: MediaItemInternal): MediaItemRowData => {
	const definition = getMediaItemRowDataDefinition(mediaItem.mediaType);

	return {
		creatorNames: definition.getCreatorNames(mediaItem),
		durationLabel: definition.getDurationLabel(mediaItem),
		secondaryMetadataMarkers: definition.getSecondaryMetadataMarkers(mediaItem),
		activeStatusIcon: definition.activeStatusIcon,
		hasRemainingActiveProgress: definition.hasRemainingActiveProgress(mediaItem),
		statusLabel: getStatusLabel(mediaItem)
	};
};
