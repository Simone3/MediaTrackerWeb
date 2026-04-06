import { format } from 'date-fns';
import React, { CSSProperties, ReactElement } from 'react';
import { config } from 'app/config/config';
import { MediaItemRowData } from 'app/components/presentational/media-item/list/row/data/media-item';
import { buildOwnPlatformMaskStyle } from 'app/components/presentational/own-platform/common/icon-registry';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemImportanceInternal, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import actionMoreIcon from 'app/resources/images/ic_action_more.svg';
import importanceOneIcon from 'app/resources/images/ic_importance_1.svg';
import importanceTwoIcon from 'app/resources/images/ic_importance_2.svg';
import importanceThreeIcon from 'app/resources/images/ic_importance_3.svg';
import importanceFourIcon from 'app/resources/images/ic_importance_4.svg';
import statusCompleteIcon from 'app/resources/images/ic_status_complete.svg';
import statusRedoingIcon from 'app/resources/images/ic_status_redoing.svg';
import statusUpcomingIcon from 'app/resources/images/ic_status_upcoming.svg';
import { i18n } from 'app/utilities/i18n';

const MEDIA_ITEM_PLATFORM_UNOWNED_COLOR = 'var(--color-media-item-platform-unowned)';
const MEDIA_ITEM_STATUS_ICON_COLOR = 'var(--color-media-item-status-icon)';
const MEDIA_ITEM_STATUS_ACTIVE_COLOR = 'var(--color-media-item-status-active)';
const MEDIA_ITEM_STATUS_ACTIVE_COMPLETE_COLOR = 'var(--color-media-item-status-active-complete)';
const MEDIA_ITEM_STATUS_UPCOMING_COLOR = 'var(--color-media-item-status-upcoming)';
const MEDIA_ITEM_STATUS_REDO_COLOR = 'var(--color-media-item-status-redo)';
const MEDIA_ITEM_STATUS_COMPLETE_COLOR = 'var(--color-media-item-status-complete)';
const MEDIA_ITEM_STATUS_NEW_COLOR = 'var(--color-media-item-status-new)';

const importanceIcons: Record<MediaItemImportanceInternal, string> = {
	400: importanceOneIcon,
	300: importanceTwoIcon,
	200: importanceThreeIcon,
	100: importanceFourIcon
};

/**
 * Helper to build the masked icon styles
 * @param icon the icon asset path
 * @param color the icon color
 * @returns the CSS properties
 */
const getMaskedIconStyle = (icon: string, color: string): MaskedIconStyle => {
	return {
		'--media-item-row-icon-url': `url(${icon})`,
		'--media-item-row-icon-color': color
	};
};

/**
 * Helper to build the third text row
 * @param mediaItem the media item
 * @returns the row text, if any
 */
const getThirdRow = (mediaItem: MediaItemInternal): string | undefined => {
	if(mediaItem.status === 'COMPLETE' && mediaItem.completedOn && mediaItem.completedOn.length > 0) {
		const completionDates = mediaItem.completedOn;
		const lastCompletionDate = format(completionDates[completionDates.length - 1], config.ui.dateFormat);

		if(completionDates.length === 1) {
			return i18n.t('mediaItem.list.completed.single', { date: lastCompletionDate });
		}

		return i18n.t('mediaItem.list.completed.multiple', {
			times: completionDates.length,
			date: lastCompletionDate
		});
	}

	if(mediaItem.genres && mediaItem.genres.length > 0) {
		return mediaItem.genres.join(', ');
	}

	return undefined;
};

/**
 * Helper to build the fourth text row
 * @param mediaItem the media item
 * @returns the row text, if any
 */
const getFourthRow = (mediaItem: MediaItemInternal): string | undefined => {
	if(mediaItem.group && mediaItem.orderInGroup) {
		return i18n.t('mediaItem.list.group', {
			order: mediaItem.orderInGroup,
			groupName: mediaItem.group.name
		});
	}

	return undefined;
};

/**
 * Helper to build the second text row
 * @param mediaItem the media item
 * @param rowData the media-type-specific row data
 * @returns the row text, if any
 */
const getSecondRow = (mediaItem: MediaItemInternal, rowData: MediaItemRowData): string | undefined => {
	const values: string[] = [];

	if(mediaItem.releaseDate) {
		values.push(String(mediaItem.releaseDate.getFullYear()));
	}

	if(rowData.durationLabel) {
		values.push(rowData.durationLabel);
	}

	values.push(...rowData.secondaryMetadataMarkers);

	if(rowData.creatorNames && rowData.creatorNames.length > 0) {
		values.push(rowData.creatorNames.join(', '));
	}

	return values.length > 0 ? values.join(' • ') : undefined;
};

/**
 * Helper to render the row detail lines
 * @param mediaItem the media item
 * @param rowData the media-type-specific row data
 * @returns the detail rows
 */
const getDetailRows = (mediaItem: MediaItemInternal, rowData: MediaItemRowData): MediaItemRowDetail[] => {
	const detailRows: MediaItemRowDetail[] = [];
	const secondRow = getSecondRow(mediaItem, rowData);
	const thirdRow = getThirdRow(mediaItem);
	const fourthRow = getFourthRow(mediaItem);

	if(secondRow) {
		detailRows.push({
			value: secondRow,
			emphasized: false
		});
	}

	if(thirdRow) {
		detailRows.push({
			value: thirdRow,
			emphasized: true
		});
	}

	if(fourthRow) {
		detailRows.push({
			value: fourthRow,
			emphasized: true
		});
	}

	return detailRows;
};

/**
 * Helper to choose the status icon
 * @param mediaItem the media item
 * @param rowData the media-type-specific row data
 * @returns the icon asset path
 */
const getStatusIcon = (mediaItem: MediaItemInternal, rowData: MediaItemRowData): string => {
	switch(mediaItem.status) {
		case 'ACTIVE':
			return rowData.activeStatusIcon;

		case 'UPCOMING':
			return statusUpcomingIcon;

		case 'REDO':
			return statusRedoingIcon;

		case 'COMPLETE':
			return statusCompleteIcon;

		case 'NEW':
			return importanceIcons[mediaItem.importance];

		default:
			throw AppError.GENERIC.withDetails(`Status not recognized for media item status icon`);
	}
};

/**
 * Helper to define the status circle colors
 * @param mediaItem the media item
 * @param rowData the media-type-specific row data
 * @returns the status colors
 */
const getStatusColors = (mediaItem: MediaItemInternal, rowData: MediaItemRowData): IconColors => {
	switch(mediaItem.status) {
		case 'ACTIVE': {
			const activeColor = rowData.hasRemainingActiveProgress ? MEDIA_ITEM_STATUS_ACTIVE_COLOR : MEDIA_ITEM_STATUS_ACTIVE_COMPLETE_COLOR;

			return {
				icon: MEDIA_ITEM_STATUS_ICON_COLOR,
				background: activeColor,
				border: activeColor
			};
		}

		case 'UPCOMING':
			return {
				icon: MEDIA_ITEM_STATUS_ICON_COLOR,
				background: MEDIA_ITEM_STATUS_UPCOMING_COLOR,
				border: MEDIA_ITEM_STATUS_UPCOMING_COLOR
			};

		case 'REDO':
			return {
				icon: MEDIA_ITEM_STATUS_ICON_COLOR,
				background: MEDIA_ITEM_STATUS_REDO_COLOR,
				border: MEDIA_ITEM_STATUS_REDO_COLOR
			};

		case 'COMPLETE':
			return {
				icon: MEDIA_ITEM_STATUS_ICON_COLOR,
				background: MEDIA_ITEM_STATUS_COMPLETE_COLOR,
				border: MEDIA_ITEM_STATUS_COMPLETE_COLOR
			};

		case 'NEW':
			return {
				icon: MEDIA_ITEM_STATUS_ICON_COLOR,
				background: MEDIA_ITEM_STATUS_NEW_COLOR,
				border: MEDIA_ITEM_STATUS_NEW_COLOR
			};

		default:
			throw AppError.GENERIC.withDetails(`Status not recognized for media item status icon colors`);
	}
};

/**
 * Helper to define the left-side accent color
 * @param mediaItem the media item
 * @param statusColors the already computed status colors
 * @returns the accent color
 */
const getRowAccentColor = (mediaItem: MediaItemInternal, statusColors: IconColors): string => {
	return mediaItem.status === 'NEW' ? 'transparent' : statusColors.background;
};

/**
 * Presentational component to display a generic media item row
 * @param props the input/output props
 * @returns the component
 */
export const MediaItemRowViewComponent = (props: MediaItemRowViewComponentProps): ReactElement => {
	const detailRows = getDetailRows(props.mediaItem, props.rowData);
	const ownPlatform = props.mediaItem.ownPlatform;
	const ownPlatformColor = ownPlatform ? ownPlatform.color : MEDIA_ITEM_PLATFORM_UNOWNED_COLOR;
	const statusColors = getStatusColors(props.mediaItem, props.rowData);
	const statusIcon = getStatusIcon(props.mediaItem, props.rowData);
	const cardClassName = props.highlighted ? 'media-item-row media-item-row-highlighted' : 'media-item-row';

	return (
		<li
			className={cardClassName}
			style={{ '--media-item-row-accent': getRowAccentColor(props.mediaItem, statusColors) } as CSSProperties}>
			<button
				type='button'
				className='media-item-row-main'
				onClick={props.open}>
				<span
					className='media-item-row-platform'
					role='img'
					aria-label={ownPlatform ?
						i18n.t('mediaItem.list.accessibility.ownPlatform.owned', { name: ownPlatform.name }) :
						i18n.t('mediaItem.list.accessibility.ownPlatform.notOwned')}>
					<span className='media-item-row-platform-shell' aria-hidden={true}>
						{ownPlatform && (
							<span
								className='media-item-row-icon media-item-row-platform-icon'
								style={buildOwnPlatformMaskStyle(
									ownPlatform.icon,
									ownPlatformColor,
									'--media-item-row-icon-url',
									'--media-item-row-icon-color'
								)}
								aria-hidden={true}
							/>
						)}
					</span>
				</span>
				<span className='media-item-row-data'>
					<span className='media-item-row-name'>{props.mediaItem.name}</span>
					{detailRows.map((detailRow, index) => {
						return (
							<span
								key={`detail-row-${index}`}
								className={`media-item-row-detail${detailRow.emphasized ? ' media-item-row-detail-emphasis' : ''}`}>
								{detailRow.value}
							</span>
						);
					})}
				</span>
			</button>
			<div className='media-item-row-secondary'>
				<span
					className='media-item-row-status'
					role='img'
					aria-label={props.rowData.statusLabel}
					style={{
						backgroundColor: statusColors.background,
						borderColor: statusColors.border
					}}>
					<span
						className='media-item-row-icon media-item-row-status-icon'
						style={getMaskedIconStyle(statusIcon, statusColors.icon)}
						aria-hidden={true}
					/>
				</span>
				<button
					type='button'
					className='media-item-row-options'
					onClick={(event) => {
						props.showOptionsMenu(event.currentTarget.getBoundingClientRect());
					}}
					aria-label={i18n.t('common.a11y.optionsFor', { name: props.mediaItem.name })}>
					<span
						className='media-item-row-icon media-item-row-options-icon'
						style={getMaskedIconStyle(actionMoreIcon, MEDIA_ITEM_STATUS_ICON_COLOR)}
						aria-hidden={true}
					/>
				</button>
			</div>
		</li>
	);
};

type MaskedIconStyle = React.CSSProperties & {
	'--media-item-row-icon-url': string;
	'--media-item-row-icon-color': string;
};

type IconColors = {
	icon: string;
	background: string;
	border: string;
};

type MediaItemRowDetail = {
	value: string;
	emphasized: boolean;
};

export type MediaItemRowComponentInput = {
	highlighted: boolean;
	mediaItem: MediaItemInternal;
};

export type MediaItemRowComponentOutput = {
	open: () => void;
	showOptionsMenu: (buttonRect: DOMRect) => void;
};

export type MediaItemRowViewComponentProps = MediaItemRowComponentInput & MediaItemRowComponentOutput & {
	rowData: MediaItemRowData;
};

export type MediaItemRowComponentProps = MediaItemRowComponentInput & MediaItemRowComponentOutput;
