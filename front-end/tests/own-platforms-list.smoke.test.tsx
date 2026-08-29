import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { config } from 'app/config/config';
import { OwnPlatformsListScreenComponent } from 'app/components/presentational/own-platform/list/screen';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

describe('OwnPlatformsListScreenComponent', () => {
	test('supports selection, editing and deletion', async() => {
		const ownPlatforms: OwnPlatformInternal[] = [
			{
				id: 'own-platform-1',
				name: 'Switch',
				color: config.ui.colors.availableOwnPlatformColors[1],
				icon: 'switch'
			},
			{
				id: 'own-platform-2',
				name: 'Kindle',
				color: config.ui.colors.availableOwnPlatformColors[0],
				icon: 'kindle'
			}
		];
		const selectOwnPlatform = jest.fn();
		const editOwnPlatform = jest.fn();
		const deleteOwnPlatform = jest.fn();

		render(
			<MemoryRouter>
				<OwnPlatformsListScreenComponent
					isLoading={false}
					requiresFetch={false}
					ownPlatforms={ownPlatforms}
					selectedOwnPlatformId={undefined}
					showEmptyState={false}
					showSkeletons={false}
					fetchOwnPlatforms={jest.fn()}
					selectOwnPlatform={selectOwnPlatform}
					editOwnPlatform={editOwnPlatform}
					deleteOwnPlatform={deleteOwnPlatform}
					loadNewOwnPlatformDetails={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		expect(screen.queryByText('Nintendo Switch')).toBeNull();

		const user = userEvent.setup();
		await user.click(screen.getByText('Switch'));
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.optionsFor', { name: ownPlatforms[0].name }) }));
		await user.click(screen.getByRole('button', { name: i18n.t('ownPlatform.list.edit') }));
		await user.click(screen.getByRole('button', { name: i18n.t('common.a11y.optionsFor', { name: ownPlatforms[0].name }) }));
		await user.click(screen.getByRole('button', { name: i18n.t('ownPlatform.list.delete') }));
		expect(deleteOwnPlatform).toHaveBeenCalledTimes(0);
		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		expect(selectOwnPlatform).toHaveBeenCalledWith(ownPlatforms[0]);
		expect(editOwnPlatform).toHaveBeenCalledWith(ownPlatforms[0]);
		expect(deleteOwnPlatform).toHaveBeenCalledWith(ownPlatforms[0]);
	});

	test('filters the list with the search bar and offers a no-results state', async() => {
		const ownPlatforms: OwnPlatformInternal[] = [
			{
				id: 'own-platform-1',
				name: 'Switch',
				color: config.ui.colors.availableOwnPlatformColors[1],
				icon: 'switch'
			},
			{
				id: 'own-platform-2',
				name: 'Kindle',
				color: config.ui.colors.availableOwnPlatformColors[0],
				icon: 'kindle'
			}
		];

		render(
			<MemoryRouter>
				<OwnPlatformsListScreenComponent
					isLoading={false}
					requiresFetch={false}
					ownPlatforms={ownPlatforms}
					selectedOwnPlatformId={undefined}
					showEmptyState={false}
					showSkeletons={false}
					fetchOwnPlatforms={jest.fn()}
					selectOwnPlatform={jest.fn()}
					editOwnPlatform={jest.fn()}
					deleteOwnPlatform={jest.fn()}
					loadNewOwnPlatformDetails={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		const user = userEvent.setup();
		const searchInput = screen.getByRole('searchbox', { name: i18n.t('ownPlatform.list.search') });

		await user.type(searchInput, 'kin');
		expect(screen.getByText('Kindle')).toBeInTheDocument();
		expect(screen.queryByText('Switch')).not.toBeInTheDocument();
		expect(screen.queryByText(i18n.t('ownPlatform.list.none'))).not.toBeInTheDocument();
		expect(screen.getByText(i18n.t('ownPlatform.list.count.single'))).toBeInTheDocument();

		await user.clear(searchInput);
		await user.type(searchInput, 'nothing here');
		expect(screen.getByText(i18n.t('ownPlatform.list.noResults'))).toBeInTheDocument();
		expect(screen.queryByText(i18n.t('ownPlatform.list.empty'))).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: i18n.t('common.buttons.clear') }));
		expect(screen.getByText('Switch')).toBeInTheDocument();
		expect(screen.getByText('Kindle')).toBeInTheDocument();
		expect(screen.queryByText(i18n.t('ownPlatform.list.noResults'))).not.toBeInTheDocument();
	});

	test('hides the search bar while own platforms are still loading', () => {
		render(
			<MemoryRouter>
				<OwnPlatformsListScreenComponent
					isLoading={false}
					requiresFetch={false}
					ownPlatforms={[]}
					selectedOwnPlatformId={undefined}
					showEmptyState={false}
					showSkeletons={true}
					fetchOwnPlatforms={jest.fn()}
					selectOwnPlatform={jest.fn()}
					editOwnPlatform={jest.fn()}
					deleteOwnPlatform={jest.fn()}
					loadNewOwnPlatformDetails={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
	});

	test('shows loading skeletons instead of the empty state while own platforms are still loading', () => {
		const {
			container
		} = render(
			<MemoryRouter>
				<OwnPlatformsListScreenComponent
					isLoading={false}
					requiresFetch={true}
					ownPlatforms={[]}
					selectedOwnPlatformId={undefined}
					showEmptyState={false}
					showSkeletons={true}
					fetchOwnPlatforms={jest.fn()}
					selectOwnPlatform={jest.fn()}
					editOwnPlatform={jest.fn()}
					deleteOwnPlatform={jest.fn()}
					loadNewOwnPlatformDetails={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		expect(screen.queryByText(i18n.t('ownPlatform.list.empty'))).not.toBeInTheDocument();
		expect(container.querySelectorAll('.entity-management-list-skeleton-row')).toHaveLength(3);
	});
});
