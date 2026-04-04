import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { InputComponent } from 'app/components/presentational/generic/input';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { dateToInputValue, inlineTextToInputValue, inputValueToDate, inputValueToInlineText, inputValueToNumber, MediaItemActionButton, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { config } from 'app/config/config';
import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import justWatchIcon from 'app/resources/images/ic_justwatch.png';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

/**
 * Builds the TV show seasons summary line
 * @param seasons TV show seasons
 * @returns summary label
 */
const getTvShowSeasonsSummaryLabel = (seasons?: TvShowSeasonInternal[]): string => {
	if(!seasons || seasons.length === 0) {
		return i18n.t('tvShowSeason.list.empty');
	}

	const counters = mediaItemUtils.getTvShowCounters(seasons);
	return i18n.t('mediaItem.details.labels.seasons', {
		seasonsNumber: counters.seasonsNumber,
		episodesNumber: counters.episodesNumber,
		watchedEpisodesNumber: counters.watchedEpisodesNumber
	});
};

/**
 * Presentational component that contains all TV show form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const TvShowFormViewComponent = (props: TvShowFormViewComponentProps): ReactElement => {
	const seasonsSummary = getTvShowSeasonsSummaryLabel(props.values.seasons);
	const extraActionButtons: MediaItemActionButton[] = [
		{
			key: 'just-watch',
			label: i18n.t('mediaItem.details.buttons.justWatch'),
			icon: justWatchIcon,
			disabled: !props.values.name,
			onClick: () => {
				window.open(config.external.justWatchSearch(encodeURIComponent(props.values.name)), '_blank', 'noopener,noreferrer');
			}
		}
	];

	return (
		<MediaItemFormViewComponent<TvShowInternal>
			{...props}
			extraActionButtons={extraActionButtons}
			primarySpecificFields={[
				<div className='media-item-details-field' key='averageEpisodeRuntimeMinutes'>
					<label className='media-item-details-label' htmlFor='media-item-episode-runtime'>
						{i18n.t('mediaItem.details.placeholders.duration.TV_SHOW')}
					</label>
					<InputComponent
						id='media-item-episode-runtime'
						type='number'
						value={numberToInputValue(props.values.averageEpisodeRuntimeMinutes)}
						onChange={(event) => {
							void props.setFieldValue('averageEpisodeRuntimeMinutes', inputValueToNumber(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field' key='creators'>
					<label className='media-item-details-label' htmlFor='media-item-tv-show-creators'>
						{i18n.t('mediaItem.details.placeholders.creators.TV_SHOW')}
					</label>
					<InputComponent
						id='media-item-tv-show-creators'
						type='text'
						value={inlineTextToInputValue(props.values.creators)}
						onChange={(event) => {
							void props.setFieldValue('creators', inputValueToInlineText(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field media-item-details-field-span-2' key='seasons'>
					<label className='media-item-details-label' htmlFor='media-item-tv-show-seasons-handler'>
						{i18n.t('mediaItem.details.placeholders.seasons')}
					</label>
					<div className='media-item-details-tv-show-inline-row media-item-details-tv-show-seasons-row'>
						<PillButtonComponent
							id='media-item-tv-show-seasons-handler'
							tone='secondary'
							className='media-item-details-inline-button'
							onClick={() => {
								props.handleTvShowSeasons(props.values.seasons);
							}}>
							{i18n.t('tvShowSeason.list.title')}
						</PillButtonComponent>
						<p className='media-item-details-inline-hint'>{seasonsSummary}</p>
					</div>
				</div>,
				<div className='media-item-details-field media-item-details-field-span-2' key='production'>
					<div className='media-item-details-tv-show-inline-row media-item-details-tv-show-production-row'>
						<div className='media-item-details-tv-show-production-field'>
							<label className='media-item-details-label' htmlFor='media-item-in-production'>
								{i18n.t('mediaItem.details.placeholders.production')}
							</label>
							<label className='media-item-details-checkbox-row' htmlFor='media-item-in-production'>
								<input
									id='media-item-in-production'
									className='media-item-details-checkbox'
									type='checkbox'
									checked={Boolean(props.values.inProduction)}
									onChange={(event) => {
										const inProduction = event.target.checked;

										void props.setValues({
											...props.values,
											inProduction: inProduction,
											nextEpisodeAirDate: inProduction ? props.values.nextEpisodeAirDate : undefined
										});
									}}
								/>
								<span className='media-item-details-checkbox-label'>{i18n.t('mediaItem.details.placeholders.inProduction')}</span>
							</label>
						</div>
						{props.values.inProduction && (
							<div className='media-item-details-tv-show-next-episode-field'>
								<label className='media-item-details-label' htmlFor='media-item-next-episode-air-date'>
									{i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate')}
								</label>
								<InputComponent
									id='media-item-next-episode-air-date'
									type='date'
									value={dateToInputValue(props.values.nextEpisodeAirDate)}
									onChange={(event) => {
										void props.setFieldValue('nextEpisodeAirDate', inputValueToDate(event.target.value));
									}}
								/>
							</div>
						)}
					</div>
				</div>
			]}
		/>
	);
};

/**
 * TvShowFormViewComponent's input props
 */
export type TvShowFormViewComponentProps = FormikProps<TvShowInternal> & MediaItemFormViewComponentCommonInput & MediaItemFormViewComponentCommonOutput<TvShowInternal> & {
	/**
	 * Callback to open TV show seasons flow
	 */
	handleTvShowSeasons: (currentSeasons?: TvShowSeasonInternal[]) => void;
};
