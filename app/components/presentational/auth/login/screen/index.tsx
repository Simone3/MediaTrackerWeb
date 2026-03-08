import React, { Component, ReactNode } from 'react';
import { AuthTextInputComponent } from 'app/components/presentational/auth/common/auth-input';
import { UserSecretInternal } from 'app/data/models/internal/user';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { navigationService } from 'app/utilities/navigation-service';
import { i18n } from 'app/utilities/i18n';
import { AppScreens } from 'app/utilities/screens';
import { AppTitleComponent } from 'app/components/presentational/auth/common/app-title';
import { AuthSubmitComponent } from 'app/components/presentational/auth/common/auth-submit';
import { AuthLinkComponent } from 'app/components/presentational/auth/common/auth-link';

/**
 * Presentational component that contains the add new user form
 */
export class UserLoginScreenComponent extends Component<UserLoginScreenComponentProps, UserSecretInternal> {
	public state: UserSecretInternal = {
		email: '',
		password: ''
	};

	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<section className='auth-screen'>
				{this.renderForm()}
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
					fullScreen={true}
				/>
			</section>
		);
	}

	/**
	 * Helper to render the simple login form
	 * @returns the component
	 */
	private renderForm(): ReactNode {
		return (
			<div className='auth-form'>
				<AppTitleComponent className='auth-form-title' />
				<div className='auth-form-inputs'>
					<AuthTextInputComponent
						onChangeText={(value) => {
							this.setState({
								email: value
							});
						}}
						value={this.state.email}
						placeholder={i18n.t('auth.login.placeholders.email')}
						autoComplete='email'
						inputMode='email'
					/>
					<AuthTextInputComponent
						onChangeText={(value) => {
							this.setState({
								password: value
							});
						}}
						value={this.state.password}
						placeholder={i18n.t('auth.login.placeholders.password')}
						secureTextEntry={true}
						autoComplete='current-password'
					/>
				</div>
				<div className='auth-form-submit'>
					<AuthSubmitComponent
						text={i18n.t('auth.login.buttons.submit')}
						disabled={!this.state.email || !this.state.password}
						onPress={() => {
							this.props.login(this.state);
						}}
					/>
					<AuthLinkComponent
						text={i18n.t('auth.login.buttons.notUser')}
						onPress={() => {
							navigationService.navigate(AppScreens.UserSignup);
						}}
					/>
				</div>
			</div>
		);
	}
}

/**
 * UserLoginScreenComponent's input props
 */
export type UserLoginScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;
}

/**
 * UserLoginScreenComponent's output props
 */
export type UserLoginScreenComponentOutput = {
	/**
	 * Callback for the login attempt
	 */
	login: (user: UserSecretInternal) => void;
}

/**
 * UserLoginScreenComponent's props
 */
export type UserLoginScreenComponentProps = UserLoginScreenComponentInput & UserLoginScreenComponentOutput;
