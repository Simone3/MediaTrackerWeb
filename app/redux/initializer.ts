import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from 'app/redux/reducers/root';
import { rootSaga } from 'app/redux/sagas/root';
import { Store } from 'redux';
import createSagaMiddleware from 'redux-saga';

/**
 * Initializer for Redux and its middlewares
 * @returns the Redux store
 */
export const initializeRedux = (): Store => {

	const sagaMiddleware = createSagaMiddleware();

	const store = configureStore({
		reducer: rootReducer,
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

	return store;
};
