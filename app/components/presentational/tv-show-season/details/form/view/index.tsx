import { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { InputComponent } from 'app/components/presentational/generic/input';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all TV show season form input fields, all handled by Formik
 */
export class TvShowSeasonFormViewComponent extends Component<TvShowSeasonFormViewComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.notifyFormStatus();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<TvShowSeasonFormViewComponentProps>): void {
		const validChanged = prevProps.isValid !== this.props.isValid;
		const dirtyChanged = prevProps.dirty !== this.props.dirty;

		if (validChanged || dirtyChanged) {
			this.notifyFormStatus();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			values,
			addingNewSeason
		} = this.props;

		return (
			<section className='entity-details-panel'>
				<div className='entity-details-grid'>
					<div className='entity-details-field entity-details-field-span-2'>
						<label className='entity-details-label' htmlFor='tv-show-season-number'>
							{i18n.t('tvShowSeason.details.placeholders.number')}
						</label>
						<InputComponent
							id='tv-show-season-number'
							type='number'
							value={values.number ?? ''}
							placeholder={i18n.t('tvShowSeason.details.placeholders.number')}
							disabled={!addingNewSeason}
							onChange={(event) => {
								this.setOptionalNumberField('number', event.target.value);
							}}
						/>
					</div>
					<div className='entity-details-field'>
						<label className='entity-details-label' htmlFor='tv-show-season-episodes'>
							{i18n.t('tvShowSeason.details.placeholders.episodesNumber')}
						</label>
						<InputComponent
							id='tv-show-season-episodes'
							type='number'
							value={values.episodesNumber ?? ''}
							placeholder={i18n.t('tvShowSeason.details.placeholders.episodesNumber')}
							onChange={(event) => {
								this.setOptionalNumberField('episodesNumber', event.target.value);
							}}
						/>
					</div>
					<div className='entity-details-field'>
						<label className='entity-details-label' htmlFor='tv-show-season-watched'>
							{i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber')}
						</label>
						<InputComponent
							id='tv-show-season-watched'
							type='number'
							value={values.watchedEpisodesNumber ?? ''}
							placeholder={i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber')}
							onChange={(event) => {
								this.setOptionalNumberField('watchedEpisodesNumber', event.target.value);
							}}
						/>
					</div>
				</div>
			</section>
		);
	}

	/**
	 * Updates a numeric field from the current input string
	 * @param key the field key
	 * @param value the input string value
	 */
	private setOptionalNumberField<K extends keyof TvShowSeasonInternal>(key: K, value: string): void {
		const parsedValue = value ? Number(value) : undefined;

		void this.props.setFieldValue(key, parsedValue);
	}

	/**
	 * Notifies the current Formik status to the parent flow
	 */
	private notifyFormStatus(): void {
		const {
			isValid,
			dirty,
			notifyFormStatus
		} = this.props;

		notifyFormStatus(isValid, dirty);
	}
}

type TvShowSeasonFormViewComponentInput = {
	/**
	 * If we are adding a new season (true) or updating an existing one (false)
	 */
	addingNewSeason: boolean;
};

type TvShowSeasonFormViewComponentOutput = {
	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
};

/**
 * All props of TvShowSeasonFormViewComponent
 */
export type TvShowSeasonFormViewComponentProps = FormikProps<TvShowSeasonInternal> & TvShowSeasonFormViewComponentInput & TvShowSeasonFormViewComponentOutput;
