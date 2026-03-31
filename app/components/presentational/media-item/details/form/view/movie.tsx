import { ReactElement } from 'react';
import { inlineTextToInputValue, inputValueToInlineText, inputValueToNumber, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { FormikProps } from 'formik';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all movie form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const MovieFormViewComponent = (props: MovieFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFormViewComponent
			<MovieInternal>
			{...props}
			primarySpecificFields={[
				<div className='media-item-details-field' key='durationMinutes'>
					<label className='media-item-details-label' htmlFor='media-item-duration-minutes'>
						{i18n.t('mediaItem.details.placeholders.duration.MOVIE')}
					</label>
					<input
						id='media-item-duration-minutes'
						className='media-item-details-input'
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
					<input
						id='media-item-movie-directors'
						className='media-item-details-input'
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
