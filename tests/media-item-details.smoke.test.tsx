import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Action, Store, createStore } from 'redux';
import { config } from 'app/config/config';
import { MediaItemDetailsScreenContainer } from 'app/components/containers/media-item/details/screen';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { DEFAULT_MOVIE } from 'app/data/models/internal/media-items/movie';
import { DEFAULT_VIDEOGAME } from 'app/data/models/internal/media-items/videogame';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { SAVE_MEDIA_ITEM, SET_MEDIA_ITEM_FORM_DRAFT, SET_MEDIA_ITEM_FORM_STATUS } from 'app/redux/actions/media-item/const';
import { START_TV_SHOW_SEASONS_HANDLING } from 'app/redux/actions/tv-show-season/const';
import { GroupGlobalState, GroupsListState, groupGlobalStateInitialValue, groupsListStateInitialValue } from 'app/redux/state/group';
import { MediaItemDetailsState, mediaItemDetailsStateInitialValue } from 'app/redux/state/media-item';
import { OwnPlatformGlobalState, OwnPlatformsListState, ownPlatformGlobalStateInitialValue, ownPlatformsListStateInitialValue } from 'app/redux/state/own-platform';
import { TvShowSeasonsListState, tvShowSeasonsListStateInitialValue } from 'app/redux/state/tv-show-season';
import { i18n } from 'app/utilities/i18n';

type DetailsScreenTestState = {
	mediaItemDetails: MediaItemDetailsState;
	groupGlobal: GroupGlobalState;
	groupsList: GroupsListState;
	ownPlatformGlobal: OwnPlatformGlobalState;
	ownPlatformsList: OwnPlatformsListState;
	tvShowSeasonsList: TvShowSeasonsListState;
};

type DetailsScreenStateOverrides = {
	mediaItemDetails?: Partial<MediaItemDetailsState>;
	groupGlobal?: Partial<GroupGlobalState>;
	groupsList?: Partial<GroupsListState>;
	ownPlatformGlobal?: Partial<OwnPlatformGlobalState>;
	ownPlatformsList?: Partial<OwnPlatformsListState>;
	tvShowSeasonsList?: Partial<TvShowSeasonsListState>;
};

type DetailsScreenAction = Action & {
	confirmSameName?: boolean;
	dirty?: boolean;
	mediaItem?: MediaItemInternal;
	tvShowSeasons?: TvShowSeasonInternal[];
	valid?: boolean;
};

const createScreenElement = (store: Store<DetailsScreenTestState>): React.ReactElement => {
	return (
		<Provider store={store}>
			<MemoryRouter>
				<MediaItemDetailsScreenContainer/>
			</MemoryRouter>
		</Provider>
	);
};

const createDetailsStore = (overrides: DetailsScreenStateOverrides = {}) => {
	const initialState: DetailsScreenTestState = {
		mediaItemDetails: {
			...mediaItemDetailsStateInitialValue,
			mediaItem: DEFAULT_BOOK,
			...overrides.mediaItemDetails
		},
		groupGlobal: {
			...groupGlobalStateInitialValue,
			...overrides.groupGlobal
		},
		groupsList: {
			...groupsListStateInitialValue,
			...overrides.groupsList
		},
		ownPlatformGlobal: {
			...ownPlatformGlobalStateInitialValue,
			...overrides.ownPlatformGlobal
		},
		ownPlatformsList: {
			...ownPlatformsListStateInitialValue,
			...overrides.ownPlatformsList
		},
		tvShowSeasonsList: {
			...tvShowSeasonsListStateInitialValue,
			...overrides.tvShowSeasonsList
		}
	};
	const dispatchedActions: DetailsScreenAction[] = [];
	const store = createStore((state: DetailsScreenTestState = initialState, action: DetailsScreenAction) => {
		dispatchedActions.push(action);

		switch(action.type) {
			case SET_MEDIA_ITEM_FORM_DRAFT: {
				return {
					...state,
					mediaItemDetails: {
						...state.mediaItemDetails,
						formDraft: action.mediaItem
					}
				};
			}

			case SET_MEDIA_ITEM_FORM_STATUS: {
				return {
					...state,
					mediaItemDetails: {
						...state.mediaItemDetails,
						valid: Boolean(action.valid),
						dirty: Boolean(action.dirty)
					}
				};
			}

			case START_TV_SHOW_SEASONS_HANDLING: {
				return {
					...state,
					tvShowSeasonsList: {
						...state.tvShowSeasonsList,
						tvShowSeasons: action.tvShowSeasons || []
					}
				};
			}

			default:
				return state;
		}
	});

	return {
		dispatchedActions,
		store
	};
};

const renderScreen = (overrides: DetailsScreenStateOverrides = {}) => {
	const {
		dispatchedActions,
		store
	} = createDetailsStore(overrides);
	const renderedScreen = render(createScreenElement(store));

	return {
		dispatchedActions,
		store,
		...renderedScreen
	};
};

describe('MediaItemDetailsScreenContainer', () => {
	test('submits a valid media item from form input', async() => {
		const {
			dispatchedActions,
			store
		} = renderScreen();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name'));
		const pagesInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.BOOK'));
		const authorsInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.creators.BOOK'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await waitFor(() => {
			expect(saveButton).toBeDisabled();
		});

		expect(screen.getByText(i18n.t('mediaItem.details.subtitle.new'))).toBeInTheDocument();

		await user.type(nameInput, 'Dune');
		await user.type(pagesInput, '412');
		await user.type(authorsInput, 'Frank Herbert');
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: SAVE_MEDIA_ITEM,
			mediaItem: {
				...DEFAULT_BOOK,
				name: 'Dune',
				pagesNumber: 412,
				authors: [ 'Frank Herbert' ]
			},
			confirmSameName: false
		}));
		expect(store.getState().mediaItemDetails.formDraft).toMatchObject({
			name: 'Dune',
			pagesNumber: 412,
			authors: [ 'Frank Herbert' ]
		});
	});

	test('keeps inline text input raw while typing but still normalizes it on save', async() => {
		const {
			dispatchedActions
		} = renderScreen();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name'));
		const authorsInput = screen.getByLabelText(i18n.t('mediaItem.details.placeholders.creators.BOOK'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await user.type(nameInput, 'Dune');
		await user.type(authorsInput, 'Frank Herbert,Brian Herbert, ');

		expect(authorsInput).toHaveValue('Frank Herbert,Brian Herbert, ');
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: SAVE_MEDIA_ITEM,
			mediaItem: expect.objectContaining({
				...DEFAULT_BOOK,
				name: 'Dune',
				authors: [ 'Frank Herbert', 'Brian Herbert' ]
			}),
			confirmSameName: false
		}));
	});

	test('asks confirmation and retries save when same-name warning is requested', async() => {
		const mediaItem: MediaItemInternal = {
			id: 'media-id',
			name: 'Dune',
			mediaType: 'BOOK',
			status: 'ACTIVE',
			importance: '300'
		};
		const initialRender = renderScreen({
			mediaItemDetails: {
				mediaItem
			}
		});

		expect(screen.getByText(i18n.t('mediaItem.details.subtitle.existing'))).toBeInTheDocument();
		const confirmedRender = createDetailsStore({
			mediaItemDetails: {
				...mediaItemDetailsStateInitialValue,
				mediaItem,
				saveStatus: 'REQUIRES_CONFIRMATION'
			}
		});

		initialRender.rerender(createScreenElement(confirmedRender.store));

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		await waitFor(() => {
			expect(confirmedRender.dispatchedActions).toContainEqual(expect.objectContaining({
				type: SAVE_MEDIA_ITEM,
				mediaItem,
				confirmSameName: true
			}));
		});
	});

	test('shows save loading in the header button without the full-form overlay', () => {
		const {
			container
		} = renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_BOOK,
					id: 'book-id',
					name: 'Dune'
				},
				saveStatus: 'SAVING'
			}
		});

		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		expect(saveButton).toBeDisabled();
		expect(saveButton).toHaveAttribute('aria-busy', 'true');
		expect(saveButton.querySelector('.pill-button-spinner')).toBeInTheDocument();
		expect(container.querySelector('.loading-indicator-container-parent-size')).not.toBeInTheDocument();
	});

	test('dispatches the TV show seasons flow from the details form', async() => {
		const tvShow: TvShowInternal = {
			id: 'tv-show-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				}
			]
		};
		const {
			dispatchedActions,
			store
		} = renderScreen({
			mediaItemDetails: {
				mediaItem: tvShow
			}
		});

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.details.placeholders.seasons') }));

		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: START_TV_SHOW_SEASONS_HANDLING,
			tvShowSeasons: tvShow.seasons
		}));
		expect(store.getState().tvShowSeasonsList.tvShowSeasons).toEqual(tvShow.seasons);
		expect(screen.getByText(i18n.t('mediaItem.details.labels.seasons.single', {
			watchedEpisodesNumber: 8,
			episodesNumber: 10
		}))).toBeInTheDocument();
	});

	test('shows and hides the next episode air date field with the in-production toggle', async() => {
		const tvShow: TvShowInternal = {
			id: 'tv-show-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300'
		};

		renderScreen({
			mediaItemDetails: {
				mediaItem: tvShow
			}
		});

		expect(screen.getByText(i18n.t('mediaItem.details.placeholders.production'))).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.justWatch') })).toBeInTheDocument();
		expect(screen.queryByLabelText(i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate'))).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.inProduction')));

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate'))).toBeInTheDocument();

		await user.click(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.inProduction')));

		expect(screen.queryByLabelText(i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate'))).not.toBeInTheDocument();
	});

	test('renders the old shared book form controls and syncs selected entities', async() => {
		const mediaItem: MediaItemInternal = {
			...DEFAULT_BOOK,
			id: 'book-id',
			name: 'Dune',
			importance: '300',
			catalogId: 'catalog-1',
			imageUrl: 'https://example.com/dune.jpg'
		};
		const selectedGroup: GroupInternal = {
			id: 'group-id',
			name: 'Sci-Fi Saga'
		};
		const selectedOwnPlatform: OwnPlatformInternal = {
			id: 'platform-id',
			name: 'Kindle',
			color: config.ui.colors.availableOwnPlatformColors[3],
			icon: 'kindle'
		};
		const initialRender = renderScreen({
			mediaItemDetails: {
				mediaItem
			}
		});
		const selectedEntitiesRender = createDetailsStore({
			mediaItemDetails: {
				...mediaItemDetailsStateInitialValue,
				mediaItem
			},
			groupGlobal: {
				selectedGroup
			},
			ownPlatformGlobal: {
				selectedOwnPlatform
			}
		});

		expect(screen.queryByText('Status')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.google') })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.wikipedia') })).toBeInTheDocument();
		expect(screen.getByAltText('Dune cover')).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent(i18n.t('ownPlatform.list.none'));
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent(i18n.t('group.list.none'));
		expect(screen.getByText(i18n.t('mediaItem.details.placeholders.completedOn'))).toBeInTheDocument();

		initialRender.rerender(createScreenElement(selectedEntitiesRender.store));

		await waitFor(() => {
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent('Kindle');
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent('Sci-Fi Saga');
		});
	});

	test('renders movie-specific shared form controls', () => {
		renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_MOVIE,
					id: 'movie-id',
					name: 'Arrival'
				}
			}
		});

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.MOVIE'))).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.creators.MOVIE'))).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.justWatch') })).toBeInTheDocument();
		expect(screen.queryByLabelText(i18n.t('mediaItem.details.placeholders.creators.BOOK'))).not.toBeInTheDocument();
	});

	test('renders videogame-specific shared form controls', () => {
		renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_VIDEOGAME,
					id: 'videogame-id',
					name: 'Hades'
				}
			}
		});

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.VIDEOGAME'))).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.publishers'))).toBeInTheDocument();
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.platforms'))).toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.howLongToBeat') })).toBeInTheDocument();
	});

	test('renders completion date controls and picker actions', async() => {
		renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_BOOK,
					name: 'Dune',
					importance: '300'
				}
			}
		});

		expect(screen.getAllByText(i18n.t('common.buttons.select'))).toHaveLength(2);
		expect(screen.getByText(i18n.t('mediaItem.details.completion.empty'))).toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.details.buttons.addDate') }));

		expect(screen.queryByText(i18n.t('mediaItem.details.completion.empty'))).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: i18n.t('common.buttons.remove') })).toBeInTheDocument();
	});

	test('does not remove a completion date row while the native date input is mid-edit', () => {
		const completionDate = new Date('2024-03-04T00:00:00.000Z');
		const {
			store
		} = renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_BOOK,
					id: 'book-id',
					name: 'Dune',
					completedOn: [ completionDate ]
				}
			}
		});
		const completionDateInput = document.getElementById('media-item-completed-on-0') as HTMLInputElement;

		expect(completionDateInput).toHaveValue('2024-03-04');

		fireEvent.change(completionDateInput, {
			target: {
				value: ''
			}
		});

		expect(document.getElementById('media-item-completed-on-0')).toBeInTheDocument();
		expect(store.getState().mediaItemDetails.formDraft?.completedOn).toEqual([ completionDate ]);
	});

	test('hides the media image/actions block for a brand new item without catalog data', () => {
		renderScreen();

		expect(screen.queryByRole('button', { name: i18n.t('mediaItem.details.buttons.google') })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: i18n.t('mediaItem.details.buttons.wikipedia') })).not.toBeInTheDocument();
		expect(screen.queryByAltText('Books cover')).not.toBeInTheDocument();
	});

	test('renders the dark media-style shell sections', () => {
		renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_BOOK,
					name: 'Dune'
				}
			}
		});

		expect(screen.queryByRole('heading', { name: 'Quick actions' })).not.toBeInTheDocument();
		expect(screen.queryByText(i18n.t('category.mediaTypes.BOOK'))).not.toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.basics.title') })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.profile.title') })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.collection.title') })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: i18n.t('mediaItem.details.sections.progress.title') })).toBeInTheDocument();
		expect(screen.queryByText('Importance: Very important')).not.toBeInTheDocument();
	});

	test('hydrates selected own platform on mount and saves it', async() => {
		const selectedOwnPlatform: OwnPlatformInternal = {
			id: 'platform-id',
			name: 'Kindle',
			color: config.ui.colors.availableOwnPlatformColors[3],
			icon: 'kindle'
		};
		const {
			dispatchedActions
		} = renderScreen({
			ownPlatformGlobal: {
				selectedOwnPlatform
			}
		});

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent('Kindle');

		const user = userEvent.setup();
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name')), 'Dune');
		await user.click(screen.getByRole('button', { name: i18n.t('common.buttons.save') }));

		expect(dispatchedActions).toContainEqual(expect.objectContaining({
			type: SAVE_MEDIA_ITEM,
			mediaItem: {
				...DEFAULT_BOOK,
				name: 'Dune',
				ownPlatform: selectedOwnPlatform
			},
			confirmSameName: false
		}));
	});

	test('restores unsaved draft after remounting from picker navigation', async() => {
		const firstRender = renderScreen();
		const user = userEvent.setup();

		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name')), 'Dune');
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.BOOK')), '412');
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment')), 'Keep this draft');

		const savedDraft = firstRender.store.getState().mediaItemDetails.formDraft;

		expect(savedDraft).toMatchObject({
			name: 'Dune',
			pagesNumber: 412,
			userComment: 'Keep this draft'
		});

		firstRender.unmount();

		const restoredRender = renderScreen({
			mediaItemDetails: {
				formDraft: savedDraft
			}
		});

		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.name'))).toHaveValue('Dune');
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.duration.BOOK'))).toHaveValue(412);
		expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment'))).toHaveValue('Keep this draft');

		await waitFor(() => {
			expect(restoredRender.store.getState().mediaItemDetails.dirty).toBe(true);
		});
	});

	test('keeps unsaved draft values when remounting from group and own-platform picker navigation', async() => {
		const initialGroup: GroupInternal = {
			id: 'group-id-1',
			name: 'Original group'
		};
		const selectedGroup: GroupInternal = {
			id: 'group-id-2',
			name: 'Updated group'
		};
		const initialOwnPlatform: OwnPlatformInternal = {
			id: 'platform-id-1',
			name: 'Shelf',
			color: config.ui.colors.availableOwnPlatformColors[0],
			icon: 'book'
		};
		const selectedOwnPlatform: OwnPlatformInternal = {
			id: 'platform-id-2',
			name: 'Kindle',
			color: config.ui.colors.availableOwnPlatformColors[3],
			icon: 'kindle'
		};
		const firstRender = renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_BOOK,
					id: 'book-id',
					name: 'Dune',
					group: initialGroup,
					orderInGroup: 1,
					ownPlatform: initialOwnPlatform
				}
			},
			groupGlobal: {
				selectedGroup: initialGroup
			},
			ownPlatformGlobal: {
				selectedOwnPlatform: initialOwnPlatform
			}
		});
		const user = userEvent.setup();

		await user.clear(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.orderInGroup')));
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.orderInGroup')), '7');
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment')), 'Keep this draft');

		await waitFor(() => {
			expect(firstRender.store.getState().mediaItemDetails.formDraft).toMatchObject({
				orderInGroup: 7,
				userComment: 'Keep this draft'
			});
		});

		const savedDraft = firstRender.store.getState().mediaItemDetails.formDraft;

		firstRender.unmount();

		renderScreen({
			mediaItemDetails: {
				mediaItem: {
					...DEFAULT_BOOK,
					id: 'book-id',
					name: 'Dune',
					group: initialGroup,
					orderInGroup: 1,
					ownPlatform: initialOwnPlatform
				},
				formDraft: savedDraft
			},
			groupGlobal: {
				selectedGroup
			},
			ownPlatformGlobal: {
				selectedOwnPlatform
			}
		});

		await waitFor(() => {
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent('Updated group');
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.ownPlatform'))).toHaveTextContent('Kindle');
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.orderInGroup'))).toHaveValue(7);
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment'))).toHaveValue('Keep this draft');
		});
	});

	test('disables save when a group is re-selected without restoring order in group', async() => {
		const initialGroup: GroupInternal = {
			id: 'group-id-1',
			name: 'Original group'
		};
		const selectedGroup: GroupInternal = {
			id: 'group-id-2',
			name: 'Updated group'
		};
		const savedMediaItem: MediaItemInternal = {
			...DEFAULT_BOOK,
			id: 'book-id',
			name: 'Dune',
			group: initialGroup,
			orderInGroup: 1
		};
		const firstPickerReturn = renderScreen({
			mediaItemDetails: {
				mediaItem: savedMediaItem,
				formDraft: savedMediaItem
			},
			groupGlobal: {
				selectedGroup: undefined
			}
		});

		await waitFor(() => {
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent(i18n.t('group.list.none'));
		});

		await waitFor(() => {
			const currentDraft = firstPickerReturn.store.getState().mediaItemDetails.formDraft;

			expect(currentDraft?.group).toBeUndefined();
			expect(currentDraft?.orderInGroup).toBeUndefined();
		});

		const draftWithoutGroup = firstPickerReturn.store.getState().mediaItemDetails.formDraft;

		firstPickerReturn.unmount();

		renderScreen({
			mediaItemDetails: {
				mediaItem: savedMediaItem,
				formDraft: draftWithoutGroup
			},
			groupGlobal: {
				selectedGroup
			}
		});

		await waitFor(() => {
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.group'))).toHaveTextContent('Updated group');
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.orderInGroup'))).toHaveValue(null);
		});

		await waitFor(() => {
			expect(screen.getByRole('button', { name: i18n.t('common.buttons.save') })).toBeDisabled();
		});
	});

	test('keeps unsaved TV show edits when remounting from the seasons flow', async() => {
		const savedMediaItem: TvShowInternal = {
			id: 'tv-show-id',
			name: 'Dark',
			mediaType: 'TV_SHOW',
			status: 'ACTIVE',
			importance: '300',
			seasons: [
				{
					number: 1,
					episodesNumber: 10,
					watchedEpisodesNumber: 8
				}
			]
		};
		const firstRender = renderScreen({
			mediaItemDetails: {
				mediaItem: savedMediaItem
			}
		});
		const handledSeasons = [
			{
				number: 1,
				episodesNumber: 10,
				watchedEpisodesNumber: 10
			},
			{
				number: 2,
				episodesNumber: 8,
				watchedEpisodesNumber: 4
			}
		];
		const user = userEvent.setup();

		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.creators.TV_SHOW')), 'Baran bo Odar');
		await user.type(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment')), 'Keep this draft');

		await waitFor(() => {
			expect(firstRender.store.getState().mediaItemDetails.formDraft).toMatchObject({
				creators: [ 'Baran bo Odar' ],
				userComment: 'Keep this draft'
			});
		});

		const savedDraft = firstRender.store.getState().mediaItemDetails.formDraft as TvShowInternal;

		firstRender.unmount();

		renderScreen({
			mediaItemDetails: {
				mediaItem: savedMediaItem,
				formDraft: savedDraft
			},
			tvShowSeasonsList: {
				tvShowSeasons: handledSeasons,
				completeHandlingTimestamp: new Date('2026-03-14T12:00:00.000Z')
			}
		});

		await waitFor(() => {
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.creators.TV_SHOW'))).toHaveValue('Baran bo Odar');
			expect(screen.getByLabelText(i18n.t('mediaItem.details.placeholders.userComment'))).toHaveValue('Keep this draft');
			expect(screen.getByText(i18n.t('mediaItem.details.labels.seasons.multiple', {
				seasonsNumber: 2,
				watchedEpisodesNumber: 14,
				episodesNumber: 18
			}))).toBeInTheDocument();
		});
	});
});
