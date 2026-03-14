import React, { Component, ReactNode } from 'react';
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
		confirmSameNameVisible: false,
		confirmExitVisible: false
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
	public render(): ReactNode {
		const {
			isLoading
		} = this.props;

		const {
			formValues,
			confirmSameNameVisible,
			confirmExitVisible
		} = this.state;

		const isValid = this.isFormValid(formValues);

		return (
			<section className='category-details-screen'>
				<div className='category-details-header'>
					<h1 className='category-details-title'>{formValues.id ? formValues.name : i18n.t('category.details.title.new')}</h1>
					<div className='category-details-actions'>
						<button type='button' className='category-details-button category-details-button-secondary' onClick={() => {
							this.requestGoBack();
						}}>
							Back
						</button>
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
				<form
					className='category-details-form'
					onSubmit={(event) => {
						event.preventDefault();
						this.submitForm(false);
					}}>
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

					<label className='category-details-label' htmlFor='category-media-type'>
						{i18n.t('category.details.prompts.mediaType')}
					</label>
					<select
						id='category-media-type'
						className='category-details-select'
						value={formValues.mediaType}
						disabled={Boolean(formValues.id)}
						onChange={(event) => {
							this.setFormField('mediaType', event.target.value as CategoryInternal['mediaType']);
						}}>
						{MEDIA_TYPES_INTERNAL.map((mediaType) => {
							return (
								<option key={mediaType} value={mediaType}>
									{i18n.t(`category.mediaTypes.${mediaType}`)}
								</option>
							);
						})}
					</select>

					<label className='category-details-label' htmlFor='category-color'>
						Color
					</label>
					<div className='category-details-colors'>
						{config.ui.colors.availableCategoryColors.map((color) => {
							const selected = formValues.color === color;
							const buttonClassName = selected ? 'category-details-color category-details-color-selected' : 'category-details-color';

							return (
								<button
									key={color}
									type='button'
									className={buttonClassName}
									style={{ backgroundColor: color }}
									onClick={() => {
										this.setFormField('color', color);
									}}
									aria-label={`Select color ${color}`}>
								</button>
							);
						})}
					</div>
					<input
						id='category-color'
						className='category-details-color-input'
						type='color'
						value={formValues.color}
						onChange={(event) => {
							this.setFormField('color', event.target.value);
						}}
					/>
				</form>
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
				<ConfirmDialogComponent
					visible={confirmExitVisible}
					title={i18n.t('common.alert.form.exit.title')}
					message={i18n.t('common.alert.form.exit.message')}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						this.setState({
							confirmExitVisible: false
						}, () => {
							this.props.goBack();
						});
					}}
					onCancel={() => {
						this.setState({
							confirmExitVisible: false
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
	 * Navigates back immediately if the form is pristine, otherwise asks confirmation first
	 */
	private requestGoBack(): void {
		if(this.isFormDirty(this.state.formValues)) {
			this.setState({
				confirmExitVisible: true
			});
			return;
		}

		this.props.goBack();
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

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type CategoryDetailsScreenComponentState = {
	formValues: CategoryInternal;
	confirmSameNameVisible: boolean;
	confirmExitVisible: boolean;
}
