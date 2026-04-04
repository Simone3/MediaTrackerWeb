import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { persistReduxState, loadPersistedReduxState } from 'app/redux/persistence';
import { State } from 'app/redux/state/state';

const buildState = (): State => {
	const selectedCategory: CategoryInternal = {
		id: 'category-id',
		name: 'My Books',
		mediaType: 'BOOK',
		color: '#3f51b5'
	};
	const selectedGroup: GroupInternal = {
		id: 'group-id',
		name: 'Saga'
	};
	const selectedOwnPlatform: OwnPlatformInternal = {
		id: 'platform-id',
		name: 'Kindle',
		color: '#f5a623',
		icon: 'kindle'
	};
	const mediaItem: MediaItemInternal = {
		id: 'media-id',
		name: 'Dune',
		mediaType: 'BOOK',
		status: 'ACTIVE',
		importance: '300',
		group: selectedGroup,
		ownPlatform: selectedOwnPlatform,
		releaseDate: new Date('2024-02-01T00:00:00.000Z'),
		completedOn: [ new Date('2024-03-04T00:00:00.000Z') ]
	};

	return {
		error: {
			error: undefined
		},
		userGlobal: {
			status: 'AUTHENTICATED',
			user: {
				id: 'user-id',
				email: 'user@example.com'
			}
		},
		userOperations: {
			checkLoginStatus: 'IDLE',
			signupStatus: 'IDLE',
			loginStatus: 'IDLE',
			logoutStatus: 'IDLE'
		},
		categoryGlobal: {
			selectedCategory: selectedCategory
		},
		categoriesList: {
			categories: [ selectedCategory ],
			status: 'FETCHED',
			highlightedCategory: selectedCategory
		},
		categoryDetails: {
			category: selectedCategory,
			valid: true,
			dirty: true,
			saveStatus: 'SAVED'
		},
		mediaItemsList: {
			status: 'FETCHED',
			mode: 'SET_FILTERS',
			filter: {
				name: 'Dune'
			},
			sortBy: [
				{
					ascending: true
				}
			],
			searchTerm: undefined,
			viewGroup: selectedGroup,
			mediaItems: [ mediaItem ],
			highlightedMediaItem: mediaItem
		},
		mediaItemDetails: {
			mediaItem: mediaItem,
			formDraft: mediaItem,
			valid: true,
			dirty: true,
			catalogSearchResults: undefined,
			catalogDetails: undefined,
			catalogStatus: 'FETCHING',
			saveStatus: 'SAVING'
		},
		tvShowSeasonsList: {
			tvShowSeasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				}
			],
			completeHandlingTimestamp: new Date('2024-04-05T00:00:00.000Z'),
			highlightedTvShowSeason: {
				number: 1,
				episodesNumber: 10,
				watchedEpisodesNumber: 8
			}
		},
		tvShowSeasonDetails: {
			formMode: 'EXISTING',
			tvShowSeason: {
				number: 1,
				episodesNumber: 10,
				watchedEpisodesNumber: 8
			},
			valid: true,
			dirty: true,
			saveStatus: 'SAVED'
		},
		ownPlatformGlobal: {
			selectedOwnPlatform: selectedOwnPlatform
		},
		groupGlobal: {
			selectedGroup: selectedGroup
		},
		groupsList: {
			groups: [ selectedGroup ],
			status: 'FETCHED',
			highlightedGroup: selectedGroup
		},
		groupDetails: {
			group: selectedGroup,
			valid: true,
			dirty: true,
			saveStatus: 'SAVED'
		},
		ownPlatformsList: {
			ownPlatforms: [ selectedOwnPlatform ],
			status: 'FETCHED',
			highlightedOwnPlatform: selectedOwnPlatform
		},
		ownPlatformDetails: {
			ownPlatform: selectedOwnPlatform,
			valid: true,
			dirty: true,
			saveStatus: 'SAVED'
		}
	} as State;
};

describe('redux persistence', () => {
	beforeEach(() => {
		window.sessionStorage.clear();
	});

	test('rehydrates the selected navigation context and revives persisted dates', () => {
		persistReduxState(buildState());

		const restoredState = loadPersistedReduxState();

		expect(restoredState?.categoryGlobal?.selectedCategory?.id).toBe('category-id');
		expect(restoredState?.categoriesList?.status).toBe('REQUIRES_FETCH');
		expect(restoredState?.categoriesList?.highlightedCategory).toBeUndefined();
		expect(restoredState?.mediaItemsList?.status).toBe('REQUIRES_FETCH');
		expect(restoredState?.mediaItemsList?.mode).toBe('NORMAL');
		expect(restoredState?.mediaItemsList?.highlightedMediaItem).toBeUndefined();
		expect(restoredState?.groupsList?.status).toBe('REQUIRES_FETCH');
		expect(restoredState?.groupsList?.highlightedGroup).toBeUndefined();
		expect(restoredState?.ownPlatformsList?.status).toBe('REQUIRES_FETCH');
		expect(restoredState?.ownPlatformsList?.highlightedOwnPlatform).toBeUndefined();
		expect(restoredState?.mediaItemDetails?.saveStatus).toBe('IDLE');
		expect(restoredState?.mediaItemDetails?.catalogStatus).toBe('IDLE');
		expect(restoredState?.mediaItemDetails?.mediaItem?.releaseDate).toBeInstanceOf(Date);
		expect(restoredState?.mediaItemDetails?.mediaItem?.completedOn?.[0]).toBeInstanceOf(Date);
		expect((restoredState?.mediaItemDetails?.mediaItem?.releaseDate).toISOString()).toBe('2024-02-01T00:00:00.000Z');
		expect((restoredState?.mediaItemDetails?.mediaItem?.completedOn?.[0]).toISOString()).toBe('2024-03-04T00:00:00.000Z');
		expect(restoredState?.tvShowSeasonsList?.completeHandlingTimestamp).toBeInstanceOf(Date);
		expect((restoredState?.tvShowSeasonsList?.completeHandlingTimestamp).toISOString()).toBe('2024-04-05T00:00:00.000Z');
	});

	test('clears persisted state when the user is not authenticated', () => {
		persistReduxState(buildState());

		const unauthenticatedState = {
			...buildState(),
			userGlobal: {
				status: 'UNAUTHENTICATED',
				user: undefined
			}
		} as State;

		persistReduxState(unauthenticatedState);

		expect(loadPersistedReduxState()).toBeUndefined();
	});
});
