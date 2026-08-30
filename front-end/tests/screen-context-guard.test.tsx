import { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Action, Store, createStore } from 'redux';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { ScreenContextGuardContainer, hasScreenRequiredContext } from 'app/components/containers/navigation/screen-context-guard';
import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { DEFAULT_GROUP } from 'app/data/models/internal/group';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { SET_ERROR } from 'app/redux/actions/error/const';
import { categoriesListStateInitialValue, categoryDetailsStateInitialValue, categoryGlobalStateInitialValue } from 'app/redux/state/category';
import { groupDetailsStateInitialValue } from 'app/redux/state/group';
import { mediaItemDetailsStateInitialValue } from 'app/redux/state/media-item';
import { ownPlatformDetailsStateInitialValue } from 'app/redux/state/own-platform';
import { State } from 'app/redux/state/state';
import { tvShowSeasonDetailsStateInitialValue } from 'app/redux/state/tv-show-season';
import { i18n } from 'app/utilities/i18n';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

const emptyState = {
	categoryGlobal: categoryGlobalStateInitialValue,
	categoriesList: categoriesListStateInitialValue,
	categoryDetails: categoryDetailsStateInitialValue,
	mediaItemDetails: mediaItemDetailsStateInitialValue,
	groupDetails: groupDetailsStateInitialValue,
	ownPlatformDetails: ownPlatformDetailsStateInitialValue,
	tvShowSeasonDetails: tvShowSeasonDetailsStateInitialValue
} as State;

const stateWithCategory = {
	...emptyState,
	categoryGlobal: {
		selectedCategory: DEFAULT_CATEGORY
	}
} as State;

const renderGuardedScreen = (state: State, children: ReactNode) => {
	const dispatchedActions: Action[] = [];
	const store: Store = createStore((currentState: State = state, action: Action): State => {
		dispatchedActions.push(action);
		return currentState;
	});

	render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[ screenToPath(AppScreens.MediaItemsList) ]}>
				<Routes>
					<Route
						path={screenToPath(AppScreens.MediaItemsList)}
						element={
							<ScreenContextGuardContainer screen={AppScreens.MediaItemsList}>
								{children}
							</ScreenContextGuardContainer>
						} />
					<Route path={screenToPath(AppScreens.CategoriesList)} element={<div>Categories screen</div>} />
				</Routes>
			</MemoryRouter>
		</Provider>
	);

	return dispatchedActions;
};

describe('hasScreenRequiredContext', () => {
	test('always allows a screen that requires no global context', () => {
		expect(hasScreenRequiredContext(emptyState, AppScreens.CategoriesList)).toBe(true);
	});

	test('requires the selected category for the category-scoped screens', () => {
		expect(hasScreenRequiredContext(emptyState, AppScreens.MediaItemsList)).toBe(false);
		expect(hasScreenRequiredContext(emptyState, AppScreens.GroupsList)).toBe(false);
		expect(hasScreenRequiredContext(emptyState, AppScreens.OwnPlatformsList)).toBe(false);

		expect(hasScreenRequiredContext(stateWithCategory, AppScreens.MediaItemsList)).toBe(true);
		expect(hasScreenRequiredContext(stateWithCategory, AppScreens.GroupsList)).toBe(true);
		expect(hasScreenRequiredContext(stateWithCategory, AppScreens.OwnPlatformsList)).toBe(true);
	});

	test('requires the loaded entity for the details screens, on top of the category', () => {
		const stateWithGroup = {
			...stateWithCategory,
			groupDetails: {
				...groupDetailsStateInitialValue,
				group: DEFAULT_GROUP
			}
		} as State;

		expect(hasScreenRequiredContext(stateWithCategory, AppScreens.GroupDetails)).toBe(false);
		expect(hasScreenRequiredContext(stateWithGroup, AppScreens.GroupDetails)).toBe(true);
		expect(hasScreenRequiredContext(emptyState, AppScreens.CategoryDetails)).toBe(false);
	});

	test('requires the open media item form for the TV show seasons screens', () => {
		const stateWithMediaItem = {
			...emptyState,
			mediaItemDetails: {
				...mediaItemDetailsStateInitialValue,
				mediaItem: DEFAULT_BOOK
			}
		} as State;

		expect(hasScreenRequiredContext(emptyState, AppScreens.TvShowSeasonsList)).toBe(false);
		expect(hasScreenRequiredContext(stateWithMediaItem, AppScreens.TvShowSeasonsList)).toBe(true);
		expect(hasScreenRequiredContext(stateWithMediaItem, AppScreens.TvShowSeasonDetails)).toBe(false);
	});
});

describe('ScreenContextGuardContainer', () => {
	test('renders the screen when the required context is there', () => {
		const dispatchedActions = renderGuardedScreen(stateWithCategory, <div>Media items screen</div>);

		expect(screen.getByText('Media items screen')).toBeInTheDocument();
		expect(dispatchedActions).not.toContainEqual(expect.objectContaining({
			type: SET_ERROR
		}));
	});

	test('redirects to the categories list when the required context is missing', () => {
		renderGuardedScreen(emptyState, <div>Media items screen</div>);

		expect(screen.getByText('Categories screen')).toBeInTheDocument();
		expect(screen.queryByText('Media items screen')).not.toBeInTheDocument();
	});

	test('guards the media routes of the navigator, not just the screens it is wrapped around by hand', () => {
		const dispatchedActions: Action[] = [];
		const store: Store = createStore((currentState: State = emptyState, action: Action): State => {
			dispatchedActions.push(action);
			return currentState;
		});

		render(
			<Provider store={store}>
				<MemoryRouter initialEntries={[ screenToPath(AppScreens.MediaItemsList) ]}>
					<Routes>
						<Route path='/media/*' element={<MediaNavigator />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		);

		expect(screen.getByText(i18n.t('category.list.title'))).toBeInTheDocument();
		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: SET_ERROR,
			error: AppError.SCREEN_CONTEXT_MISSING
		}));
	});

	test('explains the redirect with the global error toast', () => {
		const dispatchedActions = renderGuardedScreen(emptyState, <div>Media items screen</div>);

		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: SET_ERROR,
			error: AppError.SCREEN_CONTEXT_MISSING
		}));
	});
});
