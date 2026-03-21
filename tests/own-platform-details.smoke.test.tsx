import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config } from 'app/config/config';
import { OwnPlatformDetailsScreenComponent } from 'app/components/presentational/own-platform/details/screen';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';

describe('OwnPlatformDetailsScreenComponent', () => {
	test('renders the shared dark-shell layout and submits a configured platform', async() => {
		const saveOwnPlatform = jest.fn();
		const notifyFormStatus = jest.fn();
		const selectedColor = config.ui.colors.availableOwnPlatformColors[1];
		const { unmount } = render(
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
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		expect(screen.getByRole('heading', { level: 1, name: 'New Platform' })).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Basics' })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Appearance' })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Preview' })).not.toBeInTheDocument();
		expect(document.querySelector('input[type="color"]')).not.toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Generic icon' })).toBeInTheDocument();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText('Name');
		const iconSelect = screen.getByLabelText('Icon');

		await user.type(nameInput, 'Kindle Library');
		await user.selectOptions(iconSelect, 'kindle');
		expect(screen.getByRole('img', { name: 'Kindle icon' })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: `Select color ${selectedColor}` }));
		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(saveOwnPlatform).toHaveBeenCalledWith({
			id: '',
			name: 'Kindle Library',
			color: selectedColor,
			icon: 'kindle'
		} as OwnPlatformInternal, false);
		expect(notifyFormStatus).toHaveBeenCalled();

		unmount();

		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
