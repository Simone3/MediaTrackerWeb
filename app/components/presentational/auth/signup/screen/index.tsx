import { Component, ReactNode } from 'react';
import { AuthCredentialsScreenComponent } from 'app/components/presentational/auth/common/credentials-screen';
import { UserSecretInternal } from 'app/data/models/internal/user';
import { navigationService } from 'app/utilities/navigation-service';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the add new user form
 */
export class UserSignupScreenComponent extends Component<UserSignupScreenComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<AuthCredentialsScreenComponent
				eyebrow={i18n.t('auth.signup.eyebrow')}
				title={i18n.t('auth.signup.buttons.submit')}
				description={i18n.t('auth.signup.description')}
				emailLabel={i18n.t('auth.signup.placeholders.email')}
				emailPlaceholder={i18n.t('auth.signup.placeholders.email')}
				passwordLabel={i18n.t('auth.signup.placeholders.password')}
				passwordPlaceholder={i18n.t('auth.signup.placeholders.password')}
				passwordAutoComplete='new-password'
				submitLabel={i18n.t('auth.signup.buttons.submit')}
				alternateLabel={i18n.t('auth.signup.buttons.alreadyUser')}
				isLoading={this.props.isLoading}
				onSubmit={this.props.signup}
				onAlternateAction={() => {
					navigationService.back();
				}}
			/>
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
