jest.mock('app/controllers/core/entities/media-items/book', () => {
	return {
		bookDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
jest.mock('app/controllers/core/entities/media-items/movie', () => {
	return {
		movieDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
jest.mock('app/controllers/core/entities/media-items/tv-show', () => {
	return {
		tvShowDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
jest.mock('app/controllers/core/entities/media-items/videogame', () => {
	return {
		videogameDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
import { bookFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/book';
import { movieFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/movie';
import { tvShowFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';
import { videogameFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/videogame';
import { MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';

const defaultFormValues: MediaItemFilterFormValues = {
	status: 'ALL',
	importanceLevel: 'NONE',
	group: 'ALL',
	ownPlatform: 'ALL',
	sortBy: 'DEFAULT'
};

describe('media item filter form mappers', () => {
	test.each([
		[ 'BOOK', bookFilterFormMapper ],
		[ 'MOVIE', movieFilterFormMapper ],
		[ 'TV_SHOW', tvShowFilterFormMapper ],
		[ 'VIDEOGAME', videogameFilterFormMapper ]
	])('maps DEFAULT sort for %s', (_mediaType, mapper) => {
		expect(mapper.toSortByModel(defaultFormValues)).toEqual([{
			field: 'ACTIVE',
			ascending: false
		}, {
			field: 'IMPORTANCE',
			ascending: false
		}, {
			field: 'RELEASE_DATE',
			ascending: true
		}]);
	});
});
