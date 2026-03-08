import React, { Component, ReactNode } from 'react';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "group details" screen, that works as the "add new group", "update group" and
 * "view group data" sections
 */
export class GroupDetailsScreenComponent extends Component<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput, GroupDetailsScreenComponentState> {
	public state: GroupDetailsScreenComponentState = {
		formValues: {
			id: '',
			name: ''
		}
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
	public componentDidUpdate(prevProps: Readonly<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput>, prevState: Readonly<GroupDetailsScreenComponentState>): void {
		if(this.areGroupsDifferent(prevProps.group, this.props.group)) {
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

		return (
			<section className='group-details-screen'>
				<div className='group-details-header'>
					<h1 className='group-details-title'>{formValues.id ? formValues.name : i18n.t('group.details.title.new')}</h1>
					<div className='group-details-actions'>
						<button type='button' className='group-details-button group-details-button-secondary' onClick={this.props.goBack}>
							Back
						</button>
						<button
							type='button'
							className='group-details-button group-details-button-primary'
							disabled={!isValid || isLoading}
							onClick={() => {
								this.submitForm(false);
							}}>
							Save
						</button>
					</div>
				</div>
				<form
					className='group-details-form'
					onSubmit={(event) => {
						event.preventDefault();
						this.submitForm(false);
					}}>
					<label className='group-details-label' htmlFor='group-name'>
						{i18n.t('group.details.placeholders.name')}
					</label>
					<input
						id='group-name'
						className='group-details-input'
						type='text'
						value={formValues.name}
						onChange={(event) => {
							this.setFormField('name', event.target.value);
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
	 * Handles same-name confirmation flow
	 */
	private handleSameNameConfirmation(): void {
		const title = i18n.t('group.common.alert.addSameName.title');
		const message = i18n.t('group.common.alert.addSameName.message');

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
}
