import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupDetailsScreenComponent } from 'app/components/presentational/group/details/screen';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

describe('GroupDetailsScreenComponent', () => {
	test('renders the shared dark-shell layout and submits a valid group', async() => {
		const saveGroup = jest.fn();
		const notifyFormStatus = jest.fn();
		render(
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

		expect(screen.getByRole('heading', { level: 1, name: i18n.t('group.details.title.new') })).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.basics') })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.preview') })).not.toBeInTheDocument();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('group.details.placeholders.name'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await waitFor(() => {
			expect(saveButton).toBeDisabled();
		});

		await user.type(nameInput, 'Saga Shelf');

		await waitFor(() => {
			expect(saveButton).toBeEnabled();
		});

		await user.click(saveButton);

		expect(saveGroup).toHaveBeenCalledWith({
			id: '',
			name: 'Saga Shelf'
		} as GroupInternal, false);
		expect(notifyFormStatus).toHaveBeenCalled();
	});

	test('asks confirmation and retries save when same-name warning is requested', async() => {
		const saveGroup = jest.fn();
		const group: GroupInternal = {
			id: 'group-id',
			name: 'Saga Shelf'
		};

		const { rerender } = render(
			<GroupDetailsScreenComponent
				isLoading={false}
				group={group}
				sameNameConfirmationRequested={false}
				saveGroup={saveGroup}
				notifyFormStatus={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		rerender(
			<GroupDetailsScreenComponent
				isLoading={false}
				group={group}
				sameNameConfirmationRequested={true}
				saveGroup={saveGroup}
				notifyFormStatus={jest.fn()}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		await waitFor(() => {
			expect(saveGroup).toHaveBeenCalledWith(group, true);
		});
	});
});
