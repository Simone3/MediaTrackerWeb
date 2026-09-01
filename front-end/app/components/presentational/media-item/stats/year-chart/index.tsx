import { Component, CSSProperties, ReactNode } from 'react';
import { MediaItemsStatsYearInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';

/**
 * The width of the chart viewBox. The SVG scales to the card, so this is a coordinate space and not a pixel size
 */
const CHART_WIDTH = 640;

/**
 * The height of the chart viewBox
 */
const CHART_HEIGHT = 176;

/**
 * The vertical coordinate of the axis the bars stand on, leaving room for the year labels underneath
 */
const CHART_BASELINE = CHART_HEIGHT - 24;

/**
 * The tallest a bar can be, leaving room for the value written above it
 */
const CHART_MAX_BAR_HEIGHT = CHART_BASELINE - 22;

/**
 * The height a year with no completion gets: a sliver rather than nothing, so that a dry year still reads as a year
 */
const CHART_EMPTY_BAR_HEIGHT = 2;

/**
 * The smallest a bar can be once it has something in it, so that the shortest year next to a very tall one is still a bar
 */
const CHART_MIN_BAR_HEIGHT = 4;

/**
 * The narrowest a year label can be before the labels start colliding: below this, only some of the years are written
 */
const CHART_MIN_LABEL_SLOT = 34;

/**
 * The narrowest a bar can be before the value written above it starts colliding with its neighbours: below this, only the tallest
 * bar keeps its value and the rest are read from the tooltip
 */
const CHART_MIN_VALUE_SLOT = 24;

/**
 * Presentational component that draws the completions of every year of the range as a bar chart, with a tooltip on the hovered bar
 */
export class MediaItemsStatsYearChartComponent extends Component<MediaItemsStatsYearChartComponentInput, MediaItemsStatsYearChartComponentState> {
	public state: MediaItemsStatsYearChartComponentState = {
		hoveredIndex: undefined
	};

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			series,
			emptyMessage
		} = this.props;

		if(series.length === 0) {
			return <p className='media-items-stats-empty'>{emptyMessage}</p>;
		}

		const {
			hoveredIndex
		} = this.state;
		const maxCount = Math.max(1, ...series.map((year) => {
			return year.count;
		}));
		const peakIndex = series.reduce((peak, year, index) => {
			return year.count > series[peak].count ? index : peak;
		}, 0);
		const slot = CHART_WIDTH / series.length;
		const barWidth = Math.min(56, Math.max(8, slot - 16));

		// Every year keeps its bar, but only some of them keep a written label once the bars get too narrow to hold one: the
		// tooltip still names every year, so thinning the axis out costs nothing the chart was actually saying. The step is
		// counted back from the last year rather than forward from the first, so that the year the chart ends at is always
		// written and never lands next to the one before it
		const labelStep = Math.ceil(CHART_MIN_LABEL_SLOT / slot);
		const showEveryValue = slot >= CHART_MIN_VALUE_SLOT;

		return (
			<div className={hoveredIndex === undefined ? 'media-items-stats-chart' : 'media-items-stats-chart media-items-stats-chart-hovering'}>
				<svg
					viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
					role='img'
					aria-label={i18n.t('mediaItem.stats.perYear.accessibility')}>
					<line
						className='media-items-stats-chart-axis'
						x1={0}
						y1={CHART_BASELINE}
						x2={CHART_WIDTH}
						y2={CHART_BASELINE}
					/>
					{series.map((year, index) => {
						const barHeight = this.buildBarHeight(year.count, maxCount);
						const centre = index * slot + slot / 2;
						const barClassName = year.count === 0 ?
							'media-items-stats-chart-bar media-items-stats-chart-bar-empty' :
							'media-items-stats-chart-bar';

						return (
							<g key={year.year} className={index === hoveredIndex ? 'media-items-stats-chart-year-active' : undefined}>
								<rect
									className={barClassName}
									x={centre - barWidth / 2}
									y={CHART_BASELINE - barHeight}
									width={barWidth}
									height={barHeight}
									rx={4}
								/>
								{year.count > 0 && (showEveryValue || index === peakIndex) && (
									<text
										className={index === peakIndex ?
											'media-items-stats-chart-value media-items-stats-chart-value-peak' :
											'media-items-stats-chart-value'}
										x={centre}
										y={CHART_BASELINE - barHeight - 8}
										textAnchor='middle'>
										{year.count}
									</text>
								)}
								{(series.length - 1 - index) % labelStep === 0 && (
									<text
										className='media-items-stats-chart-tick'
										x={centre}
										y={CHART_HEIGHT - 6}
										textAnchor='middle'>
										{year.year}
									</text>
								)}
								<rect
									className='media-items-stats-chart-hit-area'
									x={index * slot}
									y={0}
									width={slot}
									height={CHART_BASELINE}
									onMouseEnter={() => {
										this.setState({
											hoveredIndex: index
										});
									}}
									onMouseLeave={() => {
										this.setState({
											hoveredIndex: undefined
										});
									}}
								/>
							</g>
						);
					})}
				</svg>
				{hoveredIndex !== undefined && this.renderTooltip(series[hoveredIndex], hoveredIndex, series.length, maxCount)}
			</div>
		);
	}

	/**
	 * Helper method to render the tooltip of the hovered bar. The SVG scales with a fixed aspect ratio, so a viewBox coordinate is
	 * the same fraction of the container as it is of the viewBox and the tooltip can be placed in percentages alone
	 * @param year the hovered year
	 * @param index the index of the hovered year
	 * @param yearsCount the number of years in the chart
	 * @param maxCount the completions of the tallest year
	 * @returns the node portion
	 */
	private renderTooltip(year: MediaItemsStatsYearInternal, index: number, yearsCount: number, maxCount: number): ReactNode {
		const style: CSSProperties = {
			left: `${((index + 0.5) / yearsCount) * 100}%`,
			top: `${((CHART_BASELINE - this.buildBarHeight(year.count, maxCount)) / CHART_HEIGHT) * 100}%`
		};

		return (
			<div className='media-items-stats-chart-tooltip' style={style} aria-hidden={true}>
				{i18n.t('mediaItem.stats.perYear.tooltip', { year: year.year, count: year.count })}
			</div>
		);
	}

	/**
	 * Helper to scale a year onto the chart
	 * @param count the completions of the year
	 * @param maxCount the completions of the tallest year
	 * @returns the bar height, in viewBox units
	 */
	private buildBarHeight(count: number, maxCount: number): number {
		if(count === 0) {
			return CHART_EMPTY_BAR_HEIGHT;
		}

		return Math.max(CHART_MIN_BAR_HEIGHT, (count / maxCount) * CHART_MAX_BAR_HEIGHT);
	}
}

/**
 * MediaItemsStatsYearChartComponent's input props
 */
export type MediaItemsStatsYearChartComponentInput = {
	/**
	 * The completions of every year of the range, including the years that have none
	 */
	series: MediaItemsStatsYearInternal[];

	/**
	 * The copy shown in place of the chart when there is nothing to draw
	 */
	emptyMessage: string;
};

type MediaItemsStatsYearChartComponentState = {
	hoveredIndex: number | undefined;
};
