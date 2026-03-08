import React, { Component, ReactNode } from 'react';
import { config } from 'app/config/config';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "own platform details" screen, that works as the "add new own platform", "update own platform" and
 * "view own platform data" sections
 */
export class OwnPlatformDetailsScreenComponent extends Component<OwnPlatformDetailsScreenComponentInput & OwnPlatformDetailsScreenComponentOutput, OwnPlatformDetailsScreenComponentState> {
	public state: OwnPlatformDetailsScreenComponentState = {
		formValues: {
			id: '',
			name: '',
			color: config.ui.colors.availableOwnPlatformColors[0],
			icon: 'default'
		},
		confirmSameNameVisible: false
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
	public componentDidUpdate(prevProps: Readonly<OwnPlatformDetailsScreenComponentInput & OwnPlatformDetailsScreenComponentOutput>, prevState: Readonly<OwnPlatformDetailsScreenComponentState>): void {
		if(this.areOwnPlatformsDifferent(prevProps.ownPlatform, this.props.ownPlatform)) {
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
			confirmSameNameVisible
		} = this.state;
		const isValid = this.isFormValid(formValues);

		return (
			<section className='own-platform-details-screen'>
				<div className='own-platform-details-header'>
					<h1 className='own-platform-details-title'>{formValues.id ? formValues.name : i18n.t('ownPlatform.details.title.new')}</h1>
					<div className='own-platform-details-actions'>
						<button type='button' className='own-platform-details-button own-platform-details-button-secondary' onClick={this.props.goBack}>
							Back
						</button>
						<button
							type='button'
							className='own-platform-details-button own-platform-details-button-primary'
							disabled={!isValid || isLoading}
							onClick={() => {
								this.submitForm(false);
							}}>
							Save
						</button>
					</div>
				</div>
				<form
					className='own-platform-details-form'
					onSubmit={(event) => {
						event.preventDefault();
						this.submitForm(false);
					}}>
					<label className='own-platform-details-label' htmlFor='own-platform-name'>
						{i18n.t('ownPlatform.details.placeholders.name')}
					</label>
					<input
						id='own-platform-name'
						className='own-platform-details-input'
						type='text'
						value={formValues.name}
						onChange={(event) => {
							this.setFormField('name', event.target.value);
						}}
					/>

					<label className='own-platform-details-label' htmlFor='own-platform-icon'>
						{i18n.t('ownPlatform.details.prompts.icon')}
					</label>
					<select
						id='own-platform-icon'
						className='own-platform-details-select'
						value={formValues.icon}
						onChange={(event) => {
							this.setFormField('icon', event.target.value as OwnPlatformInternal['icon']);
						}}>
						{OWN_PLATFORM_ICON_INTERNAL_VALUES.map((icon) => {
							return (
								<option key={icon} value={icon}>
									{i18n.t(`ownPlatform.icons.${icon}`)}
								</option>
							);
						})}
					</select>

					<label className='own-platform-details-label' htmlFor='own-platform-color'>
						Color
					</label>
					<div className='own-platform-details-colors'>
						{config.ui.colors.availableOwnPlatformColors.map((color) => {
							const selected = formValues.color === color;
							const buttonClassName = selected ? 'own-platform-details-color own-platform-details-color-selected' : 'own-platform-details-color';
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
						id='own-platform-color'
						className='own-platform-details-color-input'
						type='color'
						value={formValues.color}
						onChange={(event) => {
							this.setFormField('color', event.target.value);
						}}
					/>
				</form>
				<ConfirmDialogComponent
					visible={confirmSameNameVisible}
					title={i18n.t('ownPlatform.common.alert.addSameName.title')}
					message={i18n.t('ownPlatform.common.alert.addSameName.message')}
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
	 * Syncs local form values from Redux source own platform
	 */
	private syncFormValuesWithProps(): void {
		this.setState({
			formValues: {
				...this.props.ownPlatform
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
	private setFormField<K extends keyof OwnPlatformInternal>(key: K, value: OwnPlatformInternal[K]): void {
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

		this.props.saveOwnPlatform(formValues, confirmSameName);
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
	 * Validates current form values
	 * @param ownPlatform own platform values
	 * @returns true if valid
	 */
	private isFormValid(ownPlatform: OwnPlatformInternal): boolean {
		return Boolean(ownPlatform.name && ownPlatform.name.trim()) && Boolean(ownPlatform.color) && Boolean(ownPlatform.icon);
	}

	/**
	 * Checks if current form differs from Redux own platform
	 * @param ownPlatform own platform values
	 * @returns true if dirty
	 */
	private isFormDirty(ownPlatform: OwnPlatformInternal): boolean {
		return this.areOwnPlatformsDifferent(ownPlatform, this.props.ownPlatform);
	}

	/**
	 * Checks if two own platforms are different
	 * @param left first own platform
	 * @param right second own platform
	 * @returns true if different
	 */
	private areOwnPlatformsDifferent(left: OwnPlatformInternal, right: OwnPlatformInternal): boolean {
		return left.id !== right.id || left.name !== right.name || left.color !== right.color || left.icon !== right.icon;
	}
}

/**
 * OwnPlatformDetailsScreenComponent's input props
 */
export type OwnPlatformDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Own platform loaded from Redux state
	 */
	ownPlatform: OwnPlatformInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * OwnPlatformDetailsScreenComponent's output props
 */
export type OwnPlatformDetailsScreenComponentOutput = {
	/**
	 * Callback to save own platform
	 */
	saveOwnPlatform: (ownPlatform: OwnPlatformInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type OwnPlatformDetailsScreenComponentState = {
	formValues: OwnPlatformInternal;
	confirmSameNameVisible: boolean;
}
