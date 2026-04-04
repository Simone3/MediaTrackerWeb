import { bookFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/book';
import { movieFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/movie';
import { tvShowFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';
import { videogameFilterFormMapper } from 'app/components/presentational/media-item/list/filter-form/data/videogame';
import { MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';

jest.mock('app/controllers/main/entities/media-items-definitions/book', () => {
	return {
		bookDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});
jest.mock('app/controllers/main/entities/media-items-definitions/movie', () => {
	return {
		movieDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});
jest.mock('app/controllers/main/entities/media-items-definitions/tv-show', () => {
	return {
		tvShowDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});
jest.mock('app/controllers/main/entities/media-items-definitions/videogame', () => {
	return {
		videogameDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});

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
