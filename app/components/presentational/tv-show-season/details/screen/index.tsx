import { Component, CSSProperties, ReactNode } from 'react';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import seasonIcon from 'app/resources/images/ic_input_season_number.svg';
import { i18n } from 'app/utilities/i18n';

const TV_SHOW_SEASON_DETAILS_ACCENT = '#ffb067';
const TV_SHOW_SEASON_DETAILS_ACTIVE_ACCENT = '#7db4ff';
const TV_SHOW_SEASON_DETAILS_COMPLETE_ACCENT = '#7ad18f';

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
		document.body.classList.add('app-dark-screen-active');
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
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
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
		const seasonSummary = this.getSeasonSummary(formValues);

		return (
			<section
				className='entity-details-screen tv-show-season-details-screen'
				style={{ '--entity-details-accent': this.getSeasonAccent(formValues) } as CSSProperties}>
				<div className='entity-details-screen-content'>
					<header className='entity-details-hero'>
						<div className='entity-details-heading'>
							<div className='entity-details-title-row'>
								<span className='entity-details-icon-shell' aria-hidden={true}>
									<img src={seasonIcon} alt='' className='entity-details-icon' />
								</span>
								<div className='entity-details-title-copy'>
									<h1 className='entity-details-title'>{title}</h1>
									<p className='entity-details-subtitle'>{seasonSummary}</p>
								</div>
							</div>
						</div>
						<div className='entity-details-actions'>
							<button
								type='button'
								className='entity-details-button entity-details-button-primary'
								disabled={!isValid}
								onClick={() => {
									this.submitForm();
								}}>
								Save
							</button>
						</div>
					</header>
					<form
						className='entity-details-form'
						onSubmit={(event) => {
							event.preventDefault();
							this.submitForm();
						}}>
						<div className='entity-details-main'>
							<section className='entity-details-panel'>
								<div className='entity-details-grid'>
									<div className='entity-details-field entity-details-field-span-2'>
										<label className='entity-details-label' htmlFor='tv-show-season-number'>
											{i18n.t('tvShowSeason.details.placeholders.number')}
										</label>
										<input
											id='tv-show-season-number'
											className='entity-details-input'
											type='number'
											value={formValues.number ?? ''}
											placeholder={i18n.t('tvShowSeason.details.placeholders.number')}
											disabled={!addingNewSeason}
											onChange={(event) => {
												const value = event.target.value ? Number(event.target.value) : undefined;
												this.setFormField('number', value as TvShowSeasonInternal['number']);
											}}
										/>
									</div>
									<div className='entity-details-field'>
										<label className='entity-details-label' htmlFor='tv-show-season-episodes'>
											{i18n.t('tvShowSeason.details.placeholders.episodesNumber')}
										</label>
										<input
											id='tv-show-season-episodes'
											className='entity-details-input'
											type='number'
											value={formValues.episodesNumber ?? ''}
											placeholder={i18n.t('tvShowSeason.details.placeholders.episodesNumber')}
											onChange={(event) => {
												const value = event.target.value ? Number(event.target.value) : undefined;
												this.setFormField('episodesNumber', value);
											}}
										/>
									</div>
									<div className='entity-details-field'>
										<label className='entity-details-label' htmlFor='tv-show-season-watched'>
											{i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber')}
										</label>
										<input
											id='tv-show-season-watched'
											className='entity-details-input'
											type='number'
											value={formValues.watchedEpisodesNumber ?? ''}
											placeholder={i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber')}
											onChange={(event) => {
												const value = event.target.value ? Number(event.target.value) : undefined;
												this.setFormField('watchedEpisodesNumber', value);
											}}
										/>
									</div>
								</div>
							</section>
						</div>
					</form>
				</div>
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

	/**
	 * Formats the current season summary copy
	 * @param tvShowSeason current season values
	 * @returns summary label
	 */
	private getSeasonSummary(tvShowSeason: TvShowSeasonInternal): string {
		if(tvShowSeason.number === undefined && tvShowSeason.episodesNumber === undefined && tvShowSeason.watchedEpisodesNumber === undefined) {
			return i18n.t('tvShowSeason.list.emptyHint');
		}

		return i18n.t('tvShowSeason.list.row.secondary', {
			episodesNumber: tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0,
			watchedEpisodesNumber: tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0
		});
	}

	/**
	 * Resolves the accent color for the current season
	 * @param tvShowSeason current season values
	 * @returns accent color
	 */
	private getSeasonAccent(tvShowSeason: TvShowSeasonInternal): string {
		const episodesNumber = tvShowSeason.episodesNumber ? tvShowSeason.episodesNumber : 0;
		const watchedEpisodesNumber = tvShowSeason.watchedEpisodesNumber ? tvShowSeason.watchedEpisodesNumber : 0;

		if(episodesNumber > 0 && watchedEpisodesNumber === episodesNumber) {
			return TV_SHOW_SEASON_DETAILS_COMPLETE_ACCENT;
		}

		if(watchedEpisodesNumber > 0) {
			return TV_SHOW_SEASON_DETAILS_ACTIVE_ACCENT;
		}

		return TV_SHOW_SEASON_DETAILS_ACCENT;
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
