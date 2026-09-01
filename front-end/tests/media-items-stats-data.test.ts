import { buildImportanceBoxes, buildStatusSegments, buildYearSeries } from 'app/components/presentational/media-item/stats/data/media-item';
import { MediaItemsStatsImportanceAndOwnPlatformInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { config } from 'app/config/config';
import { i18n } from 'app/utilities/i18n';

const ownPlatforms: OwnPlatformInternal[] = [
	{
		id: 'netflix-id',
		name: 'Netflix',
		color: config.ui.colors.availableOwnPlatformColors[0],
		icon: 'netflix'
	},
	{
		id: 'blu-ray-id',
		name: 'Blu-ray',
		color: config.ui.colors.availableOwnPlatformColors[1],
		icon: 'disc'
	}
];

describe('buildYearSeries', () => {
	test('fills the years that have no completion, from the first one to the current one', () => {
		const series = buildYearSeries([
			{ year: 2019, count: 3 },
			{ year: 2022, count: 11 }
		], 2023);

		expect(series).toEqual([
			{ year: 2019, count: 3 },
			{ year: 2020, count: 0 },
			{ year: 2021, count: 0 },
			{ year: 2022, count: 11 },
			{ year: 2023, count: 0 }
		]);
	});

	test('returns nothing when there is no completion at all', () => {
		expect(buildYearSeries([], 2023)).toEqual([]);
	});

	test('keeps a single year as a single bar', () => {
		expect(buildYearSeries([ { year: 2023, count: 4 } ], 2023)).toEqual([ { year: 2023, count: 4 } ]);
	});

	test('extends the range past the current year rather than cutting a completion off the chart', () => {
		const series = buildYearSeries([ { year: 2024, count: 2 } ], 2023);

		expect(series).toEqual([ { year: 2024, count: 2 } ]);
	});
});

describe('buildStatusSegments', () => {
	test('orders the segments the way the ring draws them and drops the empty statuses', () => {
		const segments = buildStatusSegments([
			{ status: 'REDO', count: 2 },
			{ status: 'NEW', count: 37 },
			{ status: 'UPCOMING', count: 0 },
			{ status: 'ACTIVE', count: 6 }
		], 'MOVIE');

		expect(segments.map((segment) => {
			return segment.key;
		})).toEqual([ 'NEW', 'ACTIVE', 'REDO' ]);
		expect(segments.map((segment) => {
			return segment.count;
		})).toEqual([ 37, 6, 2 ]);
		expect(segments[1].label).toBe(i18n.t('mediaItem.stats.byStatus.values.ACTIVE.MOVIE'));
		expect(segments[0].className).toBe('media-items-stats-status-new');
	});
});

describe('buildImportanceBoxes', () => {
	const entries: MediaItemsStatsImportanceAndOwnPlatformInternal[] = [
		{ importance: '400', ownPlatformId: 'netflix-id', count: 2 },
		{ importance: '400', ownPlatformId: undefined, count: 1 },
		{ importance: '200', ownPlatformId: 'blu-ray-id', count: 9 },
		{ importance: '200', ownPlatformId: 'deleted-id', count: 3 }
	];

	test('keeps the four levels in the app order and totals each of them', () => {
		const boxes = buildImportanceBoxes(entries, ownPlatforms);

		expect(boxes.map((box) => {
			return box.key;
		})).toEqual([ '400', '300', '200', '100' ]);
		expect(boxes.map((box) => {
			return box.total;
		})).toEqual([ 3, 0, 12, 0 ]);
		expect(boxes[1].rows).toEqual([]);
	});

	test('puts the "not owned" bucket last and resolves the own platform names', () => {
		const boxes = buildImportanceBoxes(entries, ownPlatforms);

		expect(boxes[0].rows.map((row) => {
			return row.label;
		})).toEqual([ 'Netflix', i18n.t('mediaItem.stats.byPlatform.noOwnPlatform') ]);
		expect(boxes[2].rows.map((row) => {
			return row.label;
		})).toEqual([ 'Blu-ray', i18n.t('mediaItem.list.filter.values.ownPlatform.unknown', { id: 'deleted-id' }) ]);
	});

	test('leaves out the own platforms that have nothing left at a level', () => {
		const boxes = buildImportanceBoxes(entries, ownPlatforms);

		expect(boxes[0].rows.map((row) => {
			return row.key;
		})).not.toContain('blu-ray-id');
		expect(boxes[2].rows.map((row) => {
			return row.key;
		})).not.toContain('netflix-id');
	});
});
