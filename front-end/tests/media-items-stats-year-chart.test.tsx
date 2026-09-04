import { render } from '@testing-library/react';
import { MediaItemsStatsYearChartComponent } from 'app/components/presentational/media-item/stats/year-chart';

const series = [
	{ year: 2023, count: 2 },
	{ year: 2024, count: 0 },
	{ year: 2025, count: 5 }
];

const setViewportWidth = (value: number): void => {
	Object.defineProperty(window, 'innerWidth', {
		configurable: true,
		writable: true,
		value: value
	});
};

describe('MediaItemsStatsYearChartComponent', () => {
	const originalInnerWidth = window.innerWidth;

	afterEach(() => {
		setViewportWidth(originalInnerWidth);
	});

	test('draws in the wide coordinate space above the mobile breakpoint', () => {
		setViewportWidth(1280);

		render(
			<MediaItemsStatsYearChartComponent
				series={series}
				emptyMessage='Nothing completed yet'
			/>
		);

		expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 640 176');
	});

	// The SVG scales to the card, so the wide box on a phone would draw every label at about half the size it is written at
	test('narrows the coordinate space at or below the mobile breakpoint, and still writes every year', () => {
		setViewportWidth(640);

		render(
			<MediaItemsStatsYearChartComponent
				series={series}
				emptyMessage='Nothing completed yet'
			/>
		);

		expect(document.querySelector('svg')).toHaveAttribute('viewBox', '0 0 360 176');
		expect(document.querySelectorAll('.media-items-stats-chart-tick')).toHaveLength(series.length);
	});
});
