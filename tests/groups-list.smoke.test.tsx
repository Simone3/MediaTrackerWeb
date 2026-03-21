import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupsListScreenComponent } from 'app/components/presentational/group/list/screen';
import { GroupInternal } from 'app/data/models/internal/group';

describe('GroupsListScreenComponent', () => {
	test('supports selection, editing and deletion', async() => {
		const groups: GroupInternal[] = [
			{
				id: 'group-1',
				name: 'Saga'
			},
			{
				id: 'group-2',
				name: 'Classics'
			}
		];
		const selectGroup = jest.fn();
		const editGroup = jest.fn();
		const deleteGroup = jest.fn();

		render(
			<GroupsListScreenComponent
				isLoading={false}
				requiresFetch={false}
				groups={groups}
				selectedGroupId={undefined}
				showEmptyState={false}
				showSkeletons={false}
				fetchGroups={jest.fn()}
				selectGroup={selectGroup}
				editGroup={editGroup}
				deleteGroup={deleteGroup}
				loadNewGroupDetails={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Saga' }));
		await user.click(screen.getByRole('button', { name: 'Edit Saga' }));
		await user.click(screen.getByRole('button', { name: 'Delete Saga' }));
		expect(deleteGroup).toHaveBeenCalledTimes(0);
		await user.click(screen.getByRole('button', { name: 'OK' }));

		expect(selectGroup).toHaveBeenCalledWith(groups[0]);
		expect(editGroup).toHaveBeenCalledWith(groups[0]);
		expect(deleteGroup).toHaveBeenCalledWith(groups[0]);
	});

	test('shows loading skeletons instead of the empty state while groups are still loading', () => {
		const {
			container
		} = render(
			<GroupsListScreenComponent
				isLoading={false}
				requiresFetch={true}
				groups={[]}
				selectedGroupId={undefined}
				showEmptyState={false}
				showSkeletons={true}
				fetchGroups={jest.fn()}
				selectGroup={jest.fn()}
				editGroup={jest.fn()}
				deleteGroup={jest.fn()}
				loadNewGroupDetails={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		expect(screen.queryByText('No groups')).not.toBeInTheDocument();
		expect(container.querySelectorAll('.entity-management-list-skeleton-row')).toHaveLength(3);
	});
});
