import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from 'app/components/presentational/auth/signup/screen/styles';
import { AuthTextInputComponent } from 'app/components/presentational/auth/common/auth-input';
import { UserSecretInternal } from 'app/data/models/internal/user';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { navigationService } from 'app/utilities/navigation-service';
import { i18n } from 'app/utilities/i18n';
import { AppTitleComponent } from 'app/components/presentational/auth/common/app-title';
import { AuthSubmitComponent } from 'app/components/presentational/auth/common/auth-submit';
import { AuthLinkComponent } from 'app/components/presentational/auth/common/auth-link';

/**
 * Presentational component that contains the add new user form
 */
export class UserSignupScreenComponent extends Component<UserSignupScreenComponentProps, UserSecretInternal> {

	public state: UserSecretInternal = {
		email: '',
		password: ''
	};

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<View style={styles.container}>
				{this.renderForm()}
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
					fullScreen={true}
				/>
			</View>
		);
	}

	/**
	 * Helper to render the simple signup form
	 * @returns the component
	 */
	private renderForm(): ReactNode {

		return (
			<View style={styles.formContainer}>
				<AppTitleComponent style={styles.titleSectionContainer} />
				<View style={styles.inputsContainer}>
					<AuthTextInputComponent
						onChangeText={(value) => {
							this.setState({
								email: value
							});
						}}
						value={this.state.email}
						placeholder={i18n.t('auth.signup.placeholders.email')}
						textContentType='username'
						autoComplete='email'
						keyboardType='email-address'
					/>
					<AuthTextInputComponent
						onChangeText={(value) => {
							this.setState({
								password: value
							});
						}}
						value={this.state.password}
						placeholder={i18n.t('auth.signup.placeholders.password')}
						secureTextEntry={true}
						textContentType='password'
						autoComplete='password'
					/>
				</View>
				<View style={styles.submitContainer}>
					<AuthSubmitComponent
						text={i18n.t('auth.signup.buttons.submit')}
						disabled={!this.state.email || !this.state.password}
						onPress={() => {
							this.props.signup(this.state);
						}}
					/>
					<AuthLinkComponent
						text={i18n.t('auth.signup.buttons.alreadyUser')}
						onPress={() => {
							navigationService.back();
						}}
					/>
				</View>
			</View>
		);
	}
}

/**
 * UserSignupScreenComponent's input props
 */
export type UserSignupScreenComponentInput = {

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;
}

/**
 * UserSignupScreenComponent's output props
 */
export type UserSignupScreenComponentOutput = {

	/**
	 * Callback for the signup attempt
	 */
	signup: (user: UserSecretInternal) => void;
}

/**
 * UserSignupScreenComponent's props
 */
export type UserSignupScreenComponentProps = UserSignupScreenComponentInput & UserSignupScreenComponentOutput;
