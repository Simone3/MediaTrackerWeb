import { Component, ReactNode } from 'react';
import { i18n } from 'app/utilities/i18n';

/**
 * The size of the donut viewBox, in pixels: the ring is a fixed-size graphic that the key wraps under when the card is narrow
 */
const DONUT_SIZE = 168;

/**
 * The thickness of the ring
 */
const DONUT_STROKE = 18;

/**
 * The gap left between two adjacent segments, in the same units as the circumference. Two of the four status colors are hard to tell
 * apart when they touch, so the ring is always drawn with its segments separated
 */
const DONUT_SEGMENT_GAP = 4;

/**
 * Presentational component that draws the backlog broken down by status, as a ring with a key beside it
 */
export class MediaItemsStatsStatusDonutComponent extends Component<MediaItemsStatsStatusDonutComponentInput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			segments,
			total,
			centreLabel,
			emptyMessage
		} = this.props;

		if(total === 0 || segments.length === 0) {
			return <p className='media-items-stats-empty'>{emptyMessage}</p>;
		}

		return (
			<div className='media-items-stats-donut-row'>
				{this.renderDonut(segments, total, centreLabel)}
				<div className='media-items-stats-donut-keys'>
					{segments.map((segment) => {
						return (
							<div key={segment.key} className='media-items-stats-donut-key'>
								<i className={`media-items-stats-donut-swatch ${segment.className}`} />
								<span className='media-items-stats-donut-key-label'>{segment.label}</span>
								<b className='media-items-stats-number'>{segment.count}</b>
								<em className='media-items-stats-donut-key-share'>
									{i18n.t('mediaItem.stats.byStatus.share', { value: Math.round((segment.count / total) * 100) })}
								</em>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	/**
	 * Helper method to render the ring itself, as a stack of dashed circles whose dash is the arc of one segment
	 * @param segments the segments to draw, in the order they must sit in the ring
	 * @param total the backlog total the segments add up to
	 * @param centreLabel the phrase written under the total in the middle of the ring
	 * @returns the node portion
	 */
	private renderDonut(segments: MediaItemsStatsStatusDonutSegment[], total: number, centreLabel: string): ReactNode {
		const radius = (DONUT_SIZE - DONUT_STROKE) / 2;
		const circumference = 2 * Math.PI * radius;
		const gap = segments.length > 1 ? DONUT_SEGMENT_GAP : 0;
		let offset = 0;

		return (
			<div className='media-items-stats-donut' style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
				<svg
					viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
					width={DONUT_SIZE}
					height={DONUT_SIZE}
					role='img'
					aria-label={`${centreLabel}: ${total}`}>
					<circle
						className='media-items-stats-donut-track'
						cx={DONUT_SIZE / 2}
						cy={DONUT_SIZE / 2}
						r={radius}
						fill='none'
						strokeWidth={DONUT_STROKE}
					/>
					{segments.map((segment) => {
						const length = circumference * (segment.count / total);
						const dash = Math.max(0, length - gap);
						const segmentOffset = offset;
						offset += length;

						return (
							<circle
								key={segment.key}
								className={`media-items-stats-donut-segment ${segment.className}`}
								cx={DONUT_SIZE / 2}
								cy={DONUT_SIZE / 2}
								r={radius}
								fill='none'
								strokeWidth={DONUT_STROKE}
								strokeDasharray={`${dash} ${circumference - dash}`}
								strokeDashoffset={-segmentOffset}
								transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
							/>
						);
					})}
				</svg>
				<div className='media-items-stats-donut-centre'>
					<strong>{total}</strong>
					<span>{centreLabel}</span>
				</div>
			</div>
		);
	}
}

/**
 * One segment of the backlog donut and of its key
 */
export type MediaItemsStatsStatusDonutSegment = {
	/**
	 * The identifier of the segment, unique within the ring
	 */
	key: string;

	/**
	 * The user-readable segment name
	 */
	label: string;

	/**
	 * The number of backlog media items the segment stands for
	 */
	count: number;

	/**
	 * The CSS class that paints the segment and its swatch, so that the status colors stay in the stylesheet with every other token
	 */
	className: string;
};

/**
 * MediaItemsStatsStatusDonutComponent's input props
 */
export type MediaItemsStatsStatusDonutComponentInput = {
	/**
	 * The segments, in the order they must sit in the ring, without the ones that have nothing in them
	 */
	segments: MediaItemsStatsStatusDonutSegment[];

	/**
	 * The backlog total the segments add up to
	 */
	total: number;

	/**
	 * The phrase written under the total in the middle of the ring, e.g. "to watch"
	 */
	centreLabel: string;

	/**
	 * The copy shown in place of the ring when there is nothing left to draw
	 */
	emptyMessage: string;
};
