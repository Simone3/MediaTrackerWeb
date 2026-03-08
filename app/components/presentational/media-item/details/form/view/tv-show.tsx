import React, { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaItemFormViewComponent, MediaItemFormViewComponentCommonInput, MediaItemFormViewComponentCommonOutput } from 'app/components/presentational/media-item/details/form/view/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { MultiTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-multiple';
import { DatePickerFieldComponent } from 'app/components/presentational/form/fields/date-picker';
import { ToggleFieldComponent } from 'app/components/presentational/form/fields/toggle-input';
import { NumericTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-number';
import { TvShowSeasonHandlerFieldContainer } from 'app/components/containers/media-item/details/tv-show-season-handler';

/**
 * Presentational component that contains all TV show form input fields, all handled by the Formik container component
 */
export class TvShowFormViewComponent extends Component<TvShowFormViewComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<MediaItemFormViewComponent
				{...this.props}
				primarySpecificFields={[
					this.durationField(),
					this.creatorsField(),
					this.seasonsField(),
					this.inProductionField(),
					this.nextEpisodeDateField()
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
				name='averageEpisodeRuntimeMinutes'
				placeholder={i18n.t('mediaItem.details.placeholders.duration.TV_SHOW')}
				icon={images.durationField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the creators component
	 */
	private creatorsField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				key='creatorsField'
				name='creators'
				placeholder={i18n.t('mediaItem.details.placeholders.creators.TV_SHOW')}
				icon={images.creatorField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the seasons component
	 */
	private seasonsField(): ReactNode {

		return (
			<TvShowSeasonHandlerFieldContainer
				key='seasons'
				name='seasons'
				placeholder={i18n.t('mediaItem.details.placeholders.seasons')}
				icon={images.seasonsField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the production component
	 */
	private inProductionField(): ReactNode {
		
		return (
			<ToggleFieldComponent
				key='inProductionField'
				name='inProduction'
				icon={images.inProductionField()}
				placeholder={i18n.t('mediaItem.details.placeholders.inProduction')}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the next episode date component
	 */
	private nextEpisodeDateField(): ReactNode {

		if(this.props.values.inProduction) {

			return (
				<DatePickerFieldComponent
					key='nextEpisodeDateField'
					name='nextEpisodeAirDate'
					icon={images.nextEpisodeDateField()}
					placeholder={i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate')}
				/>
			);
		}
		else {

			return null;
		}
	}
}

/**
 * TvShowFormViewComponent's input props
 */
export type TvShowFormViewComponentInput = MediaItemFormViewComponentCommonInput;

/**
 * TvShowFormViewComponent's output props
 */
export type TvShowFormViewComponentOutput = MediaItemFormViewComponentCommonOutput;

/**
 * All props of TvShowFormViewComponent
 */
export type TvShowFormViewComponentProps = FormikProps<TvShowInternal> & TvShowFormViewComponentInput & TvShowFormViewComponentOutput;
