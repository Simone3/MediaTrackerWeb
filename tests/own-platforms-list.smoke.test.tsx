import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OwnPlatformsListScreenComponent } from 'app/components/presentational/own-platform/list/screen';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

describe('OwnPlatformsListScreenComponent', () => {
	test('supports selection, editing and deletion', async() => {
		const ownPlatforms: OwnPlatformInternal[] = [
			{
				id: 'own-platform-1',
				name: 'Switch',
				color: '#ef5350',
				icon: 'switch'
			},
			{
				id: 'own-platform-2',
				name: 'Kindle',
				color: '#5c6bc0',
				icon: 'kindle'
			}
		];
		const selectOwnPlatform = jest.fn();
		const editOwnPlatform = jest.fn();
		const deleteOwnPlatform = jest.fn();

		render(
			<OwnPlatformsListScreenComponent
				isLoading={false}
				requiresFetch={false}
				ownPlatforms={ownPlatforms}
				selectedOwnPlatformId={undefined}
				fetchOwnPlatforms={jest.fn()}
				selectOwnPlatform={selectOwnPlatform}
				editOwnPlatform={editOwnPlatform}
				deleteOwnPlatform={deleteOwnPlatform}
				loadNewOwnPlatformDetails={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		expect(screen.queryByText('Nintendo Switch')).toBeNull();

		const user = userEvent.setup();
		await user.click(screen.getByText('Switch'));
		await user.click(screen.getByRole('button', { name: 'Edit Switch' }));
		await user.click(screen.getByRole('button', { name: 'Delete Switch' }));
		expect(deleteOwnPlatform).toHaveBeenCalledTimes(0);
		await user.click(screen.getByRole('button', { name: 'OK' }));

		expect(selectOwnPlatform).toHaveBeenCalledWith(ownPlatforms[0]);
		expect(editOwnPlatform).toHaveBeenCalledWith(ownPlatforms[0]);
		expect(deleteOwnPlatform).toHaveBeenCalledWith(ownPlatforms[0]);
	});
});
