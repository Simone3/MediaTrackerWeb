import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MARK_MEDIA_ITEM_AS_COMPLETE } from 'app/redux/actions/media-item/const';
import { applyInlineMediaItemUpdate } from 'app/redux/sagas/media-item/inline-update-helper';

describe('applyInlineMediaItemUpdate', () => {
	test('marks a media item as complete without mutating the original completion history', () => {
		const originalCompletionDate = new Date('2010-01-01T00:00:00.000Z');
		const completionDates = [ originalCompletionDate ];
		const mediaItem: MediaItemInternal = {
			id: '5',
			mediaType: 'MOVIE',
			status: 'ACTIVE',
			name: 'My Fifth Movie',
			importance: '200',
			completedOn: completionDates,
			markedAsRedo: true,
			active: true
		};
		const completionDate = new Date('2026-03-14T15:23:04.884Z');

		const updatedMediaItem = applyInlineMediaItemUpdate(mediaItem, MARK_MEDIA_ITEM_AS_COMPLETE, completionDate);

		expect(updatedMediaItem).not.toBe(mediaItem);
		expect(updatedMediaItem.completedOn).toEqual([ originalCompletionDate, completionDate ]);
		expect(updatedMediaItem.completedOn).not.toBe(completionDates);
		expect(updatedMediaItem.status).toBe('COMPLETE');
		expect(updatedMediaItem.markedAsRedo).toBe(false);
		expect(mediaItem.completedOn).toEqual([ originalCompletionDate ]);
		expect(mediaItem.status).toBe('ACTIVE');
		expect(mediaItem.markedAsRedo).toBe(true);
	});
});
