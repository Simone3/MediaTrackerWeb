import React, { Component, CSSProperties, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { GroupInternal } from 'app/data/models/internal/group';
import groupIcon from 'app/resources/images/ic_input_group.png';
import { i18n } from 'app/utilities/i18n';

const GROUP_DETAILS_ACCENT = '#7db4ff';

/**
 * Presentational component that contains the whole "group details" screen, that works as the "add new group", "update group" and
 * "view group data" sections
 */
export class GroupDetailsScreenComponent extends Component<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput, GroupDetailsScreenComponentState> {
	public state: GroupDetailsScreenComponentState = {
		formValues: {
			id: '',
			name: ''
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
	public componentDidUpdate(prevProps: Readonly<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput>, prevState: Readonly<GroupDetailsScreenComponentState>): void {
		if(this.areGroupsDifferent(prevProps.group, this.props.group)) {
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
		const title = formValues.id ? formValues.name : i18n.t('group.details.title.new');

		return (
			<section
				className='entity-details-screen group-details-screen'
				style={{ '--entity-details-accent': GROUP_DETAILS_ACCENT } as CSSProperties}>
				<div className='entity-details-screen-content'>
					<header className='entity-details-hero'>
						<div className='entity-details-heading'>
							<div className='entity-details-title-row'>
								<span className='entity-details-icon-shell' aria-hidden={true}>
									<img src={groupIcon} alt='' className='entity-details-icon' />
								</span>
								<div className='entity-details-title-copy'>
									<h1 className='entity-details-title'>{title}</h1>
									<p className='entity-details-subtitle'>{i18n.t('group.list.emptyHint')}</p>
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
							<section className='entity-details-panel'>
								<div className='entity-details-section-heading'>
									<h2 className='entity-details-section-title'>{i18n.t('common.sections.basics')}</h2>
									<p className='entity-details-panel-copy'>{i18n.t('group.list.emptyHint')}</p>
								</div>
								<div className='entity-details-grid'>
									<div className='entity-details-field entity-details-field-span-2'>
										<label className='entity-details-label' htmlFor='group-name'>
											{i18n.t('group.details.placeholders.name')}
										</label>
										<input
											id='group-name'
											className='entity-details-input'
											type='text'
											value={formValues.name}
											placeholder={i18n.t('group.details.placeholders.name')}
											onChange={(event) => {
												this.setFormField('name', event.target.value);
											}}
										/>
									</div>
								</div>
							</section>
							<section className='entity-details-panel'>
								<div className='entity-details-section-heading'>
									<h2 className='entity-details-section-title'>{i18n.t('common.sections.preview')}</h2>
								</div>
								<div className='entity-details-preview'>
									<span className='entity-details-preview-badge-shell' aria-hidden={true}>
										<span className='entity-details-preview-badge'>{this.getBadgeLabel(formValues.name, '#')}</span>
									</span>
									<div className='entity-details-preview-copy'>
										<h3 className='entity-details-preview-title'>{title}</h3>
										<p className='entity-details-preview-description'>{i18n.t('group.list.emptyHint')}</p>
									</div>
								</div>
							</section>
						</div>
					</form>
				</div>
				<ConfirmDialogComponent
					visible={confirmSameNameVisible}
					title={i18n.t('group.common.alert.addSameName.title')}
					message={i18n.t('group.common.alert.addSameName.message')}
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
	 * Syncs local form values from Redux source group
	 */
	private syncFormValuesWithProps(): void {
		this.setState({
			formValues: {
				...this.props.group
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
	private setFormField<K extends keyof GroupInternal>(key: K, value: GroupInternal[K]): void {
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

		this.props.saveGroup(formValues, confirmSameName);
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
	 * @param group group values
	 * @returns true if valid
	 */
	private isFormValid(group: GroupInternal): boolean {
		return Boolean(group.name && group.name.trim());
	}

	/**
	 * Checks if current form differs from Redux group
	 * @param group group values
	 * @returns true if dirty
	 */
	private isFormDirty(group: GroupInternal): boolean {
		return this.areGroupsDifferent(group, this.props.group);
	}

	/**
	 * Checks if two groups are different
	 * @param left first group
	 * @param right second group
	 * @returns true if different
	 */
	private areGroupsDifferent(left: GroupInternal, right: GroupInternal): boolean {
		return left.id !== right.id || left.name !== right.name;
	}

	/**
	 * Extracts a small badge label from the provided text
	 * @param text the source text
	 * @param fallback the fallback label
	 * @returns the display label
	 */
	private getBadgeLabel(text: string, fallback: string): string {
		const compactLabel = text
			.trim()
			.split(/\s+/u)
			.filter(Boolean)
			.slice(0, 2)
			.map((chunk) => {
				return chunk[0];
			})
			.join('')
			.toUpperCase();

		return compactLabel || fallback;
	}
}

/**
 * GroupDetailsScreenComponent's input props
 */
export type GroupDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Group loaded from Redux state
	 */
	group: GroupInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;
}

/**
 * GroupDetailsScreenComponent's output props
 */
export type GroupDetailsScreenComponentOutput = {
	/**
	 * Callback to save group
	 */
	saveGroup: (group: GroupInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to navigate back
	 */
	goBack: () => void;
}

type GroupDetailsScreenComponentState = {
	formValues: GroupInternal;
	confirmSameNameVisible: boolean;
}
