import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput } from 'app/components/presentational/media-item/details/form/view/media-item';
import { BookInternal } from 'app/data/models/internal/media-items/book';
import { images } from 'app/utilities/images';
import { i18n } from 'app/utilities/i18n';
import { MultiTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-multiple';
import { NumericTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-number';

/**
 * Presentational component that contains all book form input fields, all handled by the Formik container component
 */
export class BookFormViewComponent extends Component<BookFormViewComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<MediaItemFormViewComponent
				{...this.props}
				primarySpecificFields={[
					this.durationField(),
					this.authorsField()
				]}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the duration component
	 */
	private durationField(): ReactNode {

		return (
			<NumericTextInputFieldComponent
				key='durationField'
				name='pagesNumber'
				placeholder={i18n.t('mediaItem.details.placeholders.duration.BOOK')}
				icon={images.durationField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the authors component
	 */
	private authorsField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				key='authorsField'
				name='authors'
				placeholder={i18n.t('mediaItem.details.placeholders.creators.BOOK')}
				icon={images.creatorField()}
			/>
		);
	}
}

/**
 * BookFormViewComponent's input props
 */
export type BookFormViewComponentInput = MediaItemFormViewComponentCommonInput;

/**
 * BookFormViewComponent's output props
 */
export type BookFormViewComponentOutput = MediaItemFormViewComponentCommonOutput;

/**
 * All props of BookFormViewComponent
 */
export type BookFormViewComponentProps = FormikProps<BookInternal> & BookFormViewComponentInput & BookFormViewComponentOutput;
