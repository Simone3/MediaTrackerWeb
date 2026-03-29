import { State, mapStateForPersistence } from 'app/redux/state/state';

const STORAGE_KEY = 'media-tracker-redux-state';
const DATE_FIELD_KEYS = new Set([ 'releaseDate', 'nextEpisodeAirDate', 'completeHandlingTimestamp' ]);
const DATE_ARRAY_FIELD_KEYS = new Set([ 'completedOn' ]);

const canUseSessionStorage = (): boolean => {
	return typeof window !== 'undefined' && Boolean(window.sessionStorage);
};

const reviveDateArrayEntry = (entry: unknown): unknown => {
	const revivedDate = typeof entry === 'string' ? new Date(entry) : undefined;
	return !revivedDate || Number.isNaN(revivedDate.getTime()) ? entry : revivedDate;
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

const clearPersistedValue = (): void => {
	if(!canUseSessionStorage()) {
		return;
	}

	try {
		window.sessionStorage.removeItem(STORAGE_KEY);
	}
	catch(error) {
		console.log(error);
	}
};

export const loadPersistedReduxState = (): State | undefined => {
	if(!canUseSessionStorage()) {
		return undefined;
	}

	let serializedState: string | undefined;
	try {
		serializedState = window.sessionStorage.getItem(STORAGE_KEY);
	}
	catch(error) {
		console.log(error);
		return undefined;
	}
	if(!serializedState) {
		return undefined;
	}

	let revivedState: State;
	try {
		revivedState = revivePersistedValue(JSON.parse(serializedState)) as State;
	}
	catch(error) {
		console.log(error);
		clearPersistedValue();
		return undefined;
	}

	if(revivedState.userGlobal.status !== 'REQUIRES_CHECK') {
		clearPersistedValue();
		return undefined;
	}

	return revivedState;
};

export const persistReduxState = (state: State): void => {
	if(!canUseSessionStorage()) {
		return;
	}

	if(state.userGlobal.status !== 'AUTHENTICATED') {
		clearPersistedValue();
		return;
	}

	try {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mapStateForPersistence(state)));
	}
	catch(error) {
		console.log(error);
	}
};
