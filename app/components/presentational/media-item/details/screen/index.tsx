import React, { Component, KeyboardEvent, ReactNode } from 'react';
import { config } from 'app/config/config';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { DEFAULT_CATALOG_BOOK, DEFAULT_BOOK, BookInternal } from 'app/data/models/internal/media-items/book';
import { GroupInternal } from 'app/data/models/internal/group';
import { CatalogMediaItemInternal, MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MediaItemInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { DEFAULT_CATALOG_MOVIE, MovieInternal } from 'app/data/models/internal/media-items/movie';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { DEFAULT_CATALOG_TV_SHOW, TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { DEFAULT_CATALOG_VIDEOGAME, VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import downloadIcon from 'app/resources/images/ic_download.png';
import googleIcon from 'app/resources/images/ic_google.png';
import howLongToBeatIcon from 'app/resources/images/ic_howlongtobeat.png';
import justWatchIcon from 'app/resources/images/ic_justwatch.png';
import defaultMediaItemImage from 'app/resources/images/im_media_item_form_default.png';
import wikipediaIcon from 'app/resources/images/ic_wikipedia.png';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

type MediaItemDetailsFormValues = MediaItemInternal & Partial<BookInternal & MovieInternal & TvShowInternal & VideogameInternal>;

type MediaItemActionButton = {
	key: string;
	label: string;
	icon: string;
	disabled: boolean;
	onClick: () => void;
};

/**
 * Presentational component that contains the whole "media item details" screen, that works as the "add new media item", "update media item" and
 * "view media item data" sections
 */
export class MediaItemDetailsScreenComponent extends Component<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput, MediaItemDetailsScreenComponentState> {
	public state: MediaItemDetailsScreenComponentState = {
		formValues: DEFAULT_BOOK,
		confirmSameNameVisible: false,
		confirmReloadCatalogVisible: false,
		pendingReloadCatalogId: undefined
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
	public componentDidUpdate(
		prevProps: Readonly<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput>,
		prevState: Readonly<MediaItemDetailsScreenComponentState>
	): void {
		if(this.areMediaItemsDifferent(prevProps.mediaItem, this.props.mediaItem)) {
			this.syncFormValuesWithProps();
			return;
		}

		this.checkLoadTvShowSeasons();
		this.checkLoadCatalogDetails(prevProps.catalogDetails);
		this.checkLoadSelectedGroup(prevProps.selectedGroup);
		this.checkLoadSelectedOwnPlatform(prevProps.selectedOwnPlatform);

		if(!prevProps.sameNameConfirmationRequested && this.props.sameNameConfirmationRequested) {
			this.setState({
				confirmSameNameVisible: true
			});
		}

		if(prevState.formValues !== this.state.formValues) {
			this.notifyFormStatus();
			this.props.persistFormDraft(this.state.formValues);
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
			confirmSameNameVisible,
			confirmReloadCatalogVisible
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
					{this.renderImageButtonsRow(formValues)}
					{this.renderNameField(formValues)}
					{this.renderDescriptionField(formValues)}
					{this.renderReleaseDateField(formValues)}
					{this.renderTypeSpecificPrimaryFields(formValues)}
					{this.renderGenresField(formValues)}
					{this.renderImportanceField(formValues)}
					{this.renderOwnPlatformField(formValues)}
					{this.renderGroupField(formValues)}
					{this.renderOrderInGroupField(formValues)}
					{this.renderUserCommentField(formValues)}
					{this.renderCompletionDatesField(formValues)}
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
				<ConfirmDialogComponent
					visible={confirmReloadCatalogVisible}
					title={i18n.t('mediaItem.common.alert.reloadCatalog.title')}
					message={i18n.t('mediaItem.common.alert.reloadCatalog.message')}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						const {
							pendingReloadCatalogId
						} = this.state;

						this.setState({
							confirmReloadCatalogVisible: false,
							pendingReloadCatalogId: undefined
						}, () => {
							if(pendingReloadCatalogId) {
								this.props.loadMediaItemCatalogDetails(pendingReloadCatalogId);
							}
						});
					}}
					onCancel={() => {
						this.setState({
							confirmReloadCatalogVisible: false,
							pendingReloadCatalogId: undefined
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
		this.loadedTvShowSeasonsTimestamp = this.props.tvShowSeasonsLoadTimestamp;

		this.setState({
			formValues: this.buildFormValuesFromProps()
		});
	}

	/**
	 * Builds form values from Redux props, including staged selections and unsaved catalog data
	 * @returns initial form values
	 */
	private buildFormValuesFromProps(): MediaItemDetailsFormValues {
		const hasDraft = Boolean(this.props.draftMediaItem);
		const sourceMediaItem = this.props.draftMediaItem || this.props.mediaItem;
		let formValues: MediaItemDetailsFormValues = {
			...sourceMediaItem
		};

		if(!hasDraft && this.props.catalogDetails) {
			formValues = this.mergeCatalogDetails(formValues, this.props.catalogDetails);
		}

		if(formValues.mediaType === 'TV_SHOW' && this.props.tvShowSeasonsLoadTimestamp) {
			formValues = {
				...formValues,
				seasons: this.props.tvShowSeasons.length > 0 ? [ ...this.props.tvShowSeasons ] : undefined
			};
		}

		return {
			...formValues,
			group: this.props.selectedGroup,
			ownPlatform: this.props.selectedOwnPlatform
		};
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
	 * Checks if catalog details must be merged into the current form
	 * @param prevCatalogDetails previous catalog details
	 */
	private checkLoadCatalogDetails(prevCatalogDetails?: CatalogMediaItemInternal): void {
		const {
			catalogDetails
		} = this.props;

		if(!catalogDetails || prevCatalogDetails?.catalogLoadId === catalogDetails.catalogLoadId) {
			return;
		}

		this.setState((prevState) => {
			return {
				formValues: this.mergeCatalogDetails(prevState.formValues, catalogDetails)
			};
		});
	}

	/**
	 * Checks if the selected group has changed in Redux
	 * @param prevSelectedGroup previous selected group
	 */
	private checkLoadSelectedGroup(prevSelectedGroup?: GroupInternal): void {
		if(prevSelectedGroup?.id === this.props.selectedGroup?.id) {
			return;
		}

		this.setState((prevState) => {
			const group = this.props.selectedGroup;
			return {
				formValues: {
					...prevState.formValues,
					group: group,
					orderInGroup: group ? prevState.formValues.orderInGroup : undefined
				}
			};
		});
	}

	/**
	 * Checks if the selected own platform has changed in Redux
	 * @param prevSelectedOwnPlatform previous selected own platform
	 */
	private checkLoadSelectedOwnPlatform(prevSelectedOwnPlatform?: OwnPlatformInternal): void {
		if(prevSelectedOwnPlatform?.id === this.props.selectedOwnPlatform?.id) {
			return;
		}

		this.setState((prevState) => {
			return {
				formValues: {
					...prevState.formValues,
					ownPlatform: this.props.selectedOwnPlatform
				}
			};
		});
	}

	/**
	 * Renders the image and its action buttons
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderImageButtonsRow(mediaItem: MediaItemDetailsFormValues): ReactNode {
		if(!mediaItem.id && !mediaItem.catalogId) {
			return null;
		}

		const buttons = this.getActionButtons(mediaItem);

		return (
			<div className='media-item-details-image-row'>
				<div className='media-item-details-image-wrapper'>
					<img
						className='media-item-details-image'
						src={mediaItem.imageUrl || defaultMediaItemImage}
						alt={`${mediaItem.name || i18n.t(`category.mediaTypes.${mediaItem.mediaType}`)} cover`}
					/>
				</div>
				<div className='media-item-details-image-actions'>
					{buttons.map((button) => {
						return (
							<button
								key={button.key}
								type='button'
								className='media-item-details-image-action'
								disabled={button.disabled}
								aria-label={button.label}
								title={button.label}
								onClick={button.onClick}>
								<img className='media-item-details-image-action-icon' src={button.icon} alt='' />
							</button>
						);
					})}
				</div>
			</div>
		);
	}

	/**
	 * Renders the catalog-aware name field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderNameField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-name'>
					{i18n.t('mediaItem.details.placeholders.name')}
				</label>
				<div className='media-item-details-search-row'>
					<input
						id='media-item-name'
						className='media-item-details-input'
						type='text'
						value={mediaItem.name}
						onChange={(event) => {
							if(this.props.catalogSearchResults && this.props.catalogSearchResults.length > 0) {
								this.props.resetMediaItemsCatalogSearch();
							}

							this.setFormField('name', event.target.value);
						}}
						onKeyDown={(event) => {
							this.handleNameFieldKeyDown(event);
						}}
					/>
					<button
						type='button'
						className='media-item-details-button media-item-details-button-secondary media-item-details-search-button'
						disabled={!mediaItem.name.trim()}
						onClick={() => {
							this.submitCatalogSearch();
						}}>
						Search
					</button>
				</div>
				{this.renderCatalogSearchResults()}
			</>
		);
	}

	/**
	 * Renders catalog search suggestions
	 * @returns the component
	 */
	private renderCatalogSearchResults(): ReactNode {
		const {
			catalogSearchResults
		} = this.props;

		if(!catalogSearchResults || catalogSearchResults.length === 0) {
			return null;
		}

		return (
			<div className='media-item-details-search-results'>
				{catalogSearchResults.map((result) => {
					return (
						<button
							key={result.catalogId}
							type='button'
							className='media-item-details-search-result'
							onClick={() => {
								this.props.resetMediaItemsCatalogSearch();
								this.props.loadMediaItemCatalogDetails(result.catalogId);
							}}>
							{this.formatCatalogSearchResult(result)}
						</button>
					);
				})}
			</div>
		);
	}

	/**
	 * Formats a catalog search result label
	 * @param result catalog search result
	 * @returns label
	 */
	private formatCatalogSearchResult(result: SearchMediaItemCatalogResultInternal): string {
		if(!result.releaseDate) {
			return result.name;
		}

		return i18n.t('mediaItem.details.catalog.result.fullLabel', {
			name: result.name,
			releaseDate: result.releaseDate.getFullYear()
		});
	}

	/**
	 * Renders the description field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderDescriptionField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-description'>
					{i18n.t('mediaItem.details.placeholders.description')}
				</label>
				<textarea
					id='media-item-description'
					className='media-item-details-textarea'
					value={mediaItem.description || ''}
					onChange={(event) => {
						this.setFormField('description', event.target.value || undefined);
					}}
				/>
			</>
		);
	}

	/**
	 * Renders the release date field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderReleaseDateField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-release-date'>
					{i18n.t('mediaItem.details.placeholders.releaseDate')}
				</label>
				<input
					id='media-item-release-date'
					className='media-item-details-input'
					type='date'
					value={this.dateToInputValue(mediaItem.releaseDate)}
					onChange={(event) => {
						this.setFormField('releaseDate', this.inputValueToDate(event.target.value));
					}}
				/>
			</>
		);
	}

	/**
	 * Renders the common genres field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderGenresField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return this.renderArrayTextInputField(
			'media-item-genres',
			i18n.t('mediaItem.details.placeholders.genres'),
			mediaItem.genres,
			(values) => {
				this.setFormField('genres', values);
			}
		);
	}

	/**
	 * Renders the importance field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderImportanceField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-importance'>
					{i18n.t('mediaItem.details.prompts.importance')}
				</label>
				<select
					id='media-item-importance'
					className='media-item-details-select'
					value={mediaItem.importance}
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
			</>
		);
	}

	/**
	 * Renders the own platform field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderOwnPlatformField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		const ownPlatform = mediaItem.ownPlatform;

		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-own-platform'>
					{i18n.t('mediaItem.details.placeholders.ownPlatform')}
				</label>
				<button
					id='media-item-own-platform'
					type='button'
					className='media-item-details-picker-button'
					onClick={this.props.requestOwnPlatformSelection}>
					<span className='media-item-details-picker-value'>
						{ownPlatform && (
							<span className='media-item-details-picker-swatch' style={{ backgroundColor: ownPlatform.color }} />
						)}
						<span>{ownPlatform?.name || i18n.t('ownPlatform.list.none')}</span>
					</span>
					<span className='media-item-details-picker-action'>Select</span>
				</button>
			</>
		);
	}

	/**
	 * Renders the group field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderGroupField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-group'>
					{i18n.t('mediaItem.details.placeholders.group')}
				</label>
				<button
					id='media-item-group'
					type='button'
					className='media-item-details-picker-button'
					onClick={this.props.requestGroupSelection}>
					<span className='media-item-details-picker-value'>
						{mediaItem.group?.name || i18n.t('group.list.none')}
					</span>
					<span className='media-item-details-picker-action'>Select</span>
				</button>
			</>
		);
	}

	/**
	 * Renders the order-in-group field only when a group is selected
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderOrderInGroupField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		if(!mediaItem.group) {
			return null;
		}

		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-order-in-group'>
					{i18n.t('mediaItem.details.placeholders.orderInGroup')}
				</label>
				<input
					id='media-item-order-in-group'
					className='media-item-details-input'
					type='number'
					value={this.numberToInputValue(mediaItem.orderInGroup)}
					onChange={(event) => {
						this.setFormField('orderInGroup', this.inputValueToNumber(event.target.value));
					}}
				/>
			</>
		);
	}

	/**
	 * Renders the user comment field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderUserCommentField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor='media-item-user-comment'>
					{i18n.t('mediaItem.details.placeholders.userComment')}
				</label>
				<textarea
					id='media-item-user-comment'
					className='media-item-details-textarea'
					value={mediaItem.userComment || ''}
					onChange={(event) => {
						this.setFormField('userComment', event.target.value || undefined);
					}}
				/>
			</>
		);
	}

	/**
	 * Renders the completion dates field
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderCompletionDatesField(mediaItem: MediaItemDetailsFormValues): ReactNode {
		const completionDates = mediaItem.completedOn ? mediaItem.completedOn : [];

		return (
			<>
				<label className='media-item-details-label'>
					{i18n.t('mediaItem.details.placeholders.completedOn')}
				</label>
				<div className='media-item-details-completion-list'>
					{completionDates.length === 0 && (
						<p className='media-item-details-inline-hint'>No dates added yet</p>
					)}
					{completionDates.map((completedOn, index) => {
						return (
							<div className='media-item-details-completion-row' key={`completed-on-${index}`}>
								<input
									id={`media-item-completed-on-${index}`}
									className='media-item-details-input'
									type='date'
									value={this.dateToInputValue(completedOn)}
									onChange={(event) => {
										this.updateCompletionDate(index, event.target.value);
									}}
								/>
								<button
									type='button'
									className='media-item-details-button media-item-details-button-secondary media-item-details-small-button'
									onClick={() => {
										this.removeCompletionDate(index);
									}}>
									Remove
								</button>
							</div>
						);
					})}
					<button
						type='button'
						className='media-item-details-button media-item-details-button-secondary media-item-details-inline-button'
						onClick={() => {
							this.addCompletionDate();
						}}>
						Add date
					</button>
				</div>
			</>
		);
	}

	/**
	 * Renders fields specific to current media item type
	 * @param mediaItem the current media item values
	 * @returns the fields
	 */
	private renderTypeSpecificPrimaryFields(mediaItem: MediaItemDetailsFormValues): ReactNode {
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

						{this.renderArrayTextInputField(
							'media-item-book-authors',
							i18n.t('mediaItem.details.placeholders.creators.BOOK'),
							book.authors,
							(values) => {
								this.setFormField('authors', values);
							}
						)}
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

						{this.renderArrayTextInputField(
							'media-item-movie-directors',
							i18n.t('mediaItem.details.placeholders.creators.MOVIE'),
							movie.directors,
							(values) => {
								this.setFormField('directors', values);
							}
						)}
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

						{this.renderArrayTextInputField(
							'media-item-tv-show-creators',
							i18n.t('mediaItem.details.placeholders.creators.TV_SHOW'),
							tvShow.creators,
							(values) => {
								this.setFormField('creators', values);
							}
						)}

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

						{this.renderArrayTextInputField(
							'media-item-videogame-developers',
							i18n.t('mediaItem.details.placeholders.creators.VIDEOGAME'),
							videogame.developers,
							(values) => {
								this.setFormField('developers', values);
							}
						)}

						{this.renderArrayTextInputField(
							'media-item-videogame-publishers',
							i18n.t('mediaItem.details.placeholders.publishers'),
							videogame.publishers,
							(values) => {
								this.setFormField('publishers', values);
							}
						)}

						{this.renderArrayTextInputField(
							'media-item-videogame-platforms',
							i18n.t('mediaItem.details.placeholders.platforms'),
							videogame.platforms,
							(values) => {
								this.setFormField('platforms', values);
							}
						)}
					</>
				);
			}

			default:
				return null;
		}
	}

	/**
	 * Renders a single-line text input for array values
	 * @param id field ID
	 * @param label field label
	 * @param values field values
	 * @param onChange change handler
	 * @returns the component
	 */
	private renderArrayTextInputField(id: string, label: string, values: string[] | undefined, onChange: (newValues: string[] | undefined) => void): ReactNode {
		return (
			<>
				<label className='media-item-details-label' htmlFor={id}>
					{label}
				</label>
				<input
					id={id}
					className='media-item-details-input'
					type='text'
					value={this.inlineTextToInputValue(values)}
					onChange={(event) => {
						onChange(this.inputValueToInlineText(event.target.value));
					}}
				/>
			</>
		);
	}

	/**
	 * Builds the action buttons for the media image row
	 * @param mediaItem current media item
	 * @returns action buttons
	 */
	private getActionButtons(mediaItem: MediaItemDetailsFormValues): MediaItemActionButton[] {
		const buttons: MediaItemActionButton[] = [
			{
				key: 'google',
				label: i18n.t('mediaItem.details.buttons.google'),
				icon: googleIcon,
				disabled: !mediaItem.name,
				onClick: () => {
					this.openExternalLink(config.external.googleSearch(encodeURIComponent(mediaItem.name)));
				}
			},
			{
				key: 'wikipedia',
				label: i18n.t('mediaItem.details.buttons.wikipedia'),
				icon: wikipediaIcon,
				disabled: !mediaItem.name,
				onClick: () => {
					this.openExternalLink(config.external.wikipediaSearch(encodeURIComponent(mediaItem.name)));
				}
			}
		];

		if(mediaItem.mediaType === 'MOVIE' || mediaItem.mediaType === 'TV_SHOW') {
			buttons.push({
				key: 'just-watch',
				label: i18n.t('mediaItem.details.buttons.justWatch'),
				icon: justWatchIcon,
				disabled: !mediaItem.name,
				onClick: () => {
					this.openExternalLink(config.external.justWatchSearch(encodeURIComponent(mediaItem.name)));
				}
			});
		}

		if(mediaItem.mediaType === 'VIDEOGAME') {
			buttons.push({
				key: 'how-long-to-beat',
				label: i18n.t('mediaItem.details.buttons.howLongToBeat'),
				icon: howLongToBeatIcon,
				disabled: !mediaItem.name,
				onClick: () => {
					this.openExternalLink(config.external.howLongToBeatSearch(encodeURIComponent(mediaItem.name)));
				}
			});
		}

		buttons.push({
			key: 'reload-catalog',
			label: i18n.t('mediaItem.details.buttons.downloadCatalog'),
			icon: downloadIcon,
			disabled: !mediaItem.catalogId,
			onClick: () => {
				if(mediaItem.catalogId) {
					this.setState({
						confirmReloadCatalogVisible: true,
						pendingReloadCatalogId: mediaItem.catalogId
					});
				}
			}
		});

		return buttons;
	}

	/**
	 * Opens an external link in a new tab
	 * @param url target URL
	 */
	private openExternalLink(url: string): void {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	/**
	 * Submits the current name as a catalog search term
	 */
	private submitCatalogSearch(): void {
		const term = this.state.formValues.name.trim();

		if(!term) {
			return;
		}

		this.props.searchMediaItemsCatalog(term);
	}

	/**
	 * Handles keyboard interactions on the name field
	 * @param event keyboard event
	 */
	private handleNameFieldKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
		if(event.key !== 'Enter') {
			return;
		}

		event.preventDefault();
		this.submitCatalogSearch();
	}

	/**
	 * Merges catalog details into the current form values
	 * @param currentValues current form values
	 * @param catalogDetails latest catalog details
	 * @returns merged values
	 */
	private mergeCatalogDetails(currentValues: MediaItemDetailsFormValues, catalogDetails: CatalogMediaItemInternal): MediaItemDetailsFormValues {
		const mergedValues: MediaItemDetailsFormValues = {
			...currentValues,
			...this.getDefaultCatalogDetails(currentValues.mediaType),
			...catalogDetails
		};

		if(currentValues.mediaType === 'TV_SHOW') {
			const currentTvShow = currentValues as TvShowInternal;
			const mergedTvShow = mergedValues as TvShowInternal;
			const currentSeasons = currentTvShow.seasons;
			const newSeasons = mergedTvShow.seasons;

			if(newSeasons && newSeasons.length > 0 && currentSeasons && currentSeasons.length > 0) {
				for(const newSeason of newSeasons) {
					const currentSeason = currentSeasons.find((season) => {
						return season.number === newSeason.number;
					});

					if(currentSeason) {
						newSeason.watchedEpisodesNumber = currentSeason.watchedEpisodesNumber;
					}
				}
			}
		}

		return mergedValues;
	}

	/**
	 * Returns the empty catalog-linked fields for the active media type
	 * @param mediaType current media type
	 * @returns default catalog details
	 */
	private getDefaultCatalogDetails(mediaType: MediaItemInternal['mediaType']): CatalogMediaItemInternal {
		switch(mediaType) {
			case 'BOOK':
				return DEFAULT_CATALOG_BOOK;

			case 'MOVIE':
				return DEFAULT_CATALOG_MOVIE;

			case 'TV_SHOW':
				return DEFAULT_CATALOG_TV_SHOW;

			case 'VIDEOGAME':
				return DEFAULT_CATALOG_VIDEOGAME;

			default:
				return DEFAULT_CATALOG_BOOK;
		}
	}

	/**
	 * Adds a completion date entry
	 */
	private addCompletionDate(): void {
		const completionDates = this.state.formValues.completedOn ? [ ...this.state.formValues.completedOn ] : [];

		completionDates.push(new Date());
		this.setFormField('completedOn', completionDates);
	}

	/**
	 * Updates a completion date entry
	 * @param index row index
	 * @param value date input value
	 */
	private updateCompletionDate(index: number, value: string): void {
		const completionDates = this.state.formValues.completedOn ? [ ...this.state.formValues.completedOn ] : [];
		const parsedDate = this.inputValueToDate(value);

		if(!parsedDate) {
			completionDates.splice(index, 1);
		}
		else {
			completionDates[index] = parsedDate;
		}

		this.setFormField('completedOn', completionDates.length > 0 ? completionDates : undefined);
	}

	/**
	 * Removes a completion date entry
	 * @param index row index
	 */
	private removeCompletionDate(index: number): void {
		const completionDates = this.state.formValues.completedOn ? [ ...this.state.formValues.completedOn ] : [];

		completionDates.splice(index, 1);
		this.setFormField('completedOn', completionDates.length > 0 ? completionDates : undefined);
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
		const hasImportance = Boolean(mediaItem.importance);
		const hasRequiredOrderIfGroupSelected = mediaItem.group?.id ? mediaItem.orderInGroup !== undefined && this.isOptionalNumberValid(mediaItem.orderInGroup) : true;

		if(!hasName || !hasImportance || !hasRequiredOrderIfGroupSelected) {
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
	 * Converts an optional string array to an inline input value
	 * @param values array values
	 * @returns comma-separated string
	 */
	private inlineTextToInputValue(values?: string[]): string {
		if(!values || values.length === 0) {
			return '';
		}
		return values.join(', ');
	}

	/**
	 * Converts an inline text value to an optional string array
	 * @param value current input value
	 * @returns array or undefined
	 */
	private inputValueToInlineText(value: string): string[] | undefined {
		const trimmedValue = value.trim();
		if(!trimmedValue) {
			return undefined;
		}
		if(!value.includes(',')) {
			return [ value ];
		}

		const tokens = value
			.split(',')
			.map((token) => {
				return token.trim();
			})
			.filter((token) => {
				return token.length > 0;
			});

		return tokens.length > 0 ? tokens : undefined;
	}

	/**
	 * Normalizes form values before save
	 * @param values form values
	 * @returns normalized form values
	 */
	private normalizeFormValues(values: MediaItemDetailsFormValues): MediaItemDetailsFormValues {
		const normalizedValues: MediaItemDetailsFormValues = {
			...values,
			status: this.buildStatusLabel(values)
		};

		if(values.group?.id) {
			normalizedValues.orderInGroup = values.orderInGroup;
		}
		else {
			delete normalizedValues.orderInGroup;
		}

		this.applyNormalizedTextArray(normalizedValues, 'genres', values.genres);
		this.applyNormalizedTextArray(normalizedValues, 'authors', values.authors);
		this.applyNormalizedTextArray(normalizedValues, 'directors', values.directors);
		this.applyNormalizedTextArray(normalizedValues, 'creators', values.creators);
		this.applyNormalizedTextArray(normalizedValues, 'developers', values.developers);
		this.applyNormalizedTextArray(normalizedValues, 'publishers', values.publishers);
		this.applyNormalizedTextArray(normalizedValues, 'platforms', values.platforms);

		return normalizedValues;
	}

	/**
	 * Builds the internal status label from other media item fields
	 * @param values form values
	 * @returns status label
	 */
	private buildStatusLabel(values: MediaItemDetailsFormValues): MediaItemInternal['status'] {
		if(values.completedOn && values.completedOn.length > 0 && !values.markedAsRedo) {
			return 'COMPLETE';
		}
		if(values.active) {
			return 'ACTIVE';
		}
		if(values.completedOn && values.completedOn.length > 0 && values.markedAsRedo) {
			return 'REDO';
		}
		if(values.releaseDate && values.releaseDate > new Date()) {
			return 'UPCOMING';
		}
		return values.status || 'NEW';
	}

	/**
	 * Applies a normalized string array only when needed
	 * @param target target object
	 * @param key target key
	 * @param values original values
	 */
	private applyNormalizedTextArray<K extends keyof MediaItemDetailsFormValues>(target: MediaItemDetailsFormValues, key: K, values: string[] | undefined): void {
		const normalizedValues = this.normalizeTextArray(values);

		if(normalizedValues) {
			target[key] = normalizedValues as MediaItemDetailsFormValues[K];
		}
		else {
			delete target[key];
		}
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
	 * Current unsaved form draft, if any
	 */
	draftMediaItem?: MediaItemInternal;

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

	/**
	 * Current catalog search results
	 */
	catalogSearchResults?: SearchMediaItemCatalogResultInternal[];

	/**
	 * Current catalog details
	 */
	catalogDetails?: CatalogMediaItemInternal;

	/**
	 * Current selected group
	 */
	selectedGroup?: GroupInternal;

	/**
	 * Current selected own platform
	 */
	selectedOwnPlatform?: OwnPlatformInternal;
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
	 * Callback to persist the current unsaved form draft
	 */
	persistFormDraft: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to open TV show seasons flow
	 */
	handleTvShowSeasons: (currentSeasons?: TvShowSeasonInternal[]) => void;

	/**
	 * Callback to request group selection
	 */
	requestGroupSelection: () => void;

	/**
	 * Callback to request own platform selection
	 */
	requestOwnPlatformSelection: () => void;

	/**
	 * Callback to search media items catalog
	 */
	searchMediaItemsCatalog: (term: string) => void;

	/**
	 * Callback to load media item catalog details
	 */
	loadMediaItemCatalogDetails: (catalogId: string) => void;

	/**
	 * Callback to clear media items catalog search results
	 */
	resetMediaItemsCatalogSearch: () => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type MediaItemDetailsScreenComponentState = {
	formValues: MediaItemDetailsFormValues;
	confirmSameNameVisible: boolean;
	confirmReloadCatalogVisible: boolean;
	pendingReloadCatalogId?: string;
}
