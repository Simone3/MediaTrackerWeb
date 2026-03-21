import React, { Component, CSSProperties, ReactNode } from 'react';
import { config } from 'app/config/config';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import ownPlatformIcon from 'app/resources/images/ic_input_own_platform.png';
import { i18n } from 'app/utilities/i18n';

const OWN_PLATFORM_DETAILS_ACCENT = '#7db4ff';

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
		document.body.classList.add('app-dark-screen-active');
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
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
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
		const title = formValues.id ? formValues.name : i18n.t('ownPlatform.details.title.new');

		return (
			<section
				className='entity-details-screen own-platform-details-screen'
				style={{ '--entity-details-accent': formValues.color || OWN_PLATFORM_DETAILS_ACCENT } as CSSProperties}>
				<div className='entity-details-screen-content'>
					<header className='entity-details-hero'>
						<div className='entity-details-heading'>
							<div className='entity-details-title-row'>
								<span className='entity-details-icon-shell' aria-hidden={true}>
									<img src={ownPlatformIcon} alt='' className='entity-details-icon' />
								</span>
								<div className='entity-details-title-copy'>
									<h1 className='entity-details-title'>{title}</h1>
									<p className='entity-details-subtitle'>{i18n.t('ownPlatform.list.emptyHint')}</p>
								</div>
							</div>
						</div>
						<div className='entity-details-actions'>
							<button
								type='button'
								className='entity-details-button entity-details-button-primary'
								disabled={!isValid || isLoading}
								onClick={() => {
									this.submitForm(false);
								}}>
								Save
							</button>
						</div>
					</header>
					<form
						className='entity-details-form'
						onSubmit={(event) => {
							event.preventDefault();
							this.submitForm(false);
						}}>
						<div className='entity-details-main entity-details-main-split'>
							<div className='entity-details-stack'>
								<section className='entity-details-panel'>
									<div className='entity-details-section-heading'>
										<h2 className='entity-details-section-title'>{i18n.t('common.sections.basics')}</h2>
										<p className='entity-details-panel-copy'>{i18n.t('ownPlatform.list.emptyHint')}</p>
									</div>
									<div className='entity-details-grid'>
										<div className='entity-details-field entity-details-field-span-2'>
											<label className='entity-details-label' htmlFor='own-platform-name'>
												{i18n.t('ownPlatform.details.placeholders.name')}
											</label>
											<input
												id='own-platform-name'
												className='entity-details-input'
												type='text'
												value={formValues.name}
												placeholder={i18n.t('ownPlatform.details.placeholders.name')}
												onChange={(event) => {
													this.setFormField('name', event.target.value);
												}}
											/>
										</div>
									</div>
								</section>
								<section className='entity-details-panel'>
									<div className='entity-details-section-heading'>
										<h2 className='entity-details-section-title'>{i18n.t('common.sections.appearance')}</h2>
									</div>
									<div className='entity-details-grid'>
										<div className='entity-details-field'>
											<label className='entity-details-label' htmlFor='own-platform-icon'>
												{i18n.t('ownPlatform.details.prompts.icon')}
											</label>
											<select
												id='own-platform-icon'
												className='entity-details-select'
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
										</div>
										<div className='entity-details-field entity-details-field-span-2'>
											<label className='entity-details-label' htmlFor='own-platform-color'>
												{i18n.t('common.fields.color')}
											</label>
											<div className='entity-details-color-grid'>
												{config.ui.colors.availableOwnPlatformColors.map((color) => {
													const selected = formValues.color === color;
													const buttonClassName = selected ?
														'entity-details-color entity-details-color-selected' :
														'entity-details-color';

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
															aria-pressed={selected}
														/>
													);
												})}
											</div>
											<input
												id='own-platform-color'
												className='entity-details-color-input'
												type='color'
												value={formValues.color}
												onChange={(event) => {
													this.setFormField('color', event.target.value);
												}}
											/>
										</div>
									</div>
								</section>
							</div>
							<section className='entity-details-panel'>
								<div className='entity-details-section-heading'>
									<h2 className='entity-details-section-title'>{i18n.t('common.sections.preview')}</h2>
								</div>
								<div className='entity-details-preview'>
									<span
										className='entity-details-preview-badge-shell'
										style={{ backgroundColor: formValues.color }}
										aria-hidden={true}>
										<img src={ownPlatformIcon} alt='' className='entity-details-preview-icon' />
									</span>
									<div className='entity-details-preview-copy'>
										<h3 className='entity-details-preview-title'>{title}</h3>
										<p className='entity-details-preview-description'>{i18n.t(`ownPlatform.icons.${formValues.icon}`)}</p>
									</div>
									<div className='entity-details-chip-row'>
										<span className='entity-details-chip'>{i18n.t(`ownPlatform.icons.${formValues.icon}`)}</span>
										<span className='entity-details-chip'>{formValues.color}</span>
									</div>
								</div>
							</section>
						</div>
					</form>
				</div>
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
