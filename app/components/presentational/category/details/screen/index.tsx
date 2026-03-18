import React, { Component, ReactNode } from 'react';
import { MediaIconComponent } from 'app/components/presentational/category/common/media-icon';
import { CategoryInternal, DEFAULT_CATEGORY, MEDIA_TYPES_INTERNAL } from 'app/data/models/internal/category';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { config } from 'app/config/config';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "categories details" screen, that works as the "add new category", "update category" and
 * "view category data" sections
 */
export class CategoryDetailsScreenComponent extends Component<CategoryDetailsScreenComponentInput & CategoryDetailsScreenComponentOutput, CategoryDetailsScreenComponentState> {
	public state: CategoryDetailsScreenComponentState = {
		formValues: DEFAULT_CATEGORY,
		confirmSameNameVisible: false
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		document.body.classList.add('categories-screen-active');
		this.syncFormValuesWithProps();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CategoryDetailsScreenComponentInput & CategoryDetailsScreenComponentOutput>, prevState: Readonly<CategoryDetailsScreenComponentState>): void {
		if(this.areCategoriesDifferent(prevProps.category, this.props.category)) {
			this.syncFormValuesWithProps();
			return;
		}

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
	public componentWillUnmount(): void {
		document.body.classList.remove('categories-screen-active');
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
		const mediaTypeLabel = i18n.t(`category.mediaTypes.${formValues.mediaType}`);
		const detailsTitle = formValues.id ? formValues.name : i18n.t('category.details.title.new');

		return (
			<section className='category-details-screen'>
				<div className='category-details-shell'>
					<div className='category-details-header'>
						<div className='category-details-heading'>
							<h1 className='category-details-title'>{detailsTitle}</h1>
							<p className='category-details-subtitle'>{mediaTypeLabel}</p>
						</div>
						<div className='category-details-actions'>
							<button
								type='button'
								className='category-details-button category-details-button-primary'
								disabled={!isValid || isLoading}
								onClick={() => {
									this.submitForm(false);
								}}>
								Save
							</button>
						</div>
					</div>
					<div className='category-details-layout'>
						<aside className='category-details-preview'>
							<div
								className='category-details-preview-card'
								style={{ '--category-color': formValues.color } as React.CSSProperties}>
								<span className='category-details-preview-accent' aria-hidden={true} />
								<div className='category-details-preview-icon-shell' aria-hidden={true}>
									<MediaIconComponent mediaType={formValues.mediaType} className='category-details-preview-icon' />
								</div>
								<div className='category-details-preview-copy'>
									<p className='category-details-preview-media'>{mediaTypeLabel}</p>
									<h2 className='category-details-preview-name'>{formValues.name.trim() || i18n.t('category.details.title.new')}</h2>
								</div>
							</div>
						</aside>
						<form
							id='category-details-form'
							className='category-details-form'
							onSubmit={(event) => {
								event.preventDefault();
								this.submitForm(false);
							}}>
							<div className='category-details-section'>
								<label className='category-details-label' htmlFor='category-name'>
									{i18n.t('category.details.placeholders.name')}
								</label>
								<input
									id='category-name'
									className='category-details-input'
									type='text'
									value={formValues.name}
									onChange={(event) => {
										this.setFormField('name', event.target.value);
									}}
								/>
							</div>
							<fieldset className='category-details-section category-details-section-choices'>
								<legend className='category-details-label'>{i18n.t('category.details.prompts.mediaType')}</legend>
								<div className='category-details-media-grid'>
									{MEDIA_TYPES_INTERNAL.map((mediaType) => {
										const selected = formValues.mediaType === mediaType;
										const disabled = Boolean(formValues.id);
										const buttonClassName = selected ?
											'category-details-media-option category-details-media-option-selected' :
											'category-details-media-option';
										const optionLabel = i18n.t(`category.mediaTypes.${mediaType}`);

										return (
											<button
												key={mediaType}
												type='button'
												className={buttonClassName}
												disabled={disabled}
												aria-pressed={selected}
												onClick={() => {
													this.setFormField('mediaType', mediaType);
												}}>
												<span className='category-details-media-option-icon-shell' aria-hidden={true}>
													<MediaIconComponent mediaType={mediaType} className='category-details-media-option-icon' />
												</span>
												<span className='category-details-media-option-label'>{optionLabel}</span>
											</button>
										);
									})}
								</div>
							</fieldset>
							<fieldset className='category-details-section category-details-section-choices'>
								<legend className='category-details-label'>Color</legend>
								<div className='category-details-colors'>
									{config.ui.colors.availableCategoryColors.map((color) => {
										const selected = formValues.color === color;
										const buttonClassName = selected ?
											'category-details-color category-details-color-selected' :
											'category-details-color';

										return (
											<button
												key={color}
												type='button'
												className={buttonClassName}
												style={{ backgroundColor: color }}
												onClick={() => {
													this.setFormField('color', color);
												}}
												aria-label={`Select color ${color}`}
												aria-pressed={selected}>
												{selected && <span className='category-details-color-check' aria-hidden={true}>+</span>}
											</button>
										);
									})}
								</div>
							</fieldset>
						</form>
					</div>
				</div>
				<ConfirmDialogComponent
					visible={confirmSameNameVisible}
					title={i18n.t('category.common.alert.addSameName.title')}
					message={i18n.t('category.common.alert.addSameName.message')}
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
				<LoadingIndicatorComponent visible={isLoading} fullScreen={false} />
			</section>
		);
	}

	/**
	 * Syncs local form values from the Redux source category
	 */
	private syncFormValuesWithProps(): void {
		this.setState({
			formValues: {
				...this.props.category
			}
		}, () => {
			this.notifyFormStatus();
		});
	}

	/**
	 * Handles a single field update
	 * @param key the field key
	 * @param value the field value
	 */
	private setFormField<K extends keyof CategoryInternal>(key: K, value: CategoryInternal[K]): void {
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

		this.props.saveCategory(formValues, confirmSameName);
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
	 * @param category the category values
	 * @returns true if valid
	 */
	private isFormValid(category: CategoryInternal): boolean {
		return Boolean(category.name && category.name.trim()) && Boolean(category.mediaType) && Boolean(category.color);
	}

	/**
	 * Checks if local form differs from initial Redux category
	 * @param category the current category values
	 * @returns true if dirty
	 */
	private isFormDirty(category: CategoryInternal): boolean {
		return this.areCategoriesDifferent(category, this.props.category);
	}

	/**
	 * Checks if two categories differ on fields relevant to this form
	 * @param left first category
	 * @param right second category
	 * @returns true if different
	 */
	private areCategoriesDifferent(left: CategoryInternal, right: CategoryInternal): boolean {
		return left.id !== right.id || left.name !== right.name || left.mediaType !== right.mediaType || left.color !== right.color;
	}
}

/**
 * CategoryDetailsScreenComponent's input props
 */
export type CategoryDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Category loaded from Redux state
	 */
	category: CategoryInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * CategoryDetailsScreenComponent's output props
 */
export type CategoryDetailsScreenComponentOutput = {
	/**
	 * Callback to save category
	 */
	saveCategory: (category: CategoryInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

type CategoryDetailsScreenComponentState = {
	formValues: CategoryInternal;
	confirmSameNameVisible: boolean;
}
