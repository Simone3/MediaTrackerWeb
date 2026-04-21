import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { InputComponent } from 'app/components/presentational/generic/input';
import { InlineTextInputComponent, inputValueToNumber, MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput, numberToInputValue } from 'app/components/presentational/media-item/details/form/view/media-item';
import { i18n } from 'app/utilities/i18n';
import { BookInternal } from 'app/data/models/internal/media-items/book';

/**
 * Presentational component that contains all book form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const BookFormViewComponent = (props: BookFormViewComponentProps): ReactElement => {
	return (
		<MediaItemFormViewComponent<BookInternal>
			{...props}
			primarySpecificFields={[
				<div className='media-item-details-field' key='pagesNumber'>
					<label className='media-item-details-label' htmlFor='media-item-pages-number'>
						{i18n.t('mediaItem.details.placeholders.duration.BOOK')}
					</label>
					<InputComponent
						id='media-item-pages-number'
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
					<InlineTextInputComponent
						id='media-item-book-authors'
						values={props.values.authors}
						onChange={(values) => {
							void props.setFieldValue('authors', values);
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
export type BookFormViewComponentProps = FormikProps<BookInternal> & MediaItemFormViewComponentCommonInput & MediaItemFormViewComponentCommonOutput<BookInternal>;
