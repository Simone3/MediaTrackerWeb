import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { FormikProps } from 'formik';
import { styles } from 'app/components/presentational/tv-show-season/details/form/view/styles';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { NumericTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-number';

/**
 * Presentational component that contains all TV show season form input fields, all handled by the Formik container component
 */
export class TvShowSeasonFormViewComponent extends Component<TvShowSeasonFormViewComponentProps> {

	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.handlePropChange();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: TvShowSeasonFormViewComponentProps): void {

		const validChanged = prevProps.isValid !== this.props.isValid;
		const dirtyChanged = prevProps.dirty !== this.props.dirty;
		const saveReqChanged = prevProps.saveRequested !== this.props.saveRequested;
		if(validChanged || dirtyChanged || saveReqChanged) {
			
			this.handlePropChange();
		}
	}

	/**
	 * Helper to handle custom props at startup and after each update
	 */
	private handlePropChange(): void {

		const {
			saveRequested,
			notifyFormStatus,
			submitForm,
			isValid,
			dirty
		} = this.props;

		if(saveRequested) {

			submitForm();
		}
		else {

			notifyFormStatus(isValid, dirty);
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<View style={styles.container}>
				{this.numberField()}
				{this.episodesNumber()}
				{this.watchedEpisodesNumber()}
			</View>
		);
	}

	/**
	 * Helper
	 * @returns the season number component
	 */
	private numberField(): ReactNode {

		const {
			addingNewSeason
		} = this.props;

		return (
			<NumericTextInputFieldComponent
				name='number'
				disabled={!addingNewSeason}
				placeholder={i18n.t('tvShowSeason.details.placeholders.number')}
				icon={images.seasonsField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the season number component
	 */
	private watchedEpisodesNumber(): ReactNode {

		return (
			<NumericTextInputFieldComponent
				name='watchedEpisodesNumber'
				placeholder={i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber')}
				icon={images.episodesField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the season number component
	 */
	private episodesNumber(): ReactNode {

		return (
			<NumericTextInputFieldComponent
				name='episodesNumber'
				placeholder={i18n.t('tvShowSeason.details.placeholders.episodesNumber')}
				icon={images.episodesField()}
			/>
		);
	}
}

/**
 * TvShowSeasonFormViewComponent's input props
 */
export type TvShowSeasonFormViewComponentInput = {

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;

	/**
	 * If we are adding a new season (true) or updating an existing one (false)
	 */
	addingNewSeason: boolean;
}

/**
 * TvShowSeasonFormViewComponent's output props
 */
export type TvShowSeasonFormViewComponentOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * All props of TvShowSeasonFormViewComponent
 */
export type TvShowSeasonFormViewComponentProps = FormikProps<TvShowSeasonInternal> & TvShowSeasonFormViewComponentInput & TvShowSeasonFormViewComponentOutput;
