import { Component, ReactNode } from 'react';
import { AuthCredentialsScreenComponent } from 'app/components/presentational/auth/common/credentials-screen';
import { UserSecretInternal } from 'app/data/models/internal/user';
import { navigationService } from 'app/utilities/navigation-service';
import { i18n } from 'app/utilities/i18n';
import { AppScreens } from 'app/utilities/screens';

/**
 * Presentational component that contains the add new user form
 */
export class UserLoginScreenComponent extends Component<UserLoginScreenComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<AuthCredentialsScreenComponent
				eyebrow={i18n.t('auth.login.eyebrow')}
				title={i18n.t('auth.login.buttons.submit')}
				description={i18n.t('auth.login.description')}
				emailLabel={i18n.t('auth.login.placeholders.email')}
				emailPlaceholder={i18n.t('auth.login.placeholders.email')}
				passwordLabel={i18n.t('auth.login.placeholders.password')}
				passwordPlaceholder={i18n.t('auth.login.placeholders.password')}
				passwordAutoComplete='current-password'
				submitLabel={i18n.t('auth.login.buttons.submit')}
				alternateLabel={i18n.t('auth.login.buttons.notUser')}
				isLoading={this.props.isLoading}
				onSubmit={this.props.login}
				onAlternateAction={() => {
					navigationService.navigate(AppScreens.UserSignup);
				}}
			/>
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
