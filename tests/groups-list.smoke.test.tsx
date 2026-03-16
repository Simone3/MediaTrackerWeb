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
});
