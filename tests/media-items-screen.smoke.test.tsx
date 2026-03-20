import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaItemsListScreenComponent } from 'app/components/presentational/media-item/list/screen';
import { CategoryInternal } from 'app/data/models/internal/category';

jest.mock('app/components/containers/media-item/list/list', () => {
	return {
		MediaItemsListContainer: () => <div data-testid='media-items-list-container' />
	};
});

jest.mock('app/components/containers/media-item/list/filter-modal', () => {
	return {
		MediaItemFilterModalContainer: () => <div data-testid='media-item-filter-modal-container' />
	};
});

const category: CategoryInternal = {
	id: 'category-id',
	name: 'Weekend Queue',
	mediaType: 'MOVIE',
	color: '#3f51b5'
};

const setViewportWidth = (width: number): void => {
	Object.defineProperty(window, 'innerWidth', {
		configurable: true,
		writable: true,
		value: width
	});
};

describe('MediaItemsListScreenComponent', () => {
	afterEach(() => {
		document.body.className = '';
	});

	test('uses the dark shell, fetches when required and shows the desktop add action', async() => {
		const fetchMediaItems = jest.fn();
		const loadNewMediaItemDetails = jest.fn();
		setViewportWidth(1280);

		const {
			container,
			unmount
		} = render(
			<MediaItemsListScreenComponent
				category={category}
				mediaItemsCount={2}
				isLoading={false}
				requiresFetch={true}
				fetchMediaItems={fetchMediaItems}
				loadNewMediaItemDetails={loadNewMediaItemDetails}
			/>
		);

		expect(fetchMediaItems).toHaveBeenCalledTimes(1);
		expect(document.body).toHaveClass('app-dark-screen-active');
		expect(screen.getAllByText('2 items')).toHaveLength(1);
		expect(screen.queryByText('Movies')).not.toBeInTheDocument();
		expect(screen.getByTestId('media-items-list-container')).toBeInTheDocument();
		expect(screen.getByTestId('media-item-filter-modal-container')).toBeInTheDocument();
		expect(container.querySelector('.media-items-screen-icon')).not.toBeNull();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: '+ Add movie' }));

		expect(loadNewMediaItemDetails).toHaveBeenCalledWith(category);

		unmount();

		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});

	test('shows the shared mobile FAB instead of the desktop add button on small screens', async() => {
		const loadNewMediaItemDetails = jest.fn();
		setViewportWidth(640);

		render(
			<MediaItemsListScreenComponent
				category={category}
				mediaItemsCount={1}
				isLoading={false}
				requiresFetch={false}
				fetchMediaItems={jest.fn()}
				loadNewMediaItemDetails={loadNewMediaItemDetails}
			/>
		);

		expect(screen.queryByRole('button', { name: '+ Add movie' })).not.toBeInTheDocument();
		expect(screen.getByText('1 item')).toBeInTheDocument();
		expect(screen.queryByText('Movies')).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: '+' }));

		expect(loadNewMediaItemDetails).toHaveBeenCalledWith(category);
	});
});
