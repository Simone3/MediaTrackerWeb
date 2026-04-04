import { State, mapStateForPersistence } from 'app/redux/state/state';

const STORAGE_KEY = 'media-tracker-redux-state';

const canUseSessionStorage = (): boolean => {
	return typeof window !== 'undefined' && Boolean(window.sessionStorage);
};

const encodeDates = (value: unknown): unknown => {
	if (value instanceof Date) {
		return { _type: 'Date', _value: value.toISOString() };
	}

	if (Array.isArray(value)) {
		return value.map(encodeDates);
	}

	if (value && typeof value === 'object') {
		return Object.fromEntries(
			Object.entries(value).map(([ k, v ]) => {
				return [ k, encodeDates(v) ];
			})
		);
	}

	return value;
};

const decodeDates = (value: unknown): unknown => {
	if (Array.isArray(value)) {
		return value.map(decodeDates);
	}

	if (value && typeof value === 'object') {
		if ('_type' in value && value._type === 'Date' && '_value' in value) {
			return new Date(value._value as string);
		}
		return Object.fromEntries(
			Object.entries(value).map(([ k, v ]) => {
				return [ k, decodeDates(v) ];
			})
		);
	}

	return value;
};

const clearPersistedValue = (): void => {
	if (!canUseSessionStorage()) {
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
	if (!canUseSessionStorage()) {
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
	if (!serializedState) {
		return undefined;
	}

	let revivedState: State;
	try {
		revivedState = decodeDates(JSON.parse(serializedState)) as State;
	}
	catch(error) {
		console.log(error);
		clearPersistedValue();
		return undefined;
	}

	if (revivedState.userGlobal.status !== 'REQUIRES_CHECK') {
		clearPersistedValue();
		return undefined;
	}

	return revivedState;
};

export const persistReduxState = (state: State): void => {
	if (!canUseSessionStorage()) {
		return;
	}

	if (state.userGlobal.status !== 'AUTHENTICATED') {
		clearPersistedValue();
		return;
	}

	try {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(encodeDates(mapStateForPersistence(state))));
	}
	catch(error) {
		console.log(error);
	}
};
