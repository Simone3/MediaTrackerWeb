import { normalizeBookFormValues } from 'app/components/presentational/media-item/details/form/data/book';
import { normalizeMediaItemFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { preserveTvShowSeasonProgress, tvShowFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/tv-show';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';

describe('media-item form data helpers', () => {
	test('normalizes shared media-item fields without media-specific knowledge', () => {
		const mediaItem: MediaItemInternal = {
			id: 'book-1',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '300',
			orderInGroup: 4,
			genres: [ ' Sci-Fi ', '', ' Adventure  ' ]
		};

		expect(normalizeMediaItemFormValues(mediaItem)).toEqual({
			id: 'book-1',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '300',
			genres: [ 'Sci-Fi', 'Adventure' ]
		});
	});

	test('normalizes book-specific inline text fields before save', () => {
		const mediaItem: BookInternal = {
			id: 'book-2',
			name: 'Dune Messiah',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '200',
			authors: [ ' Frank Herbert ', ' ', 'Brian Herbert' ]
		};

		expect(normalizeBookFormValues(mediaItem)).toEqual({
			id: 'book-2',
			name: 'Dune Messiah',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '200',
			authors: [ 'Frank Herbert', 'Brian Herbert' ]
		});
	});

	test('preserves watched-episode progress when TV-show catalog seasons reload', () => {
		const currentValues: TvShowInternal = {
			id: 'tv-show-1',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				},
				{
					number: 2,
					episodesNumber: 8,
					watchedEpisodesNumber: 3
				}
			]
		};
		const mergedValues: TvShowInternal = {
			...currentValues,
			seasons: [
				{
					number: 1,
					episodesNumber: 10
				},
				{
					number: 2,
					episodesNumber: 8
				},
				{
					number: 3,
					episodesNumber: 6
				}
			]
		};

		expect(preserveTvShowSeasonProgress(currentValues, mergedValues)).toEqual({
			...currentValues,
			seasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				},
				{
					number: 2,
					episodesNumber: 8,
					watchedEpisodesNumber: 3
				},
				{
					number: 3,
					episodesNumber: 6
				}
			]
		});
		expect(mergedValues.seasons?.[0].watchedEpisodesNumber).toBeUndefined();
		expect(mergedValues.seasons?.[1].watchedEpisodesNumber).toBeUndefined();
	});

	test('rejects TV-show seasons with watched episodes above the total episodes', async() => {
		const mediaItem: TvShowInternal = {
			id: 'tv-show-2',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: 1,
					episodesNumber: 8,
					watchedEpisodesNumber: 9
				}
			]
		};

		await expect(tvShowFormValidationSchema.isValid(mediaItem)).resolves.toBe(false);
	});

	test('rejects TV-show seasons without a season number', async() => {
		const mediaItem: TvShowInternal = {
			id: 'tv-show-3',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: undefined as unknown as number,
					episodesNumber: 8,
					watchedEpisodesNumber: 7
				}
			]
		};

		await expect(tvShowFormValidationSchema.isValid(mediaItem)).resolves.toBe(false);
	});
});
