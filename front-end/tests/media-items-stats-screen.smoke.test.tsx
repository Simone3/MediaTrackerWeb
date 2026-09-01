import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { config } from 'app/config/config';
import { MediaItemsStatsImportanceBoxesComponent } from 'app/components/presentational/media-item/stats/importance-boxes';
import { MediaItemsStatsScreenComponent, MediaItemsStatsScreenComponentInput, MediaItemsStatsScreenComponentOutput } from 'app/components/presentational/media-item/stats/screen';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemsStatsInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';

jest.mock('app/components/containers/media-item/stats/filters', () => {
	return {
		MediaItemsStatsFiltersContainer: () => {
			return <div data-testid='media-items-stats-filters-container' />;
		}
	};
});

const category: CategoryInternal = {
	id: 'category-id',
	name: 'Weekend Queue',
	mediaType: 'MOVIE',
	color: config.ui.colors.availableCategoryColors[0]
};

// The chart range always ends at the current year, so the fixture is anchored to it rather than to a fixed pair of years
const currentYear = new Date().getFullYear();

const stats: MediaItemsStatsInternal = {
	mediaItems: {
		total: 128,
		filtered: 128
	},
	completions: {
		total: 91,
		mediaItems: 77,
		byYear: [
			{ year: currentYear - 1, count: 40 },
			{ year: currentYear, count: 51 }
		]
	},
	backlog: {
		total: 45,
		byStatus: [
			{ status: 'NEW', count: 37 },
			{ status: 'ACTIVE', count: 6 },
			{ status: 'REDO', count: 2 }
		],
		byImportanceAndOwnPlatform: [
			{ importance: '400', ownPlatformId: undefined, count: 45 }
		]
	}
};

const renderScreen = (props: Partial<MediaItemsStatsScreenComponentInput & MediaItemsStatsScreenComponentOutput> = {}): {
	fetchStats: jest.Mock;
	back: jest.Mock;
} => {
	const fetchStats = jest.fn();
	const back = jest.fn();

	render(
		<MemoryRouter>
			<MediaItemsStatsScreenComponent
				category={category}
				stats={stats}
				ownPlatforms={[]}
				isLoading={false}
				requiresFetch={false}
				showFetchError={false}
				fetchStats={fetchStats}
				back={back}
				{...props}
			/>
		</MemoryRouter>
	);

	return {
		fetchStats: fetchStats,
		back: back
	};
};

describe('MediaItemsStatsScreenComponent', () => {
	test('shows both halves with their own figures and leaves the list', async() => {
		const { back } = renderScreen();

		expect(screen.getByText(i18n.t('mediaItem.stats.title', { category: category.name }))).toBeInTheDocument();
		expect(screen.getByText(i18n.t('mediaItem.stats.subtitle.multiple.MOVIE', { count: 128 }))).toBeInTheDocument();
		expect(screen.getByTestId('media-items-stats-filters-container')).toBeInTheDocument();

		// The completions half: the total, the distinct items behind it and how many of it is the same things done again
		expect(document.querySelector('.media-items-stats-figure-completions')).toHaveTextContent('91');
		expect(screen.getByText(i18n.t('mediaItem.stats.completed.unit.MOVIE'))).toBeInTheDocument();
		expect(screen.getByText(/77 distinct movies/)).toBeInTheDocument();
		expect(screen.getByText(/14 repeats/)).toBeInTheDocument();
		expect(screen.getByText(i18n.t('mediaItem.stats.perYear.average', { value: '45.5' }))).toBeInTheDocument();

		// The backlog half, which shares no figure with the one above it
		expect(document.querySelector('.media-items-stats-figure-backlog')).toHaveTextContent('45');
		expect(screen.getByText(i18n.t('mediaItem.stats.byStatus.values.NEW.MOVIE'))).toBeInTheDocument();
		expect(screen.getByText(i18n.t('mediaItem.stats.byPlatform.noOwnPlatform'))).toBeInTheDocument();
		expect(screen.queryByText(i18n.t('mediaItem.stats.byStatus.values.UPCOMING.MOVIE'))).not.toBeInTheDocument();

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.stats.back') }));

		expect(back).toHaveBeenCalledTimes(1);
	});

	test('fetches when required, and says nothing about the category size before the stats arrive', () => {
		const { fetchStats } = renderScreen({
			stats: undefined,
			requiresFetch: true
		});

		expect(fetchStats).toHaveBeenCalledTimes(1);
		expect(screen.queryByText(i18n.t('mediaItem.stats.subtitle.multiple.MOVIE', { count: 128 }))).not.toBeInTheDocument();
		expect(screen.queryByText(i18n.t('mediaItem.stats.byStatus.title'))).not.toBeInTheDocument();
	});

	test('offers a retry beside the stats when the fetch failed', async() => {
		const { fetchStats } = renderScreen({
			showFetchError: true
		});

		expect(screen.getByRole('alert')).toHaveTextContent(i18n.t('mediaItem.stats.fetchError.title'));

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('mediaItem.stats.fetchError.retry') }));

		expect(fetchStats).toHaveBeenCalledTimes(1);
	});

	test('shows the empty copy of each half when there is nothing to draw', () => {
		renderScreen({
			stats: {
				mediaItems: {
					total: 0,
					filtered: 0
				},
				completions: {
					total: 0,
					mediaItems: 0,
					byYear: []
				},
				backlog: {
					total: 0,
					byStatus: [],
					byImportanceAndOwnPlatform: []
				}
			}
		});

		expect(screen.getByText(i18n.t('mediaItem.stats.perYear.empty'))).toBeInTheDocument();
		expect(screen.getByText(i18n.t('mediaItem.stats.byStatus.empty'))).toBeInTheDocument();
		expect(screen.getByText(i18n.t('mediaItem.stats.byPlatform.empty'))).toBeInTheDocument();
		expect(screen.queryByText(i18n.t('mediaItem.stats.perYear.average', { value: '0.0' }))).not.toBeInTheDocument();
	});
});

describe('MediaItemsStatsImportanceBoxesComponent', () => {
	test('scales every bar of every box against the largest count in the whole panel', () => {
		render(
			<MediaItemsStatsImportanceBoxesComponent
				emptyMessage='empty'
				boxes={[
					{
						key: '400',
						label: 'Very important',
						total: 5,
						rows: [ { key: 'a', label: 'Netflix', count: 5 } ]
					},
					{
						key: '300',
						label: 'Important',
						total: 20,
						rows: [ { key: 'b', label: 'Blu-ray', count: 20 } ]
					},
					{
						key: '200',
						label: 'Fairly important',
						total: 0,
						rows: []
					},
					{
						key: '100',
						label: 'Unimportant',
						total: 10,
						rows: [ { key: 'c', label: 'Cinema', count: 10 } ]
					}
				]}
			/>
		);

		// The largest count anywhere is 20, so it alone fills its track and the others are read against it, not against their own box
		const widths = Array.from(document.querySelectorAll<HTMLElement>('.media-items-stats-box-row-fill')).map((fill) => {
			return fill.style.width;
		});

		expect(widths).toEqual([ '25%', '100%', '50%' ]);
		expect(screen.getByText(i18n.t('mediaItem.stats.byPlatform.emptyLevel'))).toBeInTheDocument();
	});
});
