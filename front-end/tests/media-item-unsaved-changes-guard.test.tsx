import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { Action, Store, createStore } from 'redux';
import { MediaItemUnsavedChangesGuardContainer } from 'app/components/containers/media-item/details/unsaved-changes-guard';
import { MediaNavigator } from 'app/components/containers/navigation/media-navigator';
import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { SET_MEDIA_ITEM_FORM_DRAFT } from 'app/redux/actions/media-item/const';
import { CategoryGlobalState } from 'app/redux/state/category';
import { GroupGlobalState, GroupsListState, groupGlobalStateInitialValue, groupsListStateInitialValue } from 'app/redux/state/group';
import { MediaItemDetailsState, mediaItemDetailsStateInitialValue } from 'app/redux/state/media-item';
import { i18n } from 'app/utilities/i18n';

type GuardTestState = {
	categoryGlobal: CategoryGlobalState;
	mediaItemDetails: MediaItemDetailsState;
	groupGlobal: GroupGlobalState;
	groupsList: GroupsListState;
};

const createGuardStore = (overrides: Partial<MediaItemDetailsState> = {}) => {
	const dispatchedActions: Action[] = [];
	const initialState: GuardTestState = {
		// The media item form flow is always reached from inside a category, which is what the screen context guard checks
		categoryGlobal: {
			selectedCategory: DEFAULT_CATEGORY
		},
		mediaItemDetails: {
			...mediaItemDetailsStateInitialValue,
			mediaItem: DEFAULT_BOOK,
			...overrides
		},
		groupGlobal: groupGlobalStateInitialValue,
		groupsList: {
			...groupsListStateInitialValue,
			status: 'FETCHED'
		}
	};
	const store: Store<GuardTestState> = createStore((state: GuardTestState = initialState, action: Action): GuardTestState => {
		dispatchedActions.push(action);
		return state;
	});

	return {
		dispatchedActions,
		store
	};
};

const GuardLocationComponent = () => {
	const location = useLocation();

	return (
		<div data-testid='guard-location'>{location.pathname}</div>
	);
};

const renderSubScreen = (overrides: Partial<MediaItemDetailsState> = {}) => {
	const {
		dispatchedActions,
		store
	} = createGuardStore(overrides);

	render(
		<Provider store={store}>
			<BrowserRouter>
				<nav>
					<Link to='/media'>Home</Link>
				</nav>
				<GuardLocationComponent />
				<Routes>
					<Route
						path='/media/groups'
						element={
							<MediaItemUnsavedChangesGuardContainer interceptBrowserBack={false}>
								<div>Groups page</div>
							</MediaItemUnsavedChangesGuardContainer>
						}
					/>
					<Route path='/media' element={<div>Categories page</div>} />
				</Routes>
			</BrowserRouter>
		</Provider>
	);

	return {
		dispatchedActions
	};
};

describe('MediaItemUnsavedChangesGuardContainer', () => {
	beforeEach(() => {
		window.history.pushState({}, '', '/media/groups');
	});

	test('blocks in-app navigation from a media item form sub-screen while the form draft is unsaved', async() => {
		const {
			dispatchedActions
		} = renderSubScreen({
			dirty: true,
			formDraft: DEFAULT_BOOK
		});

		const user = userEvent.setup();
		await user.click(screen.getByRole('link', { name: 'Home' }));

		expect(screen.getByRole('dialog')).toHaveTextContent(i18n.t('common.alert.form.exit.message'));
		expect(screen.getByTestId('guard-location')).toHaveTextContent('/media/groups');

		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: SET_MEDIA_ITEM_FORM_DRAFT,
			mediaItem: undefined
		}));

		await waitFor(() => {
			expect(screen.getByText('Categories page')).toBeInTheDocument();
		});
	});

	test('guards the groups selection route against leaving the app shell with an unsaved media item draft', async() => {
		const {
			store
		} = createGuardStore({
			dirty: true,
			formDraft: DEFAULT_BOOK
		});

		render(
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route path='/media/*' element={<MediaNavigator />} />
						<Route path='/settings' element={<div>Settings page</div>} />
					</Routes>
				</BrowserRouter>
			</Provider>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('link', { name: i18n.t('common.drawer.home') }));

		expect(screen.getByRole('dialog')).toHaveTextContent(i18n.t('common.alert.form.exit.message'));
		expect(screen.getByText(i18n.t('group.list.title'))).toBeInTheDocument();
	});

	test('allows in-app navigation from a media item form sub-screen when the form is not dirty', async() => {
		renderSubScreen({
			formDraft: DEFAULT_BOOK
		});

		const user = userEvent.setup();
		await user.click(screen.getByRole('link', { name: 'Home' }));

		await waitFor(() => {
			expect(screen.getByText('Categories page')).toBeInTheDocument();
		});

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});
