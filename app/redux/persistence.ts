import { State } from 'app/redux/state/state';

const STORAGE_KEY = 'media-tracker-redux-state';
const DATE_FIELD_KEYS = new Set([ 'releaseDate', 'nextEpisodeAirDate', 'completeHandlingTimestamp' ]);
const DATE_ARRAY_FIELD_KEYS = new Set([ 'completedOn' ]);

type PersistedReduxState = Partial<State>;

const canUseSessionStorage = (): boolean => {
	return typeof window !== 'undefined' && Boolean(window.sessionStorage);
};

const reviveDateArrayEntry = (entry: unknown): unknown => {
	const revivedDate = typeof entry === 'string' ? new Date(entry) : undefined;
	return !revivedDate || Number.isNaN(revivedDate.getTime()) ? entry : revivedDate;
};

const ignoreStorageError = (error: unknown): void => {
	if(error instanceof Error) {
		error.toString();
	}
};

const readPersistedValue = (): string | undefined => {
	if(!canUseSessionStorage()) {
		return undefined;
	}

	try {
		return window.sessionStorage.getItem(STORAGE_KEY) || undefined;
	}
	catch(error) {
		ignoreStorageError(error);
		return undefined;
	}
};

const clearPersistedValue = (): void => {
	if(!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.removeItem(STORAGE_KEY);
	}
	catch(error) {
		// Ignore storage cleanup failures so navigation can continue.
		ignoreStorageError(error);
	}
};

const revivePersistedValue = (value: unknown, key?: string): unknown => {
	if(Array.isArray(value)) {
		if(key && DATE_ARRAY_FIELD_KEYS.has(key)) {
			return value.map(reviveDateArrayEntry);
		}

		return value.map((entry: unknown): unknown => {
			return revivePersistedValue(entry);
		});
	}

	if(typeof value === 'string' && key && DATE_FIELD_KEYS.has(key)) {
		const revivedDate = new Date(value);
		return Number.isNaN(revivedDate.getTime()) ? value : revivedDate;
	}

	if(!value || typeof value !== 'object') {
		return value;
	}

	const result: Record<string, unknown> = {};
	for(const [ childKey, childValue ] of Object.entries(value)) {
		result[childKey] = revivePersistedValue(childValue, childKey);
	}
	return result;
};

const buildPersistedState = (state: State): PersistedReduxState => {
	return {
		categoryGlobal: state.categoryGlobal,
		categoriesList: {
			...state.categoriesList,
			status: 'REQUIRES_FETCH',
			highlightedCategory: undefined
		},
		categoryDetails: {
			...state.categoryDetails,
			saveStatus: 'IDLE'
		},
		mediaItemsList: {
			...state.mediaItemsList,
			status: 'REQUIRES_FETCH',
			mode: state.mediaItemsList.mode === 'SET_FILTERS' ? 'NORMAL' : state.mediaItemsList.mode,
			highlightedMediaItem: undefined
		},
		mediaItemDetails: {
			...state.mediaItemDetails,
			saveStatus: 'IDLE',
			catalogStatus: 'IDLE'
		},
		tvShowSeasonsList: {
			...state.tvShowSeasonsList,
			highlightedTvShowSeason: undefined
		},
		tvShowSeasonDetails: {
			...state.tvShowSeasonDetails,
			saveStatus: 'IDLE'
		},
		groupGlobal: state.groupGlobal,
		groupsList: {
			...state.groupsList,
			status: 'REQUIRES_FETCH',
			highlightedGroup: undefined
		},
		groupDetails: {
			...state.groupDetails,
			saveStatus: 'IDLE'
		},
		ownPlatformGlobal: state.ownPlatformGlobal,
		ownPlatformsList: {
			...state.ownPlatformsList,
			status: 'REQUIRES_FETCH',
			highlightedOwnPlatform: undefined
		},
		ownPlatformDetails: {
			...state.ownPlatformDetails,
			saveStatus: 'IDLE'
		}
	};
};

export const loadPersistedReduxState = (): PersistedReduxState | undefined => {
	const serializedState = readPersistedValue();
	if(!serializedState) {
		return undefined;
	}

	try {
		return revivePersistedValue(JSON.parse(serializedState)) as PersistedReduxState;
	}
	catch(error) {
		clearPersistedValue();
		ignoreStorageError(error);
		return undefined;
	}
};

export const persistReduxState = (state: State): void => {
	if(state.userGlobal.status !== 'AUTHENTICATED') {
		clearPersistedValue();
		return;
	}

	if(!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(buildPersistedState(state)));
	}
	catch(error) {
		// Ignore storage write failures so the current interaction is never blocked.
		ignoreStorageError(error);
	}
};
