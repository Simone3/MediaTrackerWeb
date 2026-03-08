import { TvShowCatalogController, TvShowController } from 'app/controllers/core/entities/media-items/tv-show';
import { MediaItemMockedCatalogController, MediaItemMockedController } from 'app/controllers/impl-mocks/entities/media-items/media-item';
import { CatalogTvShowInternal, SearchTvShowCatalogResultInternal, TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Mocked implementation of the TvShowController that contains an in-memory list of TV shows
 * @see TvShowController
 */
export class TvShowMockedController extends MediaItemMockedController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> implements TvShowController {

	protected readonly mediaItems: {[user: string]: {[category: string]: TvShowInternal[]}} = {
		test: {
			3: [{
				id: '1',
				mediaType: 'TV_SHOW',
				status: 'ACTIVE',
				name: 'My First TV Show',
				importance: '400',
				seasons: [{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 10
				}, {
					number: 2,
					episodesNumber: 12,
					watchedEpisodesNumber: 10
				}, {
					number: 3,
					episodesNumber: 8
				}]
			}, {
				id: '2',
				mediaType: 'TV_SHOW',
				status: 'ACTIVE',
				name: 'My Second TV Show',
				importance: '400',
				seasons: [{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 10
				}, {
					number: 2,
					episodesNumber: 12,
					watchedEpisodesNumber: 12
				}, {
					number: 3,
					episodesNumber: 8,
					watchedEpisodesNumber: 8
				}]
			}, {
				id: '3',
				mediaType: 'TV_SHOW',
				status: 'ACTIVE',
				name: 'My Third TV Show',
				importance: '100',
				averageEpisodeRuntimeMinutes: 50
			}, {
				id: '4',
				mediaType: 'TV_SHOW',
				status: 'NEW',
				name: 'My Fourth TV Show',
				importance: '300',
				active: true
			}, {
				id: '5',
				mediaType: 'TV_SHOW',
				status: 'NEW',
				name: 'My Fifth TV Show',
				importance: '200'
			}]
		}
	};
}

/**
 * Mocked implementation of the TvShowCatalogController that contains an in-memory list of TV shows
 * @see TvShowCatalogController
 */
export class TvShowMockedCatalogController extends MediaItemMockedCatalogController<SearchTvShowCatalogResultInternal, CatalogTvShowInternal> implements TvShowCatalogController {

	protected readonly catalogList: SearchTvShowCatalogResultInternal[] = [{
		catalogId: '1',
		name: 'Catalog TvShow 1',
		releaseDate: new Date(2010, 10, 10)
	}, {
		catalogId: '2',
		name: 'Catalog TvShow 2'
	}];

	protected readonly catalogDetails: {[catalogId: string]: CatalogTvShowInternal} = {
		1: {
			catalogId: '1',
			catalogLoadId: '',
			name: 'Catalog TvShow 1',
			description: 'Some description for catalog TV show 1',
			creators: [ 'Person 1', 'Person 2' ],
			averageEpisodeRuntimeMinutes: 100,
			genres: [ 'One', 'Two' ],
			imageUrl: 'http://image.tmdb.org/t/p/w780/xq6hXdBpDPIXWjtmvbFmtLvBFJt.jpg',
			releaseDate: new Date(2010, 10, 10),
			seasons: [{
				number: 1,
				episodesNumber: 10
			}, {
				number: 2,
				episodesNumber: 12
			}, {
				number: 3,
				episodesNumber: 8
			}]
		},
		2: {
			catalogId: '2',
			catalogLoadId: '',
			name: 'Catalog Test 2',
			description: 'Some description for catalog test 2'
		}
	};
}
