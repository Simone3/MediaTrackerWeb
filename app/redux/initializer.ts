import { configureStore } from '@reduxjs/toolkit';
import { loadPersistedReduxState, persistReduxState } from 'app/redux/persistence';
import { rootReducer } from 'app/redux/reducers/root';
import { State } from 'app/redux/state/state';
import { rootSaga } from 'app/redux/sagas/root';
import { Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

/**
 * Initializer for Redux and its middlewares
 * @returns the Redux store
 */
export const initializeRedux = (): Store => {
	const sagaMiddleware = createSagaMiddleware();
	const preloadedState = loadPersistedReduxState();

	const store = configureStore({
		reducer: rootReducer,
		preloadedState: preloadedState,
		middleware: (getDefaultMiddleware) => {
			return getDefaultMiddleware({
				// These should be false, refactor logic in the future to avoid triggering the serializable checks!
				serializableCheck: {
					ignoreActions: true,
					ignoreState: true
				}
			}).concat(sagaMiddleware);
		}
	});
	
	sagaMiddleware.run(rootSaga);
	store.subscribe(() => {
		persistReduxState(store.getState() as State);
	});

	return store;
};
