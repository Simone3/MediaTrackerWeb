import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput } from 'app/components/presentational/media-item/details/form/view/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { MultiTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-multiple';
import { NumericTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-number';

/**
 * Presentational component that contains all videogame form input fields, all handled by the Formik container component
 */
export class VideogameFormViewComponent extends Component<VideogameFormViewComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<MediaItemFormViewComponent
				{...this.props}
				primarySpecificFields={[
					this.durationField(),
					this.developersField(),
					this.publishersField(),
					this.platformsField()
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
				name='averageLengthHours'
				placeholder={i18n.t('mediaItem.details.placeholders.duration.VIDEOGAME')}
				icon={images.durationField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the developers component
	 */
	private developersField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				key='developersField'
				name='developers'
				placeholder={i18n.t('mediaItem.details.placeholders.creators.VIDEOGAME')}
				icon={images.creatorField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the publishers component
	 */
	private publishersField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				key='publishersField'
				name='publishers'
				placeholder={i18n.t('mediaItem.details.placeholders.publishers')}
				icon={images.publishersField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the platforms component
	 */
	private platformsField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				key='platformsField'
				name='platforms'
				placeholder={i18n.t('mediaItem.details.placeholders.platforms')}
				icon={images.platformsField()}
			/>
		);
	}
}

/**
 * VideogameFormViewComponent's input props
 */
export type VideogameFormViewComponentInput = MediaItemFormViewComponentCommonInput;

/**
 * VideogameFormViewComponent's output props
 */
export type VideogameFormViewComponentOutput = MediaItemFormViewComponentCommonOutput;

/**
 * All props of VideogameFormViewComponent
 */
export type VideogameFormViewComponentProps = FormikProps<VideogameInternal> & VideogameFormViewComponentInput & VideogameFormViewComponentOutput;
