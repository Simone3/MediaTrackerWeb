import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config } from 'app/config/config';
import { MediaItemFilterModalComponent, MediaItemFilterModalComponentProps } from 'app/components/presentational/media-item/list/filter-modal';
import { CategoryInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

jest.mock('app/controllers/main/entities/media-items-definitions/book', () => {
	return {
		bookDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});
jest.mock('app/controllers/main/entities/media-items-definitions/movie', () => {
	return {
		movieDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'NAME',
					ascending: false
				}];
			}
		}
	};
});
jest.mock('app/controllers/main/entities/media-items-definitions/tv-show', () => {
	return {
		tvShowDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});
jest.mock('app/controllers/main/entities/media-items-definitions/videogame', () => {
	return {
		videogameDefinitionsController: {
			getDefaultSortBy: () => {
				return [{
					field: 'ACTIVE',
					ascending: false
				}, {
					field: 'IMPORTANCE',
					ascending: false
				}, {
					field: 'RELEASE_DATE',
					ascending: true
				}];
			}
		}
	};
});

const groups: GroupInternal[] = [{
	id: 'group-1',
	name: 'The Lord of the Rings'
}, {
	id: 'group-2',
	name: 'Discworld'
}];

const ownPlatforms: OwnPlatformInternal[] = [{
	id: 'platform-1',
	name: 'Kindle',
	color: config.ui.colors.availableOwnPlatformColors[0],
	icon: 'kindle'
}];

const buildProps = (overrides: Partial<MediaItemFilterModalComponentProps>): MediaItemFilterModalComponentProps => {
	return {
		visible: true,
		category: {
			id: 'category-id',
			name: 'Books',
			mediaType: 'BOOK',
			color: config.ui.colors.availableCategoryColors[0]
		},
		initialFilter: {},
		initialSortBy: [],
		groups: [],
		ownPlatforms: [],
		groupsLoading: false,
		ownPlatformsLoading: false,
		groupsLoaded: false,
		ownPlatformsLoaded: false,
		groupsRequireFetch: false,
		ownPlatformsRequireFetch: false,
		submitFilter: jest.fn(),
		clearFilter: jest.fn(),
		close: jest.fn(),
		fetchGroups: jest.fn(),
		fetchOwnPlatforms: jest.fn(),
		...overrides
	};
};

describe('MediaItemFilterModalComponent', () => {
	test('submits selected filter and sort values', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			mediaType: 'BOOK',
			color: config.ui.colors.availableCategoryColors[0]
		};
		const submitFilter = jest.fn();

		render(<MediaItemFilterModalComponent {...buildProps({ category: category, submitFilter: submitFilter })} />);

		expect(screen.getByRole('button', { name: i18n.t('common.alert.default.cancelButton') })).toHaveClass('pill-button-compact');
		expect(screen.getByRole('button', { name: i18n.t('common.alert.default.applyButton') })).toHaveClass('pill-button-compact');

		const user = userEvent.setup();
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.status')), 'CURRENT');
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.importance')), '300');
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.group')), 'ANY');
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.ownPlatform')), 'NONE');
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.sort')), 'NAME');
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.applyButton') }));

		expect(submitFilter).toHaveBeenCalledWith({
			status: 'CURRENT',
			importanceLevels: [ '300' ],
			groups: {
				anyGroup: true
			},
			ownPlatforms: {
				noOwnPlatform: true
			}
		}, [
			{
				field: 'NAME',
				ascending: true
			}
		]);
	});

	test('uses the media-type switcher path for movie default sorting', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Movies',
			mediaType: 'MOVIE',
			color: config.ui.colors.availableCategoryColors[3]
		};
		const submitFilter = jest.fn();

		render(<MediaItemFilterModalComponent {...buildProps({ category: category, submitFilter: submitFilter })} />);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.applyButton') }));

		expect(submitFilter).toHaveBeenCalledWith(expect.objectContaining({
			importanceLevels: undefined,
			groups: undefined,
			ownPlatforms: undefined,
			status: undefined
		}), [
			{
				field: 'NAME',
				ascending: false
			}
		]);
	});

	test('lists the loaded groups and own platforms and submits the selected ones with their display names', async() => {
		const submitFilter = jest.fn();

		render(<MediaItemFilterModalComponent {...buildProps({
			groups: groups,
			ownPlatforms: ownPlatforms,
			groupsLoaded: true,
			ownPlatformsLoaded: true,
			submitFilter: submitFilter
		})} />);

		const user = userEvent.setup();
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.group')), 'GROUP_ID_group-2');
		await user.selectOptions(screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.ownPlatform')), 'OWN_PLATFORM_ID_platform-1');
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.applyButton') }));

		expect(screen.getByRole('option', { name: 'The Lord of the Rings' })).toBeInTheDocument();
		expect(screen.getByRole('option', { name: 'Kindle' })).toBeInTheDocument();
		expect(submitFilter).toHaveBeenCalledWith(expect.objectContaining({
			groups: {
				groupIds: [ 'group-2' ],
				groupNames: [ 'Discworld' ]
			},
			ownPlatforms: {
				ownPlatformIds: [ 'platform-1' ],
				ownPlatformNames: [ 'Kindle' ]
			}
		}), expect.anything());
	});

	test('clears the filter back to the category defaults', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			mediaType: 'BOOK',
			color: config.ui.colors.availableCategoryColors[0]
		};
		const clearFilter = jest.fn();
		const submitFilter = jest.fn();

		render(<MediaItemFilterModalComponent {...buildProps({
			category: category,
			initialFilter: {
				status: 'COMPLETE'
			},
			clearFilter: clearFilter,
			submitFilter: submitFilter
		})} />);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.filter.clearButton') }));

		expect(clearFilter).toHaveBeenCalledWith(category);
		expect(submitFilter).not.toHaveBeenCalled();
	});

	test('loads the filter options when it opens, and not while it is closed', () => {
		const fetchGroups = jest.fn();
		const fetchOwnPlatforms = jest.fn();
		const props = buildProps({
			visible: false,
			groupsRequireFetch: true,
			ownPlatformsRequireFetch: true,
			fetchGroups: fetchGroups,
			fetchOwnPlatforms: fetchOwnPlatforms
		});

		const { rerender } = render(<MediaItemFilterModalComponent {...props} />);
		expect(fetchGroups).not.toHaveBeenCalled();
		expect(fetchOwnPlatforms).not.toHaveBeenCalled();

		rerender(<MediaItemFilterModalComponent {...props} visible={true} />);
		expect(fetchGroups).toHaveBeenCalledTimes(1);
		expect(fetchOwnPlatforms).toHaveBeenCalledTimes(1);
	});

	test('keeps a selected group that the loaded list does not contain, marking it as deleted', () => {
		render(<MediaItemFilterModalComponent {...buildProps({
			initialFilter: {
				groups: {
					groupIds: [ 'deleted-group' ],
					groupNames: [ 'Dune' ]
				}
			},
			groups: groups,
			groupsLoaded: true
		})} />);

		const groupInput = screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.group')) as HTMLSelectElement;
		expect(groupInput.value).toBe('GROUP_ID_deleted-group');
		expect(screen.getByRole('option', { name: i18n.t('mediaItem.list.filter.values.group.deleted', { name: 'Dune' }) })).toBeInTheDocument();
	});

	test('falls back to the ID when a selected group has neither a display name nor a loaded list', () => {
		render(<MediaItemFilterModalComponent {...buildProps({
			initialFilter: {
				groups: {
					groupIds: [ 'unnamed-group' ]
				}
			}
		})} />);

		const groupInput = screen.getByLabelText(i18n.t('mediaItem.list.filter.prompts.group')) as HTMLSelectElement;
		expect(groupInput.value).toBe('GROUP_ID_unnamed-group');
		expect(screen.getByRole('option', { name: i18n.t('mediaItem.list.filter.values.group.unknown', { id: 'unnamed-group' }) })).toBeInTheDocument();
	});
});
