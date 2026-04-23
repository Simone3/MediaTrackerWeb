import { Component, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { FormikProps } from 'formik';
import { ClearableInputComponent } from 'app/components/presentational/generic/clearable-input';
import { InputComponent } from 'app/components/presentational/generic/input';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { SelectComponent } from 'app/components/presentational/generic/select';
import { TextareaComponent } from 'app/components/presentational/generic/textarea';
import { config } from 'app/config/config';
import { MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MediaItemInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import downloadIcon from 'app/resources/images/ic_download.svg';
import googleIcon from 'app/resources/images/ic_google.png';
import defaultMediaItemImage from 'app/resources/images/im_media_item_form_default.png';
import wikipediaIcon from 'app/resources/images/ic_wikipedia.png';
import { i18n } from 'app/utilities/i18n';

export type MediaItemActionButton = {
	key: string;
	label: string;
	icon: string;
	disabled: boolean;
	onClick: () => void;
};

type MediaItemDetailsSectionKey = 'basics' | 'profile' | 'collection' | 'progress';

/**
 * Converts optional Date to input string
 * @param currentDate the date
 * @returns yyyy-mm-dd or empty string
 */
export const dateToInputValue = (currentDate?: Date): string => {
	if(!currentDate) {
		return '';
	}

	const year = `${currentDate.getFullYear()}`.padStart(4, '0');
	const month = `${currentDate.getMonth() + 1}`.padStart(2, '0');
	const day = `${currentDate.getDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
};

/**
 * Converts an input date string to Date
 * @param value yyyy-mm-dd input value
 * @returns date or undefined
 */
export const inputValueToDate = (value: string): Date | undefined => {
	if(!value) {
		return undefined;
	}

	const [ year, month, day ] = value.split('-').map(Number);
	return new Date(year, month - 1, day);
};

/**
 * Converts an optional number to an input-safe value
 * @param value number
 * @returns input value
 */
export const numberToInputValue = (value?: number): number | '' => {
	return value !== undefined ? value : '';
};

/**
 * Converts an input text value to optional number
 * @param value input string
 * @returns number or undefined
 */
export const inputValueToNumber = (value: string): number | undefined => {
	if(!value) {
		return undefined;
	}

	const parsed = Number(value);
	return Number.isNaN(parsed) ? undefined : parsed;
};

/**
 * Converts an optional string array to an inline input value
 * @param values array values
 * @returns comma-separated string
 */
export const inlineTextToInputValue = (values?: string[]): string => {
	if(!values || values.length === 0) {
		return '';
	}

	return values.join(', ');
};

/**
 * Converts an inline text value to an optional string array
 * @param value current input value
 * @returns array or undefined
 */
export const inputValueToInlineText = (value: string): string[] | undefined => {
	if(value === '') {
		return undefined;
	}

	if(!value.includes(',')) {
		return [ value ];
	}

	return value.split(',');
};

/**
 * Checks whether two optional inline-text arrays match exactly
 * @param first first array
 * @param second second array
 * @returns whether both arrays match
 */
const areInlineTextArraysEqual = (first?: string[], second?: string[]): boolean => {
	const firstValues = first || [];
	const secondValues = second || [];

	if(firstValues.length !== secondValues.length) {
		return false;
	}

	return firstValues.every((value, index) => {
		return value === secondValues[index];
	});
};

type InlineTextInputComponentProps = {
	id: string;
	values?: string[];
	onChange: (newValues: string[] | undefined) => void;
};

/**
 * Preserves raw typing for inline text fields while still syncing array values to Formik
 * @param props component props
 * @returns the component
 */
export const InlineTextInputComponent = (props: InlineTextInputComponentProps): ReactNode => {
	const {
		id,
		onChange,
		values
	} = props;
	const [ inputValue, setInputValue ] = useState(() => {
		return inlineTextToInputValue(values);
	});
	const inputValueRef = useRef(inputValue);

	useEffect(() => {
		inputValueRef.current = inputValue;
	}, [ inputValue ]);

	useEffect(() => {
		if(areInlineTextArraysEqual(values, inputValueToInlineText(inputValueRef.current))) {
			return;
		}

		const nextInputValue = inlineTextToInputValue(values);

		inputValueRef.current = nextInputValue;
		setInputValue(nextInputValue);
	}, [ values ]);

	return (
		<InputComponent
			id={id}
			type='text'
			value={inputValue}
			onChange={(event) => {
				const nextInputValue = event.target.value;

				inputValueRef.current = nextInputValue;
				setInputValue(nextInputValue);
				onChange(inputValueToInlineText(nextInputValue));
			}}
		/>
	);
};

/**
 * Presentational component that contains all generic media item form input fields, all handled by the Formik container component
 */
export class MediaItemFormViewComponent<TMediaItem extends MediaItemInternal = MediaItemInternal> extends Component<MediaItemFormViewComponentProps<TMediaItem>> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.notifyFormState();
		this.props.persistFormDraft(this.props.values);
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemFormViewComponentProps<TMediaItem>>): void {
		if(prevProps.isValid !== this.props.isValid ||
			prevProps.values !== this.props.values) {
			this.notifyFormState();
		}

		if(prevProps.values !== this.props.values) {
			this.props.persistFormDraft(this.props.values);
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<>
				{this.renderImageActionsRow(this.props.values)}
				{this.renderFormSections(this.props.values)}
			</>
		);
	}

	/**
	 * Notifies Redux about current form validity and dirty status
	 */
	private notifyFormState(): void {
		this.props.notifyFormStatus(
			this.props.isValid,
			this.props.dirty
		);
	}

	/**
	 * Renders the top image and action row
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderImageActionsRow(mediaItem: TMediaItem): ReactNode {
		if(!mediaItem.id && !mediaItem.catalogId) {
			return null;
		}

		const buttons = this.getActionButtons(mediaItem);
		const mediaTypeLabel = i18n.t(`category.mediaTypes.${mediaItem.mediaType}`);

		return (
			<section className='media-item-details-panel media-item-details-media-panel'>
				<div className='media-item-details-image-wrapper'>
					<img
						className='media-item-details-image'
						src={mediaItem.imageUrl || defaultMediaItemImage}
						alt={`${mediaItem.name || mediaTypeLabel} cover`}
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
			</section>
		);
	}

	/**
	 * Renders the main form sections
	 * @param mediaItem current media item
	 * @returns the component
	 */
	private renderFormSections(mediaItem: TMediaItem): ReactNode {
		return (
			<div className='media-item-details-main'>
				{this.renderSection('basics', (
					<div className='media-item-details-grid'>
						{this.renderNameField(mediaItem, 'media-item-details-field media-item-details-field-span-2')}
						{this.renderDescriptionField(mediaItem, 'media-item-details-field media-item-details-field-span-2')}
						{this.renderReleaseDateField(mediaItem)}
					</div>
				))}
				{this.renderSection('profile', (
					<div className='media-item-details-grid'>
						{this.props.primarySpecificFields}
						{this.renderGenresField(mediaItem, 'media-item-details-field media-item-details-field-span-2')}
					</div>
				))}
				{this.renderSection('collection', (
					<div className='media-item-details-grid'>
						{this.renderImportanceField(mediaItem)}
						{this.renderOwnPlatformField(mediaItem)}
						{this.renderGroupField(mediaItem)}
						{this.renderOrderInGroupField(mediaItem)}
					</div>
				))}
				{this.renderSection('progress', (
					<div className='media-item-details-grid'>
						{this.renderUserCommentField(mediaItem, 'media-item-details-field media-item-details-field-span-2')}
						{this.renderCompletionDatesField(mediaItem, 'media-item-details-field media-item-details-field-span-2')}
					</div>
				))}
			</div>
		);
	}

	/**
	 * Renders a form section card
	 * @param sectionKey section key
	 * @param children section content
	 * @returns the component
	 */
	private renderSection(sectionKey: MediaItemDetailsSectionKey, children: ReactNode): ReactNode {
		return (
			<section className='media-item-details-panel'>
				<div className='media-item-details-section-heading'>
					<h2 className='media-item-details-section-title'>{i18n.t(`mediaItem.details.sections.${sectionKey}.title`)}</h2>
				</div>
				{children}
			</section>
		);
	}

	/**
	 * Renders the catalog-aware name field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderNameField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor='media-item-name'>
					{i18n.t('mediaItem.details.placeholders.name')}
				</label>
				<div className='media-item-details-search-row'>
					<InputComponent
						id='media-item-name'
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
					<PillButtonComponent
						tone='secondary'
						className='media-item-details-search-button'
						disabled={!mediaItem.name.trim()}
						onClick={() => {
							this.submitCatalogSearch();
						}}>
						Search
					</PillButtonComponent>
				</div>
				{this.renderCatalogSearchResults()}
			</div>
		);
	}

	/**
	 * Renders the description field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderDescriptionField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor='media-item-description'>
					{i18n.t('mediaItem.details.placeholders.description')}
				</label>
				<TextareaComponent
					id='media-item-description'
					value={mediaItem.description || ''}
					onChange={(event) => {
						this.setFormField('description', event.target.value || undefined);
					}}
				/>
			</div>
		);
	}

	/**
	 * Renders the release date field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderReleaseDateField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor='media-item-release-date'>
					{i18n.t('mediaItem.details.placeholders.releaseDate')}
				</label>
				<ClearableInputComponent
					id='media-item-release-date'
					type='date'
					value={this.dateToInputValue(mediaItem.releaseDate)}
					showClearButton={Boolean(mediaItem.releaseDate)}
					onChange={(event) => {
						this.setFormField('releaseDate', this.inputValueToDate(event.target.value));
					}}
					onClear={() => {
						this.setFormField('releaseDate', undefined as TMediaItem['releaseDate']);
					}}
				/>
			</div>
		);
	}

	/**
	 * Renders the common genres field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderGenresField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return this.renderArrayTextInputField(
			'media-item-genres',
			i18n.t('mediaItem.details.placeholders.genres'),
			mediaItem.genres,
			(values) => {
				this.setFormField('genres', values);
			},
			fieldClassName
		);
	}

	/**
	 * Renders the importance field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderImportanceField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor='media-item-importance'>
					{i18n.t('mediaItem.details.prompts.importance')}
				</label>
				<SelectComponent
					id='media-item-importance'
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
				</SelectComponent>
			</div>
		);
	}

	/**
	 * Renders the own platform field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderOwnPlatformField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		const ownPlatform = mediaItem.ownPlatform;

		return (
			<div className={fieldClassName}>
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
					<span className='media-item-details-picker-action'>{i18n.t('common.buttons.select')}</span>
				</button>
			</div>
		);
	}

	/**
	 * Renders the group field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderGroupField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return (
			<div className={fieldClassName}>
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
					<span className='media-item-details-picker-action'>{i18n.t('common.buttons.select')}</span>
				</button>
			</div>
		);
	}

	/**
	 * Renders the order-in-group field only when a group is selected
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderOrderInGroupField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		if(!mediaItem.group) {
			return null;
		}

		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor='media-item-order-in-group'>
					{i18n.t('mediaItem.details.placeholders.orderInGroup')}
				</label>
				<InputComponent
					id='media-item-order-in-group'
					type='number'
					value={this.numberToInputValue(mediaItem.orderInGroup)}
					onChange={(event) => {
						this.setFormField('orderInGroup', this.inputValueToNumber(event.target.value));
					}}
				/>
			</div>
		);
	}

	/**
	 * Renders the user comment field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderUserCommentField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor='media-item-user-comment'>
					{i18n.t('mediaItem.details.placeholders.userComment')}
				</label>
				<TextareaComponent
					id='media-item-user-comment'
					value={mediaItem.userComment || ''}
					onChange={(event) => {
						this.setFormField('userComment', event.target.value || undefined);
					}}
				/>
			</div>
		);
	}

	/**
	 * Renders the completion dates field
	 * @param mediaItem current media item
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	private renderCompletionDatesField(mediaItem: TMediaItem, fieldClassName: string = 'media-item-details-field'): ReactNode {
		const completionDates = mediaItem.completedOn || [];

		return (
			<div className={fieldClassName}>
				<p className='media-item-details-label'>
					{i18n.t('mediaItem.details.placeholders.completedOn')}
				</p>
				<div className='media-item-details-completion-list'>
					{completionDates.length === 0 && (
						<p className='media-item-details-inline-hint'>{i18n.t('mediaItem.details.completion.empty')}</p>
					)}
					{completionDates.map((completedOn, index) => {
						return (
							<div className='media-item-details-completion-row' key={`completed-on-${index}`}>
								<InputComponent
									id={`media-item-completed-on-${index}`}
									type='date'
									value={this.dateToInputValue(completedOn)}
									onChange={(event) => {
										this.updateCompletionDate(index, event.target.value);
									}}
								/>
								<PillButtonComponent
									tone='secondary'
									className='media-item-details-small-button'
									onClick={() => {
										this.removeCompletionDate(index);
									}}>
									{i18n.t('common.buttons.remove')}
								</PillButtonComponent>
							</div>
						);
					})}
					<PillButtonComponent
						tone='secondary'
						className='media-item-details-inline-button'
						onClick={() => {
							this.addCompletionDate();
						}}>
						{i18n.t('mediaItem.details.buttons.addDate')}
					</PillButtonComponent>
				</div>
			</div>
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
	 * Renders a single-line text input for array values
	 * @param id field ID
	 * @param label field label
	 * @param values field values
	 * @param onChange change handler
	 * @param fieldClassName layout class name
	 * @returns the component
	 */
	protected renderArrayTextInputField(
		id: string,
		label: string,
		values: string[] | undefined,
		onChange: (newValues: string[] | undefined) => void,
		fieldClassName: string = 'media-item-details-field'
	): ReactNode {
		return (
			<div className={fieldClassName}>
				<label className='media-item-details-label' htmlFor={id}>
					{label}
				</label>
				<InlineTextInputComponent
					id={id}
					values={values}
					onChange={onChange}
				/>
			</div>
		);
	}

	/**
	 * Builds the action buttons for the sidebar shortcuts
	 * @param mediaItem current media item
	 * @returns action buttons
	 */
	private getActionButtons(mediaItem: TMediaItem): MediaItemActionButton[] {
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

		if(this.props.extraActionButtons) {
			buttons.push(...this.props.extraActionButtons);
		}

		buttons.push({
			key: 'reload-catalog',
			label: i18n.t('mediaItem.details.buttons.downloadCatalog'),
			icon: downloadIcon,
			disabled: !mediaItem.catalogId,
			onClick: () => {
				if(mediaItem.catalogId) {
					this.props.requestCatalogReload(mediaItem.catalogId);
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
		const term = this.props.values.name.trim();

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
	 * Adds a completion date entry
	 */
	private addCompletionDate(): void {
		const completionDates = this.props.values.completedOn ? [ ...this.props.values.completedOn ] : [];

		completionDates.push(new Date());
		this.setFormField('completedOn', completionDates);
	}

	/**
	 * Updates a completion date entry
	 * @param index row index
	 * @param value date input value
	 */
	private updateCompletionDate(index: number, value: string): void {
		if(value === '') {
			return;
		}

		const completionDates = this.props.values.completedOn ? [ ...this.props.values.completedOn ] : [];
		const parsedDate = this.inputValueToDate(value);

		if(!parsedDate) {
			return;
		}

		completionDates[index] = parsedDate;

		this.setFormField('completedOn', completionDates.length > 0 ? completionDates : undefined);
	}

	/**
	 * Removes a completion date entry
	 * @param index row index
	 */
	private removeCompletionDate(index: number): void {
		const completionDates = this.props.values.completedOn ? [ ...this.props.values.completedOn ] : [];

		completionDates.splice(index, 1);
		this.setFormField('completedOn', completionDates.length > 0 ? completionDates : undefined);
	}

	/**
	 * Handles a single field update
	 * @param key the field key
	 * @param value the field value
	 */
	protected setFormField<K extends keyof TMediaItem>(key: K, value: TMediaItem[K]): void {
		void this.props.setFieldValue(key as string, value);
	}

	/**
	 * Converts optional Date to input string
	 * @param currentDate the date
	 * @returns yyyy-mm-dd or empty string
	 */
	protected dateToInputValue(currentDate?: Date): string {
		return dateToInputValue(currentDate);
	}

	/**
	 * Converts an input date string to Date
	 * @param value yyyy-mm-dd input value
	 * @returns date or undefined
	 */
	protected inputValueToDate(value: string): Date | undefined {
		return inputValueToDate(value);
	}

	/**
	 * Converts an optional number to an input-safe value
	 * @param value number
	 * @returns input value
	 */
	protected numberToInputValue(value?: number): number | '' {
		return numberToInputValue(value);
	}

	/**
	 * Converts an input text value to optional number
	 * @param value input string
	 * @returns number or undefined
	 */
	protected inputValueToNumber(value: string): number | undefined {
		return inputValueToNumber(value);
	}
}

/**
 * MediaItemFormViewComponent's common input props
 */
export type MediaItemFormViewComponentCommonInput = {
	/**
	 * The current media item catalog search results
	 */
	catalogSearchResults?: SearchMediaItemCatalogResultInternal[];

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
	 * Callback to open the reload-catalog confirmation dialog
	 */
	requestCatalogReload: (catalogId: string) => void;
};

/**
 * MediaItemFormViewComponent's input props
 */
export type MediaItemFormViewComponentInput = MediaItemFormViewComponentCommonInput & {
	/**
	 * Inputs for the specific media item
	 */
	primarySpecificFields?: ReactNode[];

	/**
	 * Media-specific sidebar action buttons
	 */
	extraActionButtons?: MediaItemActionButton[];
};

/**
 * MediaItemFormViewComponent's common output props
 */
export type MediaItemFormViewComponentCommonOutput<TMediaItem extends MediaItemInternal = MediaItemInternal> = {
	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from the saved Formik initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to persist the current unsaved form draft
	 * @param mediaItem the current form values
	 */
	persistFormDraft: (mediaItem: TMediaItem) => void;
};

/**
 * MediaItemFormViewComponent's props
 */
export type MediaItemFormViewComponentProps<TMediaItem extends MediaItemInternal = MediaItemInternal> = FormikProps<TMediaItem> & MediaItemFormViewComponentInput & MediaItemFormViewComponentCommonOutput<TMediaItem>;
