import { State } from 'app/redux/state/state';
import { mapStateForPersistence } from 'app/redux/reducers/root';

const STORAGE_KEY = 'media-tracker-redux-state';

const canUseSessionStorage = (): boolean => {
	return typeof window !== 'undefined' && Boolean(window.sessionStorage);
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
		revivedState = JSON.parse(serializedState) as State;
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
