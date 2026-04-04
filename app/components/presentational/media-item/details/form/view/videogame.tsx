import { ReactElement } from 'react';
import { InputComponent } from 'app/components/presentational/generic/input';
import { inlineTextToInputValue, inputValueToInlineText, inputValueToNumber, MediaItemActionButton, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { config } from 'app/config/config';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { FormikProps } from 'formik';
import howLongToBeatIcon from 'app/resources/images/ic_howlongtobeat.png';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all videogame form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const VideogameFormViewComponent = (props: VideogameFormViewComponentProps): ReactElement => {
	const extraActionButtons: MediaItemActionButton[] = [
		{
			key: 'how-long-to-beat',
			label: i18n.t('mediaItem.details.buttons.howLongToBeat'),
			icon: howLongToBeatIcon,
			disabled: !props.values.name,
			onClick: () => {
				window.open(config.external.howLongToBeatSearch(encodeURIComponent(props.values.name)), '_blank', 'noopener,noreferrer');
			}
		}
	];

	return (
		<MediaItemFormViewComponent<VideogameInternal>
			{...props}
			extraActionButtons={extraActionButtons}
			primarySpecificFields={[
				<div className='media-item-details-field' key='averageLengthHours'>
					<label className='media-item-details-label' htmlFor='media-item-average-length'>
						{i18n.t('mediaItem.details.placeholders.duration.VIDEOGAME')}
					</label>
					<InputComponent
						id='media-item-average-length'
						type='number'
						value={numberToInputValue(props.values.averageLengthHours)}
						onChange={(event) => {
							void props.setFieldValue('averageLengthHours', inputValueToNumber(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field' key='developers'>
					<label className='media-item-details-label' htmlFor='media-item-videogame-developers'>
						{i18n.t('mediaItem.details.placeholders.creators.VIDEOGAME')}
					</label>
					<InputComponent
						id='media-item-videogame-developers'
						type='text'
						value={inlineTextToInputValue(props.values.developers)}
						onChange={(event) => {
							void props.setFieldValue('developers', inputValueToInlineText(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field' key='publishers'>
					<label className='media-item-details-label' htmlFor='media-item-videogame-publishers'>
						{i18n.t('mediaItem.details.placeholders.publishers')}
					</label>
					<InputComponent
						id='media-item-videogame-publishers'
						type='text'
						value={inlineTextToInputValue(props.values.publishers)}
						onChange={(event) => {
							void props.setFieldValue('publishers', inputValueToInlineText(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field' key='platforms'>
					<label className='media-item-details-label' htmlFor='media-item-videogame-platforms'>
						{i18n.t('mediaItem.details.placeholders.platforms')}
					</label>
					<InputComponent
						id='media-item-videogame-platforms'
						type='text'
						value={inlineTextToInputValue(props.values.platforms)}
						onChange={(event) => {
							void props.setFieldValue('platforms', inputValueToInlineText(event.target.value));
						}}
					/>
				</div>
			]}
		/>
	);
};

/**
 * VideogameFormViewComponent's props
 */
export type VideogameFormViewComponentProps = FormikProps<VideogameInternal> & MediaItemFormViewComponentCommonInput & MediaItemFormViewComponentCommonOutput<VideogameInternal>;
