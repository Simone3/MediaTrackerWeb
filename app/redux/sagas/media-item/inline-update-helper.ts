import { AppError } from 'app/data/models/internal/error';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MARK_MEDIA_ITEM_AS_ACTIVE, MARK_MEDIA_ITEM_AS_COMPLETE, MARK_MEDIA_ITEM_AS_REDO } from 'app/redux/actions/media-item/const';

export type InlineMediaItemUpdateActionType = typeof MARK_MEDIA_ITEM_AS_ACTIVE | typeof MARK_MEDIA_ITEM_AS_COMPLETE | typeof MARK_MEDIA_ITEM_AS_REDO;

/**
 * Applies the inline media item changes for a specific action type without mutating the source item.
 * @param sourceMediaItem the source media item
 * @param actionType the inline update action type
 * @param now the current timestamp to use for completion updates
 * @returns the updated media item
 */
export const applyInlineMediaItemUpdate = (sourceMediaItem: MediaItemInternal, actionType: InlineMediaItemUpdateActionType, now: Date = new Date()): MediaItemInternal => {
	const mediaItem = { ...sourceMediaItem };

	switch (actionType) {
		case MARK_MEDIA_ITEM_AS_ACTIVE: {
			mediaItem.active = true;
			mediaItem.status = 'ACTIVE';
			return mediaItem;
		}

		case MARK_MEDIA_ITEM_AS_COMPLETE: {
			const completionDates = mediaItem.completedOn ? [ ...mediaItem.completedOn ] : [];
			completionDates.push(now);
			mediaItem.completedOn = completionDates;
			mediaItem.active = false;
			mediaItem.markedAsRedo = false;
			mediaItem.status = 'COMPLETE';
			return mediaItem;
		}

		case MARK_MEDIA_ITEM_AS_REDO: {
			mediaItem.active = false;
			mediaItem.markedAsRedo = true;
			mediaItem.status = 'REDO';
			return mediaItem;
		}

		default: {
			throw AppError.GENERIC.withDetails(`Action was intercepted by saga but no case was matched`);
		}
	}
};
