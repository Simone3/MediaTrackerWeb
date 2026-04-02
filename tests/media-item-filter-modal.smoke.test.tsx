import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
jest.mock('app/controllers/core/entities/media-items/book', () => {
	return {
		bookDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
jest.mock('app/controllers/core/entities/media-items/movie', () => {
	return {
		movieDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'NAME',
				ascending: false
			}]
		}
	};
});
jest.mock('app/controllers/core/entities/media-items/tv-show', () => {
	return {
		tvShowDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
jest.mock('app/controllers/core/entities/media-items/videogame', () => {
	return {
		videogameDefinitionsController: {
			getDefaultSortBy: () => [{
				field: 'ACTIVE',
				ascending: false
			}, {
				field: 'IMPORTANCE',
				ascending: false
			}, {
				field: 'RELEASE_DATE',
				ascending: true
			}]
		}
	};
});
import { MediaItemFilterModalComponent } from 'app/components/presentational/media-item/list/filter-modal';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

describe('MediaItemFilterModalComponent', () => {
	test('submits selected filter and sort values', async() => {
		const category: CategoryInternal = {
			id: 'category-id',
			name: 'Books',
			mediaType: 'BOOK',
			color: '#3f51b5'
		};
		const submitFilter = jest.fn();

		render(
			<MediaItemFilterModalComponent
				visible={true}
				category={category}
				initialFilter={{}}
				initialSortBy={[]}
				submitFilter={submitFilter}
				close={jest.fn()}
			/>
		);

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
			color: '#ef6c00'
		};
		const submitFilter = jest.fn();

		render(
			<MediaItemFilterModalComponent
				visible={true}
				category={category}
				initialFilter={{}}
				initialSortBy={[]}
				submitFilter={submitFilter}
				close={jest.fn()}
			/>
		);

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
});
