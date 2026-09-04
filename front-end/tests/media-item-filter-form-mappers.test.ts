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

	// The form value must depend on the filter alone: a mapper that resolved the ID against the loaded groups would return a different value
	// once the fetch lands, and Formik's enableReinitialize would reset the form under the user
	test('maps a specific group and own platform selection without needing the loaded lists', () => {
		const formValues = bookFilterFormMapper.toFormValues({
			groups: {
				groupIds: [ 'group-id' ]
			},
			ownPlatforms: {
				ownPlatformIds: [ 'own-platform-id' ]
			}
		}, []);

		expect(formValues.group).toBe('GROUP_ID_group-id');
		expect(formValues.ownPlatform).toBe('OWN_PLATFORM_ID_own-platform-id');
		expect(bookFilterFormMapper.toFilterModel(formValues)).toEqual(expect.objectContaining({
			groups: {
				groupIds: [ 'group-id' ]
			},
			ownPlatforms: {
				ownPlatformIds: [ 'own-platform-id' ]
			}
		}));
	});

	test('gives a specific group and own platform selection precedence over the generic options', () => {
		const formValues = bookFilterFormMapper.toFormValues({
			groups: {
				anyGroup: true,
				groupIds: [ 'group-id' ]
			},
			ownPlatforms: {
				noOwnPlatform: true,
				ownPlatformIds: [ 'own-platform-id' ]
			}
		}, []);

		expect(formValues.group).toBe('GROUP_ID_group-id');
		expect(formValues.ownPlatform).toBe('OWN_PLATFORM_ID_own-platform-id');
	});

	test('maps the generic group and own platform options', () => {
		expect(bookFilterFormMapper.toFormValues({
			groups: {
				anyGroup: true
			},
			ownPlatforms: {
				noOwnPlatform: true
			}
		}, [])).toEqual(expect.objectContaining({
			group: 'ANY',
			ownPlatform: 'NONE'
		}));

		expect(bookFilterFormMapper.toFilterModel({
			...defaultFormValues,
			group: 'ANY',
			ownPlatform: 'NONE'
		})).toEqual(expect.objectContaining({
			groups: {
				anyGroup: true
			},
			ownPlatforms: {
				noOwnPlatform: true
			}
		}));
	});
});
