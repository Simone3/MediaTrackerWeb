import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemFilterModalComponent } from 'app/components/presentational/media-item/list/filter-modal';
import { CategoryInternal } from 'app/data/models/internal/category';

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
		await user.selectOptions(screen.getByLabelText('Status'), 'CURRENT');
		await user.selectOptions(screen.getByLabelText('Importance'), '300');
		await user.selectOptions(screen.getByLabelText('Group'), 'ANY');
		await user.selectOptions(screen.getByLabelText('Owned'), 'NONE');
		await user.selectOptions(screen.getByLabelText('Order'), 'NAME');
		await user.click(screen.getByRole('button', { name: 'Apply' }));

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
});
