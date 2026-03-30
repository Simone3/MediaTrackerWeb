import { ReactElement } from 'react';
import { inlineTextToInputValue, inputValueToInlineText, inputValueToNumber, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { i18n } from 'app/utilities/i18n';
import { MediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { FormikProps } from 'formik';

/**
 * Presentational component that contains all book form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const BookFormViewComponent = (props: BookFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFormViewComponent
			{...props}
			primarySpecificFields={[
				<div className='media-item-details-field' key='pagesNumber'>
					<label className='media-item-details-label' htmlFor='media-item-pages-number'>
						{i18n.t('mediaItem.details.placeholders.duration.BOOK')}
					</label>
					<input
						id='media-item-pages-number'
						className='media-item-details-input'
						type='number'
						value={numberToInputValue(props.values.pagesNumber)}
						onChange={(event) => {
							void props.setFieldValue('pagesNumber', inputValueToNumber(event.target.value));
						}}
					/>
				</div>,
				<div className='media-item-details-field' key='authors'>
					<label className='media-item-details-label' htmlFor='media-item-book-authors'>
						{i18n.t('mediaItem.details.placeholders.creators.BOOK')}
					</label>
					<input
						id='media-item-book-authors'
						className='media-item-details-input'
						type='text'
						value={inlineTextToInputValue(props.values.authors)}
						onChange={(event) => {
							void props.setFieldValue('authors', inputValueToInlineText(event.target.value));
						}}
					/>
				</div>
			]}
		/>
	);
};

/**
 * BookFormViewComponent's props
 */
export type BookFormViewComponentProps = FormikProps<MediaItemDetailsFormValues> & MediaItemFormViewComponentCommonInput & MediaItemFormViewComponentCommonOutput;
