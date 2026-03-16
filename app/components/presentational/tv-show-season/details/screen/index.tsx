import React, { Component, ReactNode } from 'react';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "TV show season details" screen, that works as the "add new TV show season", "update TV show season" and
 * "view TV show season data" sections
 */
export class TvShowSeasonDetailsScreenComponent extends Component<TvShowSeasonDetailsScreenComponentInput & TvShowSeasonDetailsScreenComponentOutput, TvShowSeasonDetailsScreenComponentState> {
	public state: TvShowSeasonDetailsScreenComponentState = {
		formValues: {
			number: undefined as unknown as number,
			episodesNumber: undefined,
			watchedEpisodesNumber: undefined
		}
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.syncFormValuesWithProps();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<TvShowSeasonDetailsScreenComponentInput & TvShowSeasonDetailsScreenComponentOutput>, prevState: Readonly<TvShowSeasonDetailsScreenComponentState>): void {
		if(this.areSeasonsDifferent(prevProps.tvShowSeason, this.props.tvShowSeason)) {
			this.syncFormValuesWithProps();
			return;
		}

		if(prevState.formValues !== this.state.formValues) {
			this.notifyFormStatus();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			formValues
		} = this.state;
		const {
			addingNewSeason
		} = this.props;
		const isValid = this.isFormValid(formValues);
		const title = addingNewSeason ?
			i18n.t('tvShowSeason.details.title.new') :
			i18n.t('tvShowSeason.details.title.existing', { seasonNumber: formValues.number });

		return (
			<section className='tv-show-season-details-screen'>
				<div className='tv-show-season-details-header'>
					<h1 className='tv-show-season-details-title'>{title}</h1>
					<div className='tv-show-season-details-actions'>
						<button
							type='button'
							className='tv-show-season-details-button tv-show-season-details-button-primary'
							disabled={!isValid}
							onClick={() => {
								this.submitForm();
							}}>
							Save
						</button>
					</div>
				</div>
				<form
					className='tv-show-season-details-form'
					onSubmit={(event) => {
						event.preventDefault();
						this.submitForm();
					}}>
					<label className='tv-show-season-details-label' htmlFor='tv-show-season-number'>
						{i18n.t('tvShowSeason.details.placeholders.number')}
					</label>
					<input
						id='tv-show-season-number'
						className='tv-show-season-details-input'
						type='number'
						value={formValues.number ?? ''}
						disabled={!addingNewSeason}
						onChange={(event) => {
							const value = event.target.value ? Number(event.target.value) : undefined;
							this.setFormField('number', value as TvShowSeasonInternal['number']);
						}}
					/>

					<label className='tv-show-season-details-label' htmlFor='tv-show-season-episodes'>
						{i18n.t('tvShowSeason.details.placeholders.episodesNumber')}
					</label>
					<input
						id='tv-show-season-episodes'
						className='tv-show-season-details-input'
						type='number'
						value={formValues.episodesNumber ?? ''}
						onChange={(event) => {
							const value = event.target.value ? Number(event.target.value) : undefined;
							this.setFormField('episodesNumber', value);
						}}
					/>

					<label className='tv-show-season-details-label' htmlFor='tv-show-season-watched'>
						{i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber')}
					</label>
					<input
						id='tv-show-season-watched'
						className='tv-show-season-details-input'
						type='number'
						value={formValues.watchedEpisodesNumber ?? ''}
						onChange={(event) => {
							const value = event.target.value ? Number(event.target.value) : undefined;
							this.setFormField('watchedEpisodesNumber', value);
						}}
					/>
				</form>
			</section>
		);
	}

	/**
	 * Syncs local form values from Redux source season
	 */
	private syncFormValuesWithProps(): void {
		this.setState({
			formValues: {
				...this.props.tvShowSeason
			}
		}, () => {
			this.notifyFormStatus();
		});
	}

	/**
	 * Handles a single field update
	 * @param key field key
	 * @param value field value
	 */
	private setFormField<K extends keyof TvShowSeasonInternal>(key: K, value: TvShowSeasonInternal[K]): void {
		this.setState((prevState) => {
			return {
				formValues: {
					...prevState.formValues,
					[key]: value
				}
			};
		});
	}

	/**
	 * Submits form if valid
	 */
	private submitForm(): void {
		const {
			formValues
		} = this.state;

		if(!this.isFormValid(formValues)) {
			this.notifyFormStatus();
			return;
		}

		this.props.saveTvShowSeason(formValues);
	}

	/**
	 * Notifies Redux about current form validity and dirty status
	 */
	private notifyFormStatus(): void {
		const {
			formValues
		} = this.state;

		this.props.notifyFormStatus(this.isFormValid(formValues), this.isFormDirty(formValues));
	}

	/**
	 * Checks validity
	 * @param tvShowSeason season values
	 * @returns true if valid
	 */
	private isFormValid(tvShowSeason: TvShowSeasonInternal): boolean {
		if(tvShowSeason.number === undefined || Number.isNaN(tvShowSeason.number)) {
			return false;
		}
		if(tvShowSeason.episodesNumber !== undefined && tvShowSeason.watchedEpisodesNumber !== undefined) {
			return tvShowSeason.watchedEpisodesNumber <= tvShowSeason.episodesNumber;
		}
		return true;
	}

	/**
	 * Checks if form is dirty
	 * @param tvShowSeason season values
	 * @returns true if dirty
	 */
	private isFormDirty(tvShowSeason: TvShowSeasonInternal): boolean {
		return this.areSeasonsDifferent(tvShowSeason, this.props.tvShowSeason);
	}

	/**
	 * Checks if two seasons differ
	 * @param left first season
	 * @param right second season
	 * @returns true if different
	 */
	private areSeasonsDifferent(left: TvShowSeasonInternal, right: TvShowSeasonInternal): boolean {
		return left.number !== right.number ||
			left.episodesNumber !== right.episodesNumber ||
			left.watchedEpisodesNumber !== right.watchedEpisodesNumber;
	}
}

/**
 * TvShowSeasonDetailsScreenComponent's input props
 */
export type TvShowSeasonDetailsScreenComponentInput = {
	/**
	 * Current TV show season
	 */
	tvShowSeason: TvShowSeasonInternal;

	/**
	 * If true, we are adding a new season
	 */
	addingNewSeason: boolean;
}

/**
 * TvShowSeasonDetailsScreenComponent's output props
 */
export type TvShowSeasonDetailsScreenComponentOutput = {
	/**
	 * Callback to save current season
	 */
	saveTvShowSeason: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type TvShowSeasonDetailsScreenComponentState = {
	formValues: TvShowSeasonInternal;
}
