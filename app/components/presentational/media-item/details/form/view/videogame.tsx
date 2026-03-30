import { ReactElement } from 'react';
import { inlineTextToInputValue, inputValueToInlineText, inputValueToNumber, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { MediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { FormikProps } from 'formik';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all videogame form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const VideogameFormViewComponent = (props: VideogameFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFormViewComponent
			{...props}
			primarySpecificFields={[
				<div className='media-item-details-field' key='averageLengthHours'>
					<label className='media-item-details-label' htmlFor='media-item-average-length'>
						{i18n.t('mediaItem.details.placeholders.duration.VIDEOGAME')}
					</label>
					<input
						id='media-item-average-length'
						className='media-item-details-input'
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
					<input
						id='media-item-videogame-developers'
						className='media-item-details-input'
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
					<input
						id='media-item-videogame-publishers'
						className='media-item-details-input'
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
					<input
						id='media-item-videogame-platforms'
						className='media-item-details-input'
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
export type VideogameFormViewComponentProps = FormikProps<MediaItemDetailsFormValues> & MediaItemFormViewComponentCommonInput & MediaItemFormViewComponentCommonOutput;
