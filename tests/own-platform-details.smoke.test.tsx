import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { config } from 'app/config/config';
import { OwnPlatformDetailsScreenComponent } from 'app/components/presentational/own-platform/details/screen';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

describe('OwnPlatformDetailsScreenComponent', () => {
	test('renders the shared dark-shell layout and submits a configured platform', async() => {
		const saveOwnPlatform = jest.fn();
		const notifyFormStatus = jest.fn();
		const selectedColor = config.ui.colors.availableOwnPlatformColors[1];
		render(
			<MemoryRouter>
				<OwnPlatformDetailsScreenComponent
					isLoading={false}
					ownPlatform={{
						id: '',
						name: '',
						color: config.ui.colors.availableOwnPlatformColors[0],
						icon: 'default'
					}}
					sameNameConfirmationRequested={false}
					saveOwnPlatform={saveOwnPlatform}
					notifyFormStatus={notifyFormStatus}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		expect(screen.getByRole('heading', { level: 1, name: i18n.t('ownPlatform.details.title.new') })).toBeInTheDocument();
		expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0);
		expect(document.querySelector('input[type="color"]')).not.toBeInTheDocument();
		expect(screen.getByRole('img', { name: i18n.t('common.a11y.icon', { name: i18n.t('ownPlatform.icons.default') }) })).toBeInTheDocument();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('ownPlatform.details.placeholders.name'));
		const iconSelect = screen.getByLabelText(i18n.t('ownPlatform.details.prompts.icon'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await waitFor(() => {
			expect(saveButton).toBeDisabled();
		});

		await user.type(nameInput, 'Kindle Library');
		await user.selectOptions(iconSelect, 'kindle');
		expect(screen.getByRole('img', { name: i18n.t('common.a11y.icon', { name: i18n.t('ownPlatform.icons.kindle') }) })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.selectColor', { color: selectedColor }) }));
		expect(screen.getByRole('img', { name: i18n.t('common.a11y.icon', { name: i18n.t('ownPlatform.icons.kindle') }) }).firstElementChild).toHaveStyle(`--entity-details-selected-icon-color: ${selectedColor}`);
		await waitFor(() => {
			expect(saveButton).toBeEnabled();
		});
		await user.click(saveButton);

		expect(saveOwnPlatform).toHaveBeenCalledWith({
			id: '',
			name: 'Kindle Library',
			color: selectedColor,
			icon: 'kindle'
		} as OwnPlatformInternal, false);
		expect(notifyFormStatus).toHaveBeenCalled();
	});

	test('asks confirmation and retries save when same-name warning is requested', async() => {
		const saveOwnPlatform = jest.fn();
		const ownPlatform: OwnPlatformInternal = {
			id: 'own-platform-id',
			name: 'Kindle Library',
			color: config.ui.colors.availableOwnPlatformColors[0],
			icon: 'kindle'
		};

		const { rerender } = render(
			<MemoryRouter>
				<OwnPlatformDetailsScreenComponent
					isLoading={false}
					ownPlatform={ownPlatform}
					sameNameConfirmationRequested={false}
					saveOwnPlatform={saveOwnPlatform}
					notifyFormStatus={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		rerender(
			<MemoryRouter>
				<OwnPlatformDetailsScreenComponent
					isLoading={false}
					ownPlatform={ownPlatform}
					sameNameConfirmationRequested={true}
					saveOwnPlatform={saveOwnPlatform}
					notifyFormStatus={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		await waitFor(() => {
			expect(saveOwnPlatform).toHaveBeenCalledWith(ownPlatform, true);
		});
	});
});
