import React, { Component, ReactNode } from 'react';
import { DEFAULT_BOOK, BookInternal } from 'app/data/models/internal/media-items/book';
import { MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MEDIA_ITEM_STATUS_INTERNAL_VALUES, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

type MediaItemDetailsFormValues = MediaItemInternal & Partial<BookInternal & MovieInternal & TvShowInternal & VideogameInternal>;

/**
 * Presentational component that contains the whole "media item details" screen, that works as the "add new media item", "update media item" and
 * "view media item data" sections
 */
export class MediaItemDetailsScreenComponent extends Component<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput, MediaItemDetailsScreenComponentState> {
	public state: MediaItemDetailsScreenComponentState = {
		formValues: DEFAULT_BOOK,
		confirmSameNameVisible: false
	};

	private loadedTvShowSeasonsTimestamp?: Date;

	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.syncFormValuesWithProps();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput>, prevState: Readonly<MediaItemDetailsScreenComponentState>): void {
		if(this.areMediaItemsDifferent(prevProps.mediaItem, this.props.mediaItem)) {
			this.syncFormValuesWithProps();
			return;
		}

		this.checkLoadTvShowSeasons();

		if(!prevProps.sameNameConfirmationRequested && this.props.sameNameConfirmationRequested) {
			this.setState({
				confirmSameNameVisible: true
			});
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
			isLoading
		} = this.props;
		const {
			formValues,
			confirmSameNameVisible
		} = this.state;
		const isValid = this.isFormValid(formValues);
		const title = formValues.id ? formValues.name : i18n.t(`mediaItem.details.title.new.${formValues.mediaType}`);

		return (
			<section className='media-item-details-screen'>
				<div className='media-item-details-header'>
					<h1 className='media-item-details-title'>{title}</h1>
					<div className='media-item-details-actions'>
						<button type='button' className='media-item-details-button media-item-details-button-secondary' onClick={this.props.goBack}>
							Back
						</button>
						<button
							type='button'
							className='media-item-details-button media-item-details-button-primary'
							disabled={!isValid || isLoading}
							onClick={() => {
								this.submitForm(false);
							}}>
							Save
						</button>
					</div>
				</div>
				<form
					className='media-item-details-form'
					onSubmit={(event) => {
						event.preventDefault();
						this.submitForm(false);
					}}>
					<label className='media-item-details-label' htmlFor='media-item-name'>
						{i18n.t('mediaItem.details.placeholders.name')}
					</label>
					<input
						id='media-item-name'
						className='media-item-details-input'
						type='text'
						value={formValues.name}
						onChange={(event) => {
							this.setFormField('name', event.target.value);
						}}
					/>

					<label className='media-item-details-label' htmlFor='media-item-status'>
						Status
					</label>
					<select
						id='media-item-status'
						className='media-item-details-select'
						value={formValues.status}
						onChange={(event) => {
							this.setFormField('status', event.target.value as MediaItemInternal['status']);
						}}>
						{MEDIA_ITEM_STATUS_INTERNAL_VALUES.map((status) => {
							return (
								<option key={status} value={status}>
									{status}
								</option>
							);
						})}
					</select>

					<label className='media-item-details-label' htmlFor='media-item-importance'>
						{i18n.t('mediaItem.details.prompts.importance')}
					</label>
					<select
						id='media-item-importance'
						className='media-item-details-select'
						value={formValues.importance}
						onChange={(event) => {
							this.setFormField('importance', event.target.value as MediaItemInternal['importance']);
						}}>
						{MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES.map((importance) => {
							return (
								<option key={importance} value={importance}>
									{i18n.t(`mediaItem.common.importance.${importance}`)}
								</option>
							);
						})}
					</select>

					<label className='media-item-details-label' htmlFor='media-item-release-date'>
						{i18n.t('mediaItem.details.placeholders.releaseDate')}
					</label>
					<input
						id='media-item-release-date'
						className='media-item-details-input'
						type='date'
						value={this.dateToInputValue(formValues.releaseDate)}
						onChange={(event) => {
							this.setFormField('releaseDate', this.inputValueToDate(event.target.value));
						}}
					/>

					{this.renderTypeSpecificFields(formValues)}

					<label className='media-item-details-label' htmlFor='media-item-description'>
						{i18n.t('mediaItem.details.placeholders.description')}
					</label>
					<textarea
						id='media-item-description'
						className='media-item-details-textarea'
						value={formValues.description || ''}
						onChange={(event) => {
							this.setFormField('description', event.target.value || undefined);
						}}
					/>

					<label className='media-item-details-label' htmlFor='media-item-user-comment'>
						{i18n.t('mediaItem.details.placeholders.userComment')}
					</label>
					<textarea
						id='media-item-user-comment'
						className='media-item-details-textarea'
						value={formValues.userComment || ''}
						onChange={(event) => {
							this.setFormField('userComment', event.target.value || undefined);
						}}
					/>
				</form>
				<ConfirmDialogComponent
					visible={confirmSameNameVisible}
					title={i18n.t('mediaItem.common.alert.addSameName.title')}
					message={i18n.t(`mediaItem.common.alert.addSameName.message.${formValues.mediaType}`)}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						this.setState({
							confirmSameNameVisible: false
						}, () => {
							this.submitForm(true);
						});
					}}
					onCancel={() => {
						this.setState({
							confirmSameNameVisible: false
						});
					}}
				/>
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
			</section>
		);
	}

	/**
	 * Syncs local form values from the Redux source media item
	 */
	private syncFormValuesWithProps(): void {
		this.loadedTvShowSeasonsTimestamp = undefined;

		this.setState({
			formValues: {
				...this.props.mediaItem
			}
		}, () => {
			this.notifyFormStatus();
		});
	}

	/**
	 * Checks if we need to load the seasons list after TV show seasons handler completion
	 */
	private checkLoadTvShowSeasons(): void {
		const {
			tvShowSeasonsLoadTimestamp,
			tvShowSeasons
		} = this.props;

		if(this.state.formValues.mediaType !== 'TV_SHOW') {
			return;
		}
		if(!tvShowSeasonsLoadTimestamp || tvShowSeasonsLoadTimestamp === this.loadedTvShowSeasonsTimestamp) {
			return;
		}

		this.loadedTvShowSeasonsTimestamp = tvShowSeasonsLoadTimestamp;
		this.setFormField('seasons', tvShowSeasons.length > 0 ? [ ...tvShowSeasons ] : undefined);
	}

	/**
	 * Renders fields specific to current media item type
	 * @param mediaItem the current media item values
	 * @returns the fields
	 */
	private renderTypeSpecificFields(mediaItem: MediaItemDetailsFormValues): ReactNode {
		switch(mediaItem.mediaType) {
			case 'BOOK': {
				const book = mediaItem as BookInternal;
				return (
					<>
						<label className='media-item-details-label' htmlFor='media-item-pages-number'>
							{i18n.t('mediaItem.details.placeholders.duration.BOOK')}
						</label>
						<input
							id='media-item-pages-number'
							className='media-item-details-input'
							type='number'
							value={this.numberToInputValue(book.pagesNumber)}
							onChange={(event) => {
								this.setFormField('pagesNumber', this.inputValueToNumber(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-book-authors'>
							{i18n.t('mediaItem.details.placeholders.creators.BOOK')}
						</label>
						<textarea
							id='media-item-book-authors'
							className='media-item-details-textarea'
							value={this.multiTextToInputValue(book.authors)}
							onChange={(event) => {
								this.setFormField('authors', this.inputValueToMultiText(event.target.value));
							}}
						/>
					</>
				);
			}

			case 'MOVIE': {
				const movie = mediaItem as MovieInternal;
				return (
					<>
						<label className='media-item-details-label' htmlFor='media-item-duration-minutes'>
							{i18n.t('mediaItem.details.placeholders.duration.MOVIE')}
						</label>
						<input
							id='media-item-duration-minutes'
							className='media-item-details-input'
							type='number'
							value={this.numberToInputValue(movie.durationMinutes)}
							onChange={(event) => {
								this.setFormField('durationMinutes', this.inputValueToNumber(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-movie-directors'>
							{i18n.t('mediaItem.details.placeholders.creators.MOVIE')}
						</label>
						<textarea
							id='media-item-movie-directors'
							className='media-item-details-textarea'
							value={this.multiTextToInputValue(movie.directors)}
							onChange={(event) => {
								this.setFormField('directors', this.inputValueToMultiText(event.target.value));
							}}
						/>
					</>
				);
			}

			case 'TV_SHOW': {
				const tvShow = mediaItem as TvShowInternal;
				const seasonsSummary = this.getTvShowSeasonsSummary(tvShow.seasons);
				return (
					<>
						<label className='media-item-details-label' htmlFor='media-item-episode-runtime'>
							{i18n.t('mediaItem.details.placeholders.duration.TV_SHOW')}
						</label>
						<input
							id='media-item-episode-runtime'
							className='media-item-details-input'
							type='number'
							value={this.numberToInputValue(tvShow.averageEpisodeRuntimeMinutes)}
							onChange={(event) => {
								this.setFormField('averageEpisodeRuntimeMinutes', this.inputValueToNumber(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-tv-show-creators'>
							{i18n.t('mediaItem.details.placeholders.creators.TV_SHOW')}
						</label>
						<textarea
							id='media-item-tv-show-creators'
							className='media-item-details-textarea'
							value={this.multiTextToInputValue(tvShow.creators)}
							onChange={(event) => {
								this.setFormField('creators', this.inputValueToMultiText(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-tv-show-seasons-handler'>
							{i18n.t('mediaItem.details.placeholders.seasons')}
						</label>
						<button
							id='media-item-tv-show-seasons-handler'
							type='button'
							className='media-item-details-button media-item-details-button-secondary media-item-details-inline-button'
							onClick={() => {
								this.props.handleTvShowSeasons(tvShow.seasons);
							}}>
							{i18n.t('tvShowSeason.list.title')}
						</button>
						<p className='media-item-details-inline-hint'>{seasonsSummary}</p>

						<label className='media-item-details-checkbox-row' htmlFor='media-item-in-production'>
							<input
								id='media-item-in-production'
								className='media-item-details-checkbox'
								type='checkbox'
								checked={Boolean(tvShow.inProduction)}
								onChange={(event) => {
									const inProduction = event.target.checked;
									this.setState((prevState) => {
										const prevTvShow = prevState.formValues as TvShowInternal;
										return {
											formValues: {
												...prevTvShow,
												inProduction: inProduction,
												nextEpisodeAirDate: inProduction ? prevTvShow.nextEpisodeAirDate : undefined
											}
										};
									});
								}}
							/>
							<span className='media-item-details-checkbox-label'>{i18n.t('mediaItem.details.placeholders.inProduction')}</span>
						</label>

						{tvShow.inProduction && (
							<>
								<label className='media-item-details-label' htmlFor='media-item-next-episode-air-date'>
									{i18n.t('mediaItem.details.placeholders.nextEpisodeAirDate')}
								</label>
								<input
									id='media-item-next-episode-air-date'
									className='media-item-details-input'
									type='date'
									value={this.dateToInputValue(tvShow.nextEpisodeAirDate)}
									onChange={(event) => {
										this.setFormField('nextEpisodeAirDate', this.inputValueToDate(event.target.value));
									}}
								/>
							</>
						)}
					</>
				);
			}

			case 'VIDEOGAME': {
				const videogame = mediaItem as VideogameInternal;
				return (
					<>
						<label className='media-item-details-label' htmlFor='media-item-average-length'>
							{i18n.t('mediaItem.details.placeholders.duration.VIDEOGAME')}
						</label>
						<input
							id='media-item-average-length'
							className='media-item-details-input'
							type='number'
							value={this.numberToInputValue(videogame.averageLengthHours)}
							onChange={(event) => {
								this.setFormField('averageLengthHours', this.inputValueToNumber(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-videogame-developers'>
							{i18n.t('mediaItem.details.placeholders.creators.VIDEOGAME')}
						</label>
						<textarea
							id='media-item-videogame-developers'
							className='media-item-details-textarea'
							value={this.multiTextToInputValue(videogame.developers)}
							onChange={(event) => {
								this.setFormField('developers', this.inputValueToMultiText(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-videogame-publishers'>
							{i18n.t('mediaItem.details.placeholders.publishers')}
						</label>
						<textarea
							id='media-item-videogame-publishers'
							className='media-item-details-textarea'
							value={this.multiTextToInputValue(videogame.publishers)}
							onChange={(event) => {
								this.setFormField('publishers', this.inputValueToMultiText(event.target.value));
							}}
						/>

						<label className='media-item-details-label' htmlFor='media-item-videogame-platforms'>
							{i18n.t('mediaItem.details.placeholders.platforms')}
						</label>
						<textarea
							id='media-item-videogame-platforms'
							className='media-item-details-textarea'
							value={this.multiTextToInputValue(videogame.platforms)}
							onChange={(event) => {
								this.setFormField('platforms', this.inputValueToMultiText(event.target.value));
							}}
						/>
					</>
				);
			}

			default:
				return null;
		}
	}

	/**
	 * Builds the TV show seasons summary line
	 * @param seasons TV show seasons
	 * @returns summary label
	 */
	private getTvShowSeasonsSummary(seasons?: TvShowSeasonInternal[]): string {
		if(!seasons || seasons.length === 0) {
			return i18n.t('tvShowSeason.list.empty');
		}

		const counters = mediaItemUtils.getTvShowCounters(seasons);
		return i18n.t('mediaItem.details.labels.seasons', {
			seasonsNumber: counters.seasonsNumber,
			episodesNumber: counters.episodesNumber,
			watchedEpisodesNumber: counters.watchedEpisodesNumber
		});
	}

	/**
	 * Handles a single field update
	 * @param key the field key
	 * @param value the field value
	 */
	private setFormField<K extends keyof MediaItemDetailsFormValues>(key: K, value: MediaItemDetailsFormValues[K]): void {
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
	 * Submits the current form values if valid
	 * @param confirmSameName if true, bypasses duplicate-name confirmation in saga
	 */
	private submitForm(confirmSameName: boolean): void {
		const {
			formValues
		} = this.state;
		const normalizedValues = this.normalizeFormValues(formValues);

		if(!this.isFormValid(normalizedValues)) {
			this.notifyFormStatus();
			return;
		}

		this.props.saveMediaItem(normalizedValues, confirmSameName);
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
	 * Validates the current form values
	 * @param mediaItem the media item values
	 * @returns true if valid
	 */
	private isFormValid(mediaItem: MediaItemDetailsFormValues): boolean {
		const hasName = Boolean(mediaItem.name && mediaItem.name.trim());
		const hasRequiredEnums = Boolean(mediaItem.mediaType) && Boolean(mediaItem.status) && Boolean(mediaItem.importance);
		const hasOrderIfGroupSelected = mediaItem.group?.id ? this.isOptionalNumberValid(mediaItem.orderInGroup) : true;

		if(!hasName || !hasRequiredEnums || !hasOrderIfGroupSelected) {
			return false;
		}

		switch(mediaItem.mediaType) {
			case 'BOOK': {
				const book = mediaItem as BookInternal;
				return this.isOptionalNumberValid(book.pagesNumber);
			}

			case 'MOVIE': {
				const movie = mediaItem as MovieInternal;
				return this.isOptionalNumberValid(movie.durationMinutes);
			}

			case 'TV_SHOW': {
				const tvShow = mediaItem as TvShowInternal;
				if(!this.isOptionalNumberValid(tvShow.averageEpisodeRuntimeMinutes)) {
					return false;
				}
				return this.isTvShowSeasonsValid(tvShow.seasons);
			}

			case 'VIDEOGAME': {
				const videogame = mediaItem as VideogameInternal;
				return this.isOptionalNumberValid(videogame.averageLengthHours);
			}

			default:
				return true;
		}
	}

	/**
	 * Checks if local form differs from initial Redux media item
	 * @param mediaItem the current media item values
	 * @returns true if dirty
	 */
	private isFormDirty(mediaItem: MediaItemDetailsFormValues): boolean {
		return this.areMediaItemsDifferent(mediaItem, this.props.mediaItem);
	}

	/**
	 * Checks if two media items differ on fields handled by this form
	 * @param left first media item
	 * @param right second media item
	 * @returns true if different
	 */
	private areMediaItemsDifferent(left: MediaItemDetailsFormValues, right: MediaItemDetailsFormValues): boolean {
		const commonDifferent = left.id !== right.id ||
			left.name !== right.name ||
			left.mediaType !== right.mediaType ||
			left.status !== right.status ||
			left.importance !== right.importance ||
			left.description !== right.description ||
			left.userComment !== right.userComment ||
			left.group?.id !== right.group?.id ||
			left.orderInGroup !== right.orderInGroup ||
			left.ownPlatform?.id !== right.ownPlatform?.id ||
			this.dateToComparable(left.releaseDate) !== this.dateToComparable(right.releaseDate) ||
			this.areStringArraysDifferent(left.genres, right.genres) ||
			this.areDateArraysDifferent(left.completedOn, right.completedOn);

		if(commonDifferent) {
			return true;
		}

		switch(left.mediaType) {
			case 'BOOK': {
				const leftBook = left as BookInternal;
				const rightBook = right as BookInternal;
				return leftBook.pagesNumber !== rightBook.pagesNumber ||
					this.areStringArraysDifferent(leftBook.authors, rightBook.authors);
			}

			case 'MOVIE': {
				const leftMovie = left as MovieInternal;
				const rightMovie = right as MovieInternal;
				return leftMovie.durationMinutes !== rightMovie.durationMinutes ||
					this.areStringArraysDifferent(leftMovie.directors, rightMovie.directors);
			}

			case 'TV_SHOW': {
				const leftTvShow = left as TvShowInternal;
				const rightTvShow = right as TvShowInternal;
				return leftTvShow.averageEpisodeRuntimeMinutes !== rightTvShow.averageEpisodeRuntimeMinutes ||
					leftTvShow.inProduction !== rightTvShow.inProduction ||
					this.dateToComparable(leftTvShow.nextEpisodeAirDate) !== this.dateToComparable(rightTvShow.nextEpisodeAirDate) ||
					this.areStringArraysDifferent(leftTvShow.creators, rightTvShow.creators) ||
					this.areTvShowSeasonsDifferent(leftTvShow.seasons, rightTvShow.seasons);
			}

			case 'VIDEOGAME': {
				const leftVideogame = left as VideogameInternal;
				const rightVideogame = right as VideogameInternal;
				return leftVideogame.averageLengthHours !== rightVideogame.averageLengthHours ||
					this.areStringArraysDifferent(leftVideogame.developers, rightVideogame.developers) ||
					this.areStringArraysDifferent(leftVideogame.publishers, rightVideogame.publishers) ||
					this.areStringArraysDifferent(leftVideogame.platforms, rightVideogame.platforms);
			}

			default:
				return false;
		}
	}

	/**
	 * Checks whether two optional string arrays are different
	 * @param left left array
	 * @param right right array
	 * @returns true if different
	 */
	private areStringArraysDifferent(left?: string[], right?: string[]): boolean {
		const leftValues = left ? left : [];
		const rightValues = right ? right : [];
		if(leftValues.length !== rightValues.length) {
			return true;
		}
		for(let i = 0; i < leftValues.length; i += 1) {
			if(leftValues[i] !== rightValues[i]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks whether two optional date arrays are different
	 * @param left left array
	 * @param right right array
	 * @returns true if different
	 */
	private areDateArraysDifferent(left?: Date[], right?: Date[]): boolean {
		const leftValues = left ? left : [];
		const rightValues = right ? right : [];
		if(leftValues.length !== rightValues.length) {
			return true;
		}
		for(let i = 0; i < leftValues.length; i += 1) {
			if(this.dateToComparable(leftValues[i]) !== this.dateToComparable(rightValues[i])) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks whether two optional TV show season arrays are different
	 * @param left left array
	 * @param right right array
	 * @returns true if different
	 */
	private areTvShowSeasonsDifferent(left?: TvShowSeasonInternal[], right?: TvShowSeasonInternal[]): boolean {
		const leftValues = left ? left : [];
		const rightValues = right ? right : [];
		if(leftValues.length !== rightValues.length) {
			return true;
		}
		for(let i = 0; i < leftValues.length; i += 1) {
			const leftSeason = leftValues[i];
			const rightSeason = rightValues[i];
			if(leftSeason.number !== rightSeason.number ||
				leftSeason.episodesNumber !== rightSeason.episodesNumber ||
				leftSeason.watchedEpisodesNumber !== rightSeason.watchedEpisodesNumber) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks if an optional number is valid for form submission
	 * @param value the numeric value
	 * @returns true if valid
	 */
	private isOptionalNumberValid(value?: number): boolean {
		return value === undefined || (!Number.isNaN(value) && Number.isFinite(value) && value >= 0);
	}

	/**
	 * Checks whether TV show seasons list is valid
	 * @param seasons seasons list
	 * @returns true if valid
	 */
	private isTvShowSeasonsValid(seasons?: TvShowSeasonInternal[]): boolean {
		if(!seasons || seasons.length === 0) {
			return true;
		}

		const uniqueNumbers = new Set<number>();
		for(const season of seasons) {
			if(season.number === undefined || Number.isNaN(season.number)) {
				return false;
			}
			if(uniqueNumbers.has(season.number)) {
				return false;
			}
			uniqueNumbers.add(season.number);
			if(!this.isOptionalNumberValid(season.episodesNumber) || !this.isOptionalNumberValid(season.watchedEpisodesNumber)) {
				return false;
			}
			if(season.episodesNumber !== undefined && season.watchedEpisodesNumber !== undefined && season.watchedEpisodesNumber > season.episodesNumber) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Converts an optional Date to comparable string
	 * @param date the date
	 * @returns comparable value
	 */
	private dateToComparable(date?: Date): string {
		return date ? date.toISOString() : '';
	}

	/**
	 * Converts optional Date to input string
	 * @param date the date
	 * @returns yyyy-mm-dd or empty string
	 */
	private dateToInputValue(date?: Date): string {
		if(!date) {
			return '';
		}
		const year = `${date.getFullYear()}`.padStart(4, '0');
		const month = `${date.getMonth() + 1}`.padStart(2, '0');
		const day = `${date.getDate()}`.padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	/**
	 * Converts an input date string to Date
	 * @param value yyyy-mm-dd input value
	 * @returns date or undefined
	 */
	private inputValueToDate(value: string): Date | undefined {
		if(!value) {
			return undefined;
		}
		const [ year, month, day ] = value.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	/**
	 * Converts an optional number to an input-safe value
	 * @param value number
	 * @returns input value
	 */
	private numberToInputValue(value?: number): number | '' {
		return value !== undefined ? value : '';
	}

	/**
	 * Converts an input text value to optional number
	 * @param value input string
	 * @returns number or undefined
	 */
	private inputValueToNumber(value: string): number | undefined {
		if(!value) {
			return undefined;
		}
		const parsed = Number(value);
		return Number.isNaN(parsed) ? undefined : parsed;
	}

	/**
	 * Converts optional string array to textarea text
	 * @param values array values
	 * @returns multiline text
	 */
	private multiTextToInputValue(values?: string[]): string {
		if(!values || values.length === 0) {
			return '';
		}
		return values.join('\n');
	}

	/**
	 * Converts multiline input text to array
	 * @param value multiline text
	 * @returns array or undefined
	 */
	private inputValueToMultiText(value: string): string[] | undefined {
		const tokens = value
			.split('\n')
			.flatMap((row) => {
				return row.split(',');
			})
			.filter((token) => {
				return token.trim().length > 0;
			});

		return tokens.length > 0 ? tokens : undefined;
	}

	/**
	 * Normalizes form values before save
	 * @param values form values
	 * @returns normalized form values
	 */
	private normalizeFormValues(values: MediaItemDetailsFormValues): MediaItemDetailsFormValues {
		return {
			...values,
			genres: this.normalizeTextArray(values.genres),
			authors: this.normalizeTextArray(values.authors),
			directors: this.normalizeTextArray(values.directors),
			creators: this.normalizeTextArray(values.creators),
			developers: this.normalizeTextArray(values.developers),
			publishers: this.normalizeTextArray(values.publishers),
			platforms: this.normalizeTextArray(values.platforms)
		};
	}

	/**
	 * Trims and filters an optional text array
	 * @param values array values
	 * @returns normalized array or undefined
	 */
	private normalizeTextArray(values?: string[]): string[] | undefined {
		if(!values || values.length === 0) {
			return undefined;
		}

		const normalizedValues = values
			.map((value) => {
				return value.trim();
			})
			.filter((value) => {
				return value.length > 0;
			});

		return normalizedValues.length > 0 ? normalizedValues : undefined;
	}
}

/**
 * MediaItemDetailsScreenComponent's input props
 */
export type MediaItemDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Media item loaded from Redux state
	 */
	mediaItem: MediaItemInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;

	/**
	 * TV show seasons loaded from seasons flow
	 */
	tvShowSeasons: TvShowSeasonInternal[];

	/**
	 * Timestamp updated when seasons flow is completed
	 */
	tvShowSeasonsLoadTimestamp: Date | undefined;
}

/**
 * MediaItemDetailsScreenComponent's output props
 */
export type MediaItemDetailsScreenComponentOutput = {
	/**
	 * Callback to save media item
	 */
	saveMediaItem: (mediaItem: MediaItemInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to open TV show seasons flow
	 */
	handleTvShowSeasons: (currentSeasons?: TvShowSeasonInternal[]) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type MediaItemDetailsScreenComponentState = {
	formValues: MediaItemDetailsFormValues;
	confirmSameNameVisible: boolean;
}
