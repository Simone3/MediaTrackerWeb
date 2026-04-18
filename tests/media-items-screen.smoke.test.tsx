import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { config } from 'app/config/config';
import { MediaItemsListScreenComponent } from 'app/components/presentational/media-item/list/screen';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

jest.mock('app/components/containers/media-item/list/list', () => {
	return {
		MediaItemsListContainer: () => {
			return <div data-testid='media-items-list-container' />;
		}
	};
});

jest.mock('app/components/containers/media-item/list/filter-modal', () => {
	return {
		MediaItemFilterModalContainer: () => {
			return <div data-testid='media-item-filter-modal-container' />;
		}
	};
});

const category: CategoryInternal = {
	id: 'category-id',
	name: 'Weekend Queue',
	mediaType: 'MOVIE',
	color: config.ui.colors.availableCategoryColors[0]
};

const setViewportWidth = (width: number): void => {
	Object.defineProperty(window, 'innerWidth', {
		configurable: true,
		writable: true,
		value: width
	});
};

describe('MediaItemsListScreenComponent', () => {
	test('uses the dark shell, fetches when required and shows the desktop add action', async() => {
		const fetchMediaItems = jest.fn();
		const loadNewMediaItemDetails = jest.fn();
		setViewportWidth(1280);

		render(
			<MemoryRouter>
				<MediaItemsListScreenComponent
					category={category}
					mediaItemsCount={2}
					isLoading={false}
					requiresFetch={true}
					fetchMediaItems={fetchMediaItems}
					loadNewMediaItemDetails={loadNewMediaItemDetails}
				/>
			</MemoryRouter>
		);

		expect(fetchMediaItems).toHaveBeenCalledTimes(1);
		expect(screen.getAllByText(i18n.t('mediaItem.list.countByType.multiple.MOVIE', { count: 2 }))).toHaveLength(1);
		expect(screen.queryByText(i18n.t('category.mediaTypes.MOVIE'))).not.toBeInTheDocument();
		expect(screen.getByTestId('media-items-list-container')).toBeInTheDocument();
		expect(screen.getByTestId('media-item-filter-modal-container')).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('common.drawer.home') })).toBeInTheDocument();
		expect(screen.queryByRole('link', { name: i18n.t('common.drawer.settings') })).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.list.add.MOVIE') }));

		expect(loadNewMediaItemDetails).toHaveBeenCalledWith(category);
	});

	test('keeps the shared header add button on small screens', async() => {
		const loadNewMediaItemDetails = jest.fn();
		setViewportWidth(640);

		render(
			<MemoryRouter>
				<MediaItemsListScreenComponent
					category={category}
					mediaItemsCount={1}
					isLoading={false}
					requiresFetch={false}
					fetchMediaItems={jest.fn()}
					loadNewMediaItemDetails={loadNewMediaItemDetails}
				/>
			</MemoryRouter>
		);

		expect(document.querySelector('.media-items-screen-content .floating-action-button')).toBeNull();
		expect(screen.getByRole('button', { name: i18n.t('common.buttons.add') })).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: i18n.t('mediaItem.list.add.MOVIE') })).not.toBeInTheDocument();
		expect(screen.getByText(i18n.t('mediaItem.list.countByType.single.MOVIE'))).toBeInTheDocument();
		expect(screen.queryByText(i18n.t('category.mediaTypes.MOVIE'))).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('common.buttons.add') }));

		expect(loadNewMediaItemDetails).toHaveBeenCalledWith(category);
	});
});
