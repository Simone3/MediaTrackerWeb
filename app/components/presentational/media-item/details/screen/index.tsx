import React, { Component, ReactNode } from 'react';
import { DEFAULT_BOOK } from 'app/data/models/internal/media-items/book';
import { MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MEDIA_ITEM_STATUS_INTERNAL_VALUES, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "media item details" screen, that works as the "add new media item", "update media item" and
 * "view media item data" sections
 */
export class MediaItemDetailsScreenComponent extends Component<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput, MediaItemDetailsScreenComponentState> {
	public state: MediaItemDetailsScreenComponentState = {
		formValues: DEFAULT_BOOK
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
	public componentDidUpdate(prevProps: Readonly<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput>, prevState: Readonly<MediaItemDetailsScreenComponentState>): void {
		if(this.areMediaItemsDifferent(prevProps.mediaItem, this.props.mediaItem)) {
			this.syncFormValuesWithProps();
			return;
		}

		if(!prevProps.sameNameConfirmationRequested && this.props.sameNameConfirmationRequested) {
			this.handleSameNameConfirmation();
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
			formValues
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
		this.setState({
			formValues: {
				...this.props.mediaItem
			}
		}, () => {
			this.notifyFormStatus();
		});
	}

	/**
	 * Handles same-name confirmation flow
	 */
	private handleSameNameConfirmation(): void {
		const {
			formValues
		} = this.state;
		const title = i18n.t('mediaItem.common.alert.addSameName.title');
		const message = i18n.t(`mediaItem.common.alert.addSameName.message.${formValues.mediaType}`);

		// Keep native confirm for phase 2 to preserve existing blocking UX with minimal migration risk.
		// eslint-disable-next-line no-alert
		const confirmed = window.confirm(`${title}\n\n${message}`);

		if(confirmed) {
			this.submitForm(true);
		}
	}

	/**
	 * Handles a single field update
	 * @param key the field key
	 * @param value the field value
	 */
	private setFormField<K extends keyof MediaItemInternal>(key: K, value: MediaItemInternal[K]): void {
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

		if(!this.isFormValid(formValues)) {
			this.notifyFormStatus();
			return;
		}

		this.props.saveMediaItem(formValues, confirmSameName);
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
	private isFormValid(mediaItem: MediaItemInternal): boolean {
		const hasName = Boolean(mediaItem.name && mediaItem.name.trim());
		const hasRequiredEnums = Boolean(mediaItem.mediaType) && Boolean(mediaItem.status) && Boolean(mediaItem.importance);
		const hasOrderIfGroupSelected = mediaItem.group?.id ? mediaItem.orderInGroup !== undefined : true;
		return hasName && hasRequiredEnums && hasOrderIfGroupSelected;
	}

	/**
	 * Checks if local form differs from initial Redux media item
	 * @param mediaItem the current media item values
	 * @returns true if dirty
	 */
	private isFormDirty(mediaItem: MediaItemInternal): boolean {
		return this.areMediaItemsDifferent(mediaItem, this.props.mediaItem);
	}

	/**
	 * Checks if two media items differ on fields handled by this form
	 * @param left first media item
	 * @param right second media item
	 * @returns true if different
	 */
	private areMediaItemsDifferent(left: MediaItemInternal, right: MediaItemInternal): boolean {
		return left.id !== right.id ||
			left.name !== right.name ||
			left.mediaType !== right.mediaType ||
			left.status !== right.status ||
			left.importance !== right.importance ||
			left.description !== right.description ||
			left.userComment !== right.userComment ||
			this.dateToComparable(left.releaseDate) !== this.dateToComparable(right.releaseDate);
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
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type MediaItemDetailsScreenComponentState = {
	formValues: MediaItemInternal;
}
