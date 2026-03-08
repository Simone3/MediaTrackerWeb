import { MovieCatalogController, MovieController } from 'app/controllers/core/entities/media-items/movie';
import { MediaItemMockedCatalogController, MediaItemMockedController } from 'app/controllers/impl-mocks/entities/media-items/media-item';
import { CatalogMovieInternal, MovieFilterInternal, MovieInternal, MovieSortByInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Mocked implementation of the MovieController that contains an in-memory list of movies
 * @see MovieController
 */
export class MovieMockedController extends MediaItemMockedController<MovieInternal, MovieSortByInternal, MovieFilterInternal> implements MovieController {

	protected readonly mediaItems: {[user: string]: {[category: string]: MovieInternal[]}} = {
		test: {
			2: [{
				id: '1',
				mediaType: 'MOVIE',
				status: 'NEW',
				name: 'My First Movie',
				importance: '400',
				durationMinutes: 123,
				directors: [ 'Some One' ],
				genres: [ 'Genre 1', 'Genre 2' ],
				releaseDate: new Date('2010-01-01'),
				group: {
					id: '1',
					name: 'My Group'
				},
				orderInGroup: 3,
				imageUrl: 'http://image.tmdb.org/t/p/w780/oQYpa1TKJRR58IrFGhppi9vL7PC.jpg'
			}, {
				id: '2',
				mediaType: 'MOVIE',
				status: 'ACTIVE',
				name: 'My Second Movie',
				importance: '100',
				durationMinutes: 89,
				ownPlatform: {
					id: '1',
					name: 'Netflix',
					color: '#f25a5a',
					icon: 'netflix'
				},
				active: true
			}, {
				id: '3',
				mediaType: 'MOVIE',
				status: 'UPCOMING',
				name: 'My Third Movie',
				importance: '300',
				releaseDate: new Date('2050-01-01')
			}, {
				id: '4',
				mediaType: 'MOVIE',
				status: 'COMPLETE',
				name: 'My Fourth Movie',
				importance: '200',
				completedOn: [ new Date('2000-01-01'), new Date('2010-01-01') ],
				ownPlatform: {
					id: '2',
					name: 'Hulu',
					color: '#74eb74',
					icon: 'hulu'
				}
			}, {
				id: '5',
				mediaType: 'MOVIE',
				status: 'REDO',
				name: 'My Fifth Movie',
				importance: '200',
				completedOn: [ new Date('2010-01-01') ],
				markedAsRedo: true
			}, {
				id: '6',
				mediaType: 'MOVIE',
				status: 'NEW',
				name: 'My Sixth Movie With a Very Very Very Very Very Very Very Very Very Very Very Very Long Title',
				importance: '200',
				genres: [ 'Genre', 'Genre', 'Genre', 'Genre', 'Genre', 'Genre', 'Genre', 'Genre', 'Genre', 'Genre', 'Genre' ],
				directors: [ 'Some One', 'Some One', 'Some One', 'Some One', 'Some One', 'Some One', 'Some One', 'Some One', 'Some One' ]
			}]
		}
	};
}

/**
 * Mocked implementation of the MovieCatalogController that contains an in-memory list of movies
 * @see MovieCatalogController
 */
export class MovieMockedCatalogController extends MediaItemMockedCatalogController<SearchMovieCatalogResultInternal, CatalogMovieInternal> implements MovieCatalogController {

	protected readonly catalogList: SearchMovieCatalogResultInternal[] = [{
		catalogId: '1',
		name: 'Catalog Movie 1',
		releaseDate: new Date(2010, 10, 10)
	}, {
		catalogId: '2',
		name: 'Catalog Test 1'
	}, {
		catalogId: '3',
		name: 'Catalog Test 2',
		releaseDate: new Date(2011, 11, 11)
	}, {
		catalogId: '4',
		name: 'Some Other Movie',
		releaseDate: new Date(2012, 12, 12)
	}];

	protected readonly catalogDetails: {[catalogId: string]: CatalogMovieInternal} = {
		1: {
			catalogId: '1',
			catalogLoadId: '',
			name: 'Catalog Movie 1',
			description: 'Some description for catalog movie 1',
			directors: [ 'Person 1', 'Person 2' ],
			durationMinutes: 100,
			genres: [ 'One', 'Two' ],
			imageUrl: 'http://image.tmdb.org/t/p/w780/xq6hXdBpDPIXWjtmvbFmtLvBFJt.jpg',
			releaseDate: new Date(2010, 10, 10)
		},
		2: {
			catalogId: '2',
			catalogLoadId: '',
			name: 'Catalog Test 1',
			description: 'Some description for catalog test 1'
		},
		3: {
			catalogId: '3',
			catalogLoadId: '',
			name: 'Catalog Test 2',
			directors: [ 'Person 3', 'Person 4' ],
			durationMinutes: 100,
			genres: [ 'One', 'Two' ],
			releaseDate: new Date(2011, 11, 11)
		},
		4: {
			catalogId: '4',
			catalogLoadId: '',
			name: 'Some Other Movie',
			description: 'Some description for some other movie',
			durationMinutes: 200,
			imageUrl: 'http://image.tmdb.org/t/p/w780/oQYpa1TKJRR58IrFGhppi9vL7PC.jpg',
			releaseDate: new Date(2012, 12, 12)
		}
	};
}
