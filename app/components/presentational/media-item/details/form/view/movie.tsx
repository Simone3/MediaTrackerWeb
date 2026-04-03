import { ReactElement } from 'react';
import { inlineTextToInputValue, inputValueToInlineText, inputValueToNumber, MediaItemActionButton, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { TextInputComponent } from 'app/components/presentational/generic/text-input';
import { config } from 'app/config/config';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { FormikProps } from 'formik';
import justWatchIcon from 'app/resources/images/ic_justwatch.png';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all movie form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const MovieFormViewComponent = (props: MovieFormViewComponentProps): ReactElement => {
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
		<MediaItemFormViewComponent<MovieInternal>
			{...props}
			extraActionButtons={extraActionButtons}
			primarySpecificFields={[
				<div className='media-item-details-field' key='durationMinutes'>
					<label className='media-item-details-label' htmlFor='media-item-duration-minutes'>
						{i18n.t('mediaItem.details.placeholders.duration.MOVIE')}
					</label>
					<TextInputComponent
						id='media-item-duration-minutes'
						type='number'
						value={numberToInputValue(props.values.durationMinutes)}
						onChange={(event) => {
							void props.setFieldValue('durationMinutes', inputValueToNumber(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field' key='directors'>
					<label className='media-item-details-label' htmlFor='media-item-movie-directors'>
						{i18n.t('mediaItem.details.placeholders.creators.MOVIE')}
					</label>
					<TextInputComponent
						id='media-item-movie-directors'
						type='text'
						value={inlineTextToInputValue(props.values.directors)}
						onChange={(event) => {
							void props.setFieldValue('directors', inputValueToInlineText(event.target.value));
						}}
					/>
				</div>
			]}
		/>
	);
};

/**
 * MovieFormViewComponent's props
 */
export type MovieFormViewComponentProps = FormikProps<MovieInternal> & MediaItemFormViewComponentCommonInput & MediaItemFormViewComponentCommonOutput<MovieInternal>;
