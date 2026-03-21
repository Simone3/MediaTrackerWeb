import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupDetailsScreenComponent } from 'app/components/presentational/group/details/screen';
import { GroupInternal } from 'app/data/models/internal/group';

describe('GroupDetailsScreenComponent', () => {
	test('renders the shared dark-shell layout and submits a valid group', async() => {
		const saveGroup = jest.fn();
		const notifyFormStatus = jest.fn();
		const { unmount } = render(
			<GroupDetailsScreenComponent
				isLoading={false}
				group={{
					id: '',
					name: ''
				}}
				sameNameConfirmationRequested={false}
				saveGroup={saveGroup}
				notifyFormStatus={notifyFormStatus}
				goBack={jest.fn()}
			/>
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		expect(screen.getByRole('heading', { level: 1, name: 'New Group' })).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Basics' })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Preview' })).not.toBeInTheDocument();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText('Name');
		const saveButton = screen.getByRole('button', { name: 'Save' });

		expect(saveButton).toBeDisabled();

		await user.type(nameInput, 'Saga Shelf');

		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(saveGroup).toHaveBeenCalledWith({
			id: '',
			name: 'Saga Shelf'
		} as GroupInternal, false);
		expect(notifyFormStatus).toHaveBeenCalled();

		unmount();

		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
