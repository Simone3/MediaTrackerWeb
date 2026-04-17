import { DEFAULT_CATEGORY } from 'app/data/models/internal/category';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { DEFAULT_GROUP } from 'app/data/models/internal/group';
import { DEFAULT_OWN_PLATFORM } from 'app/data/models/internal/own-platform';
import { failSavingCategory, startSavingCategory } from 'app/redux/actions/category/generators';
import { failSavingMediaItem, startSavingMediaItem } from 'app/redux/actions/media-item/generators';
import { failSavingGroup, startSavingGroup } from 'app/redux/actions/group/generators';
import { failSavingOwnPlatform, startSavingOwnPlatform } from 'app/redux/actions/own-platform/generators';
import { categoryDetails } from 'app/redux/reducers/category/details';
import { mediaItemDetails } from 'app/redux/reducers/media-item/details';
import { groupDetails } from 'app/redux/reducers/group/details';
import { ownPlatformDetails } from 'app/redux/reducers/own-platform/details';
import { categoryDetailsStateInitialValue } from 'app/redux/state/category';
import { mediaItemDetailsStateInitialValue } from 'app/redux/state/media-item';
import { groupDetailsStateInitialValue } from 'app/redux/state/group';
import { ownPlatformDetailsStateInitialValue } from 'app/redux/state/own-platform';

jest.mock('app/controllers/main/entities/media-items/factories', () => {
	return {
		mediaItemDefinitionsControllerFactory: {
			get: jest.fn()
		}
	};
});

describe('details reducers preserve unsaved dirty state when a save fails', () => {
	test('keeps the original media-item baseline after save start and failure', () => {
		const savedMediaItem = {
			...DEFAULT_BOOK,
			id: 'book-id',
			name: 'Dune'
		};
		const editedMediaItem = {
			...savedMediaItem,
			name: 'Dune Messiah'
		};
		const initialState = {
			...mediaItemDetailsStateInitialValue,
			mediaItem: savedMediaItem,
			formDraft: editedMediaItem,
			valid: true,
			dirty: true
		};
		const savingState = mediaItemDetails(initialState, startSavingMediaItem(editedMediaItem));
		const failedState = mediaItemDetails(savingState, failSavingMediaItem());

		expect(savingState).toEqual({
			...initialState,
			saveStatus: 'SAVING'
		});
		expect(savingState.mediaItem).toBe(savedMediaItem);
		expect(savingState.formDraft).toBe(editedMediaItem);
		expect(failedState).toEqual({
			...initialState,
			saveStatus: 'IDLE'
		});
	});

	test('keeps the original category baseline after save start and failure', () => {
		const savedCategory = {
			...DEFAULT_CATEGORY,
			id: 'category-id',
			name: 'Books'
		};
		const editedCategory = {
			...savedCategory,
			name: 'Sci-Fi'
		};
		const initialState = {
			...categoryDetailsStateInitialValue,
			category: savedCategory,
			valid: true,
			dirty: true
		};
		const savingState = categoryDetails(initialState, startSavingCategory(editedCategory));
		const failedState = categoryDetails(savingState, failSavingCategory());

		expect(savingState).toEqual({
			...initialState,
			saveStatus: 'SAVING'
		});
		expect(savingState.category).toBe(savedCategory);
		expect(failedState).toEqual({
			...initialState,
			saveStatus: 'IDLE'
		});
	});

	test('keeps the original group baseline after save start and failure', () => {
		const savedGroup = {
			...DEFAULT_GROUP,
			id: 'group-id',
			name: 'Saga Shelf'
		};
		const editedGroup = {
			...savedGroup,
			name: 'Saga Corner'
		};
		const initialState = {
			...groupDetailsStateInitialValue,
			group: savedGroup,
			valid: true,
			dirty: true
		};
		const savingState = groupDetails(initialState, startSavingGroup(editedGroup));
		const failedState = groupDetails(savingState, failSavingGroup());

		expect(savingState).toEqual({
			...initialState,
			saveStatus: 'SAVING'
		});
		expect(savingState.group).toBe(savedGroup);
		expect(failedState).toEqual({
			...initialState,
			saveStatus: 'IDLE'
		});
	});

	test('keeps the original own-platform baseline after save start and failure', () => {
		const savedOwnPlatform = {
			...DEFAULT_OWN_PLATFORM,
			id: 'platform-id',
			name: 'Kindle Library'
		};
		const editedOwnPlatform = {
			...savedOwnPlatform,
			name: 'Shelf'
		};
		const initialState = {
			...ownPlatformDetailsStateInitialValue,
			ownPlatform: savedOwnPlatform,
			valid: true,
			dirty: true
		};
		const savingState = ownPlatformDetails(initialState, startSavingOwnPlatform(editedOwnPlatform));
		const failedState = ownPlatformDetails(savingState, failSavingOwnPlatform());

		expect(savingState).toEqual({
			...initialState,
			saveStatus: 'SAVING'
		});
		expect(savingState.ownPlatform).toBe(savedOwnPlatform);
		expect(failedState).toEqual({
			...initialState,
			saveStatus: 'IDLE'
		});
	});
});
