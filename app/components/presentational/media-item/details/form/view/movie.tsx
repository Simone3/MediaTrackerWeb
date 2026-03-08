import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput } from 'app/components/presentational/media-item/details/form/view/media-item';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { MultiTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-multiple';
import { NumericTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-number';

/**
 * Presentational component that contains all movie form input fields, all handled by the Formik container component
 */
export class MovieFormViewComponent extends Component<MovieFormViewComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<MediaItemFormViewComponent
				{...this.props}
				primarySpecificFields={[
					this.durationField(),
					this.directorsField()
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
				name='durationMinutes'
				placeholder={i18n.t('mediaItem.details.placeholders.duration.MOVIE')}
				icon={images.durationField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the directors component
	 */
	private directorsField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				key='directorsField'
				name='directors'
				placeholder={i18n.t('mediaItem.details.placeholders.creators.MOVIE')}
				icon={images.creatorField()}
			/>
		);
	}
}

/**
 * MovieFormViewComponent's input props
 */
export type MovieFormViewComponentInput = MediaItemFormViewComponentCommonInput;

/**
 * MovieFormViewComponent's output props
 */
export type MovieFormViewComponentOutput = MediaItemFormViewComponentCommonOutput;

/**
 * All props of MovieFormViewComponent
 */
export type MovieFormViewComponentProps = FormikProps<MovieInternal> & MovieFormViewComponentInput & MovieFormViewComponentOutput;
