import { config } from 'app/config/config';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MediaItemImportanceInternal, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { OwnPlatformIconInternal } from 'app/data/models/internal/own-platform';
import actionMoreIcon from 'app/resources/images/ic_action_more.png';
import importanceOneIcon from 'app/resources/images/ic_importance_1.png';
import importanceTwoIcon from 'app/resources/images/ic_importance_2.png';
import importanceThreeIcon from 'app/resources/images/ic_importance_3.png';
import importanceFourIcon from 'app/resources/images/ic_importance_4.png';
import noneIcon from 'app/resources/images/ic_none.png';
import platformAndroidIcon from 'app/resources/images/ic_platform_android.png';
import platformAppleIcon from 'app/resources/images/ic_platform_apple.png';
import platformBookIcon from 'app/resources/images/ic_platform_book.png';
import platformDiscIcon from 'app/resources/images/ic_platform_disc.png';
import platformDisneyIcon from 'app/resources/images/ic_platform_disney.png';
import platformDownloadIcon from 'app/resources/images/ic_platform_download.png';
import platformEpicIcon from 'app/resources/images/ic_platform_epic.png';
import platformGogIcon from 'app/resources/images/ic_platform_gog.png';
import platformHuluIcon from 'app/resources/images/ic_platform_hulu.png';
import platformKindleIcon from 'app/resources/images/ic_platform_kindle.png';
import platformNetflixIcon from 'app/resources/images/ic_platform_netflix.png';
import platformOriginIcon from 'app/resources/images/ic_platform_origin.png';
import platformPlaystationIcon from 'app/resources/images/ic_platform_playstation.png';
import platformSteamIcon from 'app/resources/images/ic_platform_steam.png';
import platformSwitchIcon from 'app/resources/images/ic_platform_switch.png';
import platformUplayIcon from 'app/resources/images/ic_platform_uplay.png';
import ownPlatformDefaultIcon from 'app/resources/images/ic_input_own_platform.png';
import statusCompleteIcon from 'app/resources/images/ic_status_complete.png';
import statusPlayingIcon from 'app/resources/images/ic_status_playing.png';
import statusReadingIcon from 'app/resources/images/ic_status_reading.png';
import statusRedoingIcon from 'app/resources/images/ic_status_redoing.png';
import statusUpcomingIcon from 'app/resources/images/ic_status_upcoming.png';
import statusWatchingIcon from 'app/resources/images/ic_status_watching.png';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';
import { format } from 'date-fns';
import React, { ReactElement } from 'react';

const ownPlatformIcons: Record<OwnPlatformIconInternal, string> = {
	default: ownPlatformDefaultIcon,
	android: platformAndroidIcon,
	apple: platformAppleIcon,
	book: platformBookIcon,
	disc: platformDiscIcon,
	disney: platformDisneyIcon,
	download: platformDownloadIcon,
	epic: platformEpicIcon,
	gog: platformGogIcon,
	hulu: platformHuluIcon,
	kindle: platformKindleIcon,
	netflix: platformNetflixIcon,
	origin: platformOriginIcon,
	playstation: platformPlaystationIcon,
	steam: platformSteamIcon,
	switch: platformSwitchIcon,
	uplay: platformUplayIcon
};

const activeStatusIcons: Record<MediaTypeInternal, string> = {
	BOOK: statusReadingIcon,
	MOVIE: statusWatchingIcon,
	TV_SHOW: statusWatchingIcon,
	VIDEOGAME: statusPlayingIcon
};

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
 * Helper to get creator names without importing the controller layer
 * @param mediaItem the media item
 * @returns the creator names, if any
 */
const getCreatorNames = (mediaItem: MediaItemInternal): string[] | undefined => {
	switch(mediaItem.mediaType) {
		case 'BOOK':
			return (mediaItem as BookInternal).authors;

		case 'MOVIE':
			return (mediaItem as MovieInternal).directors;

		case 'TV_SHOW':
			return (mediaItem as TvShowInternal).creators;

		case 'VIDEOGAME':
			return (mediaItem as VideogameInternal).developers;

		default:
			throw AppError.GENERIC.withDetails(`Media type ${mediaItem.mediaType} not recognized for media item creators`);
	}
};

/**
 * Helper to get the duration value without importing the controller layer
 * @param mediaItem the media item
 * @returns the duration value, if any
 */
const getDurationValue = (mediaItem: MediaItemInternal): number | undefined => {
	switch(mediaItem.mediaType) {
		case 'BOOK':
			return (mediaItem as BookInternal).pagesNumber;

		case 'MOVIE':
			return (mediaItem as MovieInternal).durationMinutes;

		case 'TV_SHOW':
			return (mediaItem as TvShowInternal).averageEpisodeRuntimeMinutes;

		case 'VIDEOGAME':
			return (mediaItem as VideogameInternal).averageLengthHours;

		default:
			throw AppError.GENERIC.withDetails(`Media type ${mediaItem.mediaType} not recognized for media item duration`);
	}
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
 * @returns the row text, if any
 */
const getSecondRow = (mediaItem: MediaItemInternal): string | undefined => {
	const duration = getDurationValue(mediaItem);
	const creators = getCreatorNames(mediaItem);
	const values: string[] = [];

	if(mediaItem.releaseDate) {
		values.push(String(mediaItem.releaseDate.getFullYear()));
	}

	if(duration) {
		values.push(i18n.t(`mediaItem.list.duration.${mediaItem.mediaType}`, { duration: duration }));
	}

	if(mediaItem.mediaType === 'TV_SHOW' && (mediaItem as TvShowInternal).inProduction) {
		values.push(i18n.t('mediaItem.list.production'));
	}

	if(creators && creators.length > 0) {
		values.push(creators.join(', '));
	}

	return values.length > 0 ? values.join(' • ') : undefined;
};

/**
 * Helper to render the row detail lines
 * @param mediaItem the media item
 * @returns the detail rows
 */
const getDetailRows = (mediaItem: MediaItemInternal): MediaItemRowDetail[] => {
	const detailRows: MediaItemRowDetail[] = [];
	const secondRow = getSecondRow(mediaItem);
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
 * @returns the icon asset path
 */
const getStatusIcon = (mediaItem: MediaItemInternal): string => {
	switch(mediaItem.status) {
		case 'ACTIVE':
			return activeStatusIcons[mediaItem.mediaType];

		case 'UPCOMING':
			return statusUpcomingIcon;

		case 'REDO':
			return statusRedoingIcon;

		case 'COMPLETE':
			return statusCompleteIcon;

		case 'NEW':
			return importanceIcons[mediaItem.importance];

		default:
			throw AppError.GENERIC.withDetails(`Status ${mediaItem.status} not recognized for media item status icon`);
	}
};

/**
 * Helper to define the status circle colors
 * @param mediaItem the media item
 * @returns the status colors
 */
const getStatusColors = (mediaItem: MediaItemInternal): IconColors => {
	switch(mediaItem.status) {
		case 'ACTIVE':
			if(mediaItem.mediaType === 'TV_SHOW') {
				const tvShow = mediaItem as TvShowInternal;
				if(mediaItemUtils.getTvShowCounters(tvShow.seasons).episodesToWatchNumber <= 0) {
					return {
						icon: config.ui.colors.white,
						background: config.ui.colors.lightGrey,
						border: config.ui.colors.lightGrey
					};
				}
			}

			return {
				icon: config.ui.colors.white,
				background: config.ui.colors.green,
				border: config.ui.colors.green
			};

		case 'UPCOMING':
			return {
				icon: config.ui.colors.white,
				background: config.ui.colors.orange,
				border: config.ui.colors.orange
			};

		case 'REDO':
			return {
				icon: config.ui.colors.white,
				background: config.ui.colors.cyan,
				border: config.ui.colors.cyan
			};

		case 'COMPLETE':
			return {
				icon: config.ui.colors.white,
				background: config.ui.colors.purple,
				border: config.ui.colors.purple
			};

		case 'NEW':
			return {
				icon: config.ui.colors.black,
				background: config.ui.colors.white,
				border: config.ui.colors.black
			};

		default:
			throw AppError.GENERIC.withDetails(`Status ${mediaItem.status} not recognized for media item status icon colors`);
	}
};

/**
 * Helper to define an accessible label for the status icon
 * @param mediaItem the media item
 * @returns the label
 */
const getStatusLabel = (mediaItem: MediaItemInternal): string => {
	switch(mediaItem.status) {
		case 'ACTIVE':
			return i18n.t(`mediaItem.list.markActive.${mediaItem.mediaType}`);

		case 'COMPLETE':
			return i18n.t(`mediaItem.list.markComplete.${mediaItem.mediaType}`);

		case 'REDO':
			return i18n.t(`mediaItem.list.markRedo.${mediaItem.mediaType}`);

		case 'UPCOMING':
			return 'Upcoming';

		case 'NEW':
			return i18n.t(`mediaItem.common.importance.${mediaItem.importance}`);

		default:
			throw AppError.GENERIC.withDetails(`Status ${mediaItem.status} not recognized for media item status label`);
	}
};

/**
 * Presentational component to display a media item row
 * @param props the input/output props
 * @returns the component
 */
export const MediaItemRowComponent = (props: MediaItemRowComponentInput & MediaItemRowComponentOutput): ReactElement => {
	const detailRows = getDetailRows(props.mediaItem);
	const ownPlatform = props.mediaItem.ownPlatform;
	const ownPlatformIcon = ownPlatform ? ownPlatformIcons[ownPlatform.icon] : noneIcon;
	const ownPlatformColor = ownPlatform ? ownPlatform.color : config.ui.colors.grey;
	const statusColors = getStatusColors(props.mediaItem);
	const statusIcon = getStatusIcon(props.mediaItem);

	return (
		<li className='media-item-row'>
			<button
				type='button'
				className='media-item-row-main'
				onClick={props.open}>
				<span
					className='media-item-row-platform'
					role='img'
					aria-label={ownPlatform ? `Owned at ${ownPlatform.name}` : 'Not owned on any platform'}>
					<span
						className='media-item-row-icon media-item-row-platform-icon'
						style={getMaskedIconStyle(ownPlatformIcon, ownPlatformColor)}
						aria-hidden={true}
					/>
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
					aria-label={getStatusLabel(props.mediaItem)}
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
					onClick={props.showOptionsMenu}
					aria-label={`Options for ${props.mediaItem.name}`}>
					<span
						className='media-item-row-icon media-item-row-options-icon'
						style={getMaskedIconStyle(actionMoreIcon, config.ui.colors.black)}
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

type MediaItemRowComponentInput = {
	mediaItem: MediaItemInternal;
};

type MediaItemRowComponentOutput = {
	open: () => void;
	showOptionsMenu: () => void;
};
