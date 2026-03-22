import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config } from 'app/config/config';
import { OwnPlatformDetailsScreenComponent } from 'app/components/presentational/own-platform/details/screen';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

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
		expect(screen.getByRole('heading', { level: 1, name: i18n.t('ownPlatform.details.title.new') })).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.basics') })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.appearance') })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.preview') })).not.toBeInTheDocument();
		expect(document.querySelector('input[type="color"]')).not.toBeInTheDocument();
		expect(screen.getByRole('img', { name: i18n.t('common.a11y.icon', { name: i18n.t('ownPlatform.icons.default') }) })).toBeInTheDocument();

		const user = userEvent.setup();
		const nameInput = screen.getByLabelText(i18n.t('ownPlatform.details.placeholders.name'));
		const iconSelect = screen.getByLabelText(i18n.t('ownPlatform.details.prompts.icon'));

		await user.type(nameInput, 'Kindle Library');
		await user.selectOptions(iconSelect, 'kindle');
		expect(screen.getByRole('img', { name: i18n.t('common.a11y.icon', { name: i18n.t('ownPlatform.icons.kindle') }) })).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.selectColor', { color: selectedColor }) }));
		expect(screen.getByRole('img', { name: i18n.t('common.a11y.icon', { name: i18n.t('ownPlatform.icons.kindle') }) }).firstElementChild).toHaveStyle(`--entity-details-selected-icon-color: ${selectedColor}`);
		await user.click(screen.getByRole('button', { name: i18n.t('common.buttons.save') }));

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
