import { Navigation } from 'app/components/containers/navigation/global';
import React, { Component, ReactNode } from 'react';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { i18n } from 'app/utilities/i18n';
import { HeaderBackComponent } from 'app/components/presentational/generic/header-back';

/**
 * Presentational component to display the header back button for a form, with built-in alert on click if the form is dirty.
 * Also handles "physical" back button on Android in the same way.
 */
export class HeaderFormExitBackComponent extends Component<HeaderFormExitBackComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			disabled
		} = this.props;

		return (
			<HeaderBackComponent
				onClick={this.onBackButtonPress.bind(this)}
				disabled={disabled}
			/>
		);
	}

	/**
	 * Action on back button press (both header button and "physical" button on Android)
	 */
	private onBackButtonPress(): void {

		const {
			disabled,
			dirtyForm,
			navigation
		} = this.props;

		if(disabled) {

			return;
		}

		if(dirtyForm) {

			ConfirmAlert.alert(i18n.t('common.alert.form.exit.title'), i18n.t('common.alert.form.exit.message'), () => {

				navigation.goBack();
			});
		}
		else {

			navigation.goBack();
		}
	}
}

/**
 * HeaderFormExitBackComponent's input props
 */
export type HeaderFormExitBackComponentInput = {

	/**
	 * The navigation data
	 */
	navigation: Navigation;

	/**
	 * If the form is dirty, i.e. if the confirmation alert is required
	 */
	dirtyForm: boolean;

	/**
	 * If the button is not currently clickable
	 */
	disabled?: boolean;
}
