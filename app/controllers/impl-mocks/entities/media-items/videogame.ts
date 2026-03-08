import { VideogameCatalogController, VideogameController } from 'app/controllers/core/entities/media-items/videogame';
import { MediaItemMockedCatalogController, MediaItemMockedController } from 'app/controllers/impl-mocks/entities/media-items/media-item';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * Mocked implementation of the VideogameController that contains an in-memory list of videogames
 * @see VideogameController
 */
export class VideogameMockedController extends MediaItemMockedController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal> implements VideogameController {

	protected readonly mediaItems: {[user: string]: {[category: string]: VideogameInternal[]}} = {
		test: {
			4: [{
				id: '1',
				mediaType: 'VIDEOGAME',
				status: 'NEW',
				name: 'My First Videogame',
				importance: '400'
			}, {
				id: '2',
				mediaType: 'VIDEOGAME',
				status: 'NEW',
				name: 'My Second Videogame',
				importance: '100',
				averageLengthHours: 20
			}, {
				id: '3',
				mediaType: 'VIDEOGAME',
				status: 'ACTIVE',
				name: 'My Third Videogame',
				importance: '300',
				active: true
			}, {
				id: '4',
				mediaType: 'VIDEOGAME',
				status: 'NEW',
				name: 'My Fourth Videogame',
				importance: '200'
			}]
		}
	};
}

/**
 * Mocked implementation of the VideogameCatalogController that contains an in-memory list of videogames
 * @see VideogameCatalogController
 */
export class VideogameMockedCatalogController extends MediaItemMockedCatalogController<SearchVideogameCatalogResultInternal, CatalogVideogameInternal> implements VideogameCatalogController {

}
