import { Component, FormEvent, ReactNode } from 'react';
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
	public componentDidMount(): void {
		document.body.classList.add('app-dark-screen-active');
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
			<div className='auth-shell'>
				<div className='auth-screen-glow auth-screen-glow-primary' />
				<div className='auth-screen-glow auth-screen-glow-secondary' />
				<div className='auth-showcase'>
					<AppTitleComponent className='auth-showcase-title' />
					<div className='auth-showcase-copy'>
						<p className='auth-showcase-description'>{i18n.t('auth.common.tagline')}</p>
						<div className='auth-showcase-highlights'>
							<span className='auth-showcase-highlight'>{i18n.t('category.mediaTypes.BOOK')}</span>
							<span className='auth-showcase-highlight'>{i18n.t('category.mediaTypes.MOVIE')}</span>
							<span className='auth-showcase-highlight'>{i18n.t('category.mediaTypes.TV_SHOW')}</span>
							<span className='auth-showcase-highlight'>{i18n.t('category.mediaTypes.VIDEOGAME')}</span>
						</div>
					</div>
				</div>
				<div className='auth-panel'>
					<div className='auth-panel-header'>
						<span className='auth-panel-eyebrow'>{i18n.t('auth.login.eyebrow')}</span>
						<h2 className='auth-panel-title'>{i18n.t('auth.login.buttons.submit')}</h2>
						<p className='auth-panel-copy'>{i18n.t('auth.login.description')}</p>
					</div>
					<form
						className='auth-form'
						onSubmit={(event: FormEvent<HTMLFormElement>) => {
							event.preventDefault();
							this.submit();
						}}>
						<div className='auth-form-inputs'>
							<label className='auth-field'>
								<span className='auth-field-label'>{i18n.t('auth.login.placeholders.email')}</span>
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
									disabled={this.props.isLoading}
								/>
							</label>
							<label className='auth-field'>
								<span className='auth-field-label'>{i18n.t('auth.login.placeholders.password')}</span>
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
									disabled={this.props.isLoading}
								/>
							</label>
						</div>
						<div className='auth-form-submit'>
							<AuthSubmitComponent
								text={i18n.t('auth.login.buttons.submit')}
								type='submit'
								disabled={this.props.isLoading || !this.state.email || !this.state.password}
							/>
							<AuthLinkComponent
								text={i18n.t('auth.login.buttons.notUser')}
								disabled={this.props.isLoading}
								onPress={() => {
									navigationService.navigate(AppScreens.UserSignup);
								}}
							/>
						</div>
					</form>
				</div>
			</div>
		);
	}

	/**
	 * Submits the login request when the form is valid
	 */
	private submit(): void {
		if(!this.state.email || !this.state.password || this.props.isLoading) {
			return;
		}
		this.props.login(this.state);
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
