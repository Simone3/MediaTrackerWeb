import { Component, ReactNode } from 'react';
import { i18n } from 'app/utilities/i18n';

/**
 * The share of the track the smallest bar still fills, so that a platform holding one item is a mark and not an empty row
 */
const BAR_MIN_WIDTH_PERCENTAGE = 3;

/**
 * Presentational component that places the backlog on the importance and own platform grid: one box per importance level, and inside
 * each box one bar per own platform that still holds something at that level
 */
export class MediaItemsStatsImportanceBoxesComponent extends Component<MediaItemsStatsImportanceBoxesComponentInput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			boxes,
			emptyMessage
		} = this.props;

		const maxCount = Math.max(1, ...boxes.map((box) => {
			return Math.max(0, ...box.rows.map((row) => {
				return row.count;
			}));
		}));
		const isEmpty = boxes.every((box) => {
			return box.total === 0;
		});

		if(isEmpty) {
			return <p className='media-items-stats-empty'>{emptyMessage}</p>;
		}

		return (
			<div className='media-items-stats-boxes'>
				{boxes.map((box) => {
					return (
						<div
							key={box.key}
							className={box.total === 0 ? 'media-items-stats-box media-items-stats-box-empty' : 'media-items-stats-box'}>
							<div className='media-items-stats-box-head'>
								<span className='media-items-stats-box-label'>{box.label}</span>
								<b className='media-items-stats-box-total media-items-stats-number'>{box.total}</b>
							</div>
							{box.rows.length === 0 ?
								<p className='media-items-stats-empty'>{i18n.t('mediaItem.stats.byPlatform.emptyLevel')}</p> :
								<div className='media-items-stats-box-rows'>
									{box.rows.map((row) => {
										return (
											<div key={row.key} className='media-items-stats-box-row'>
												<span className='media-items-stats-box-row-name'>{row.label}</span>
												<span className='media-items-stats-box-row-track'>
													<span
														className='media-items-stats-box-row-fill'

														// Every bar of every box is scaled against the largest count anywhere in the
														// panel: that shared scale is what makes the four boxes comparable to each
														// other instead of four unrelated charts
														style={{ width: `${Math.max(BAR_MIN_WIDTH_PERCENTAGE, (row.count / maxCount) * 100)}%` }}
													/>
												</span>
												<span className='media-items-stats-box-row-value media-items-stats-number'>{row.count}</span>
											</div>
										);
									})}
								</div>}
						</div>
					);
				})}
			</div>
		);
	}
}

/**
 * One own platform row inside an importance box
 */
export type MediaItemsStatsImportanceBoxRow = {
	/**
	 * The identifier of the row, unique within the box
	 */
	key: string;

	/**
	 * The user-readable own platform name
	 */
	label: string;

	/**
	 * The number of backlog media items at this importance level on this own platform
	 */
	count: number;
};

/**
 * One importance level box
 */
export type MediaItemsStatsImportanceBox = {
	/**
	 * The identifier of the box, i.e. the importance level
	 */
	key: string;

	/**
	 * The user-readable importance level name
	 */
	label: string;

	/**
	 * The number of backlog media items at this importance level, across every own platform
	 */
	total: number;

	/**
	 * The own platforms that still hold something at this importance level, without the ones that hold nothing
	 */
	rows: MediaItemsStatsImportanceBoxRow[];
};

/**
 * MediaItemsStatsImportanceBoxesComponent's input props
 */
export type MediaItemsStatsImportanceBoxesComponentInput = {
	/**
	 * The four importance boxes, in the app's own importance order
	 */
	boxes: MediaItemsStatsImportanceBox[];

	/**
	 * The copy shown in place of the boxes when the whole backlog is empty
	 */
	emptyMessage: string;
};
