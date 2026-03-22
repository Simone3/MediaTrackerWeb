import { Component, FormEvent, ReactNode } from 'react';
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
	 * Helper to render the simple signup form
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
						<span className='auth-panel-eyebrow'>{i18n.t('auth.signup.eyebrow')}</span>
						<h2 className='auth-panel-title'>{i18n.t('auth.signup.buttons.submit')}</h2>
						<p className='auth-panel-copy'>{i18n.t('auth.signup.description')}</p>
					</div>
					<form
						className='auth-form'
						onSubmit={(event: FormEvent<HTMLFormElement>) => {
							event.preventDefault();
							this.submit();
						}}>
						<div className='auth-form-inputs'>
							<label className='auth-field'>
								<span className='auth-field-label'>{i18n.t('auth.signup.placeholders.email')}</span>
								<AuthTextInputComponent
									onChangeText={(value) => {
										this.setState({
											email: value
										});
									}}
									value={this.state.email}
									placeholder={i18n.t('auth.signup.placeholders.email')}
									autoComplete='email'
									inputMode='email'
									disabled={this.props.isLoading}
								/>
							</label>
							<label className='auth-field'>
								<span className='auth-field-label'>{i18n.t('auth.signup.placeholders.password')}</span>
								<AuthTextInputComponent
									onChangeText={(value) => {
										this.setState({
											password: value
										});
									}}
									value={this.state.password}
									placeholder={i18n.t('auth.signup.placeholders.password')}
									secureTextEntry={true}
									autoComplete='new-password'
									disabled={this.props.isLoading}
								/>
							</label>
						</div>
						<div className='auth-form-submit'>
							<AuthSubmitComponent
								text={i18n.t('auth.signup.buttons.submit')}
								type='submit'
								disabled={this.props.isLoading || !this.state.email || !this.state.password}
							/>
							<AuthLinkComponent
								text={i18n.t('auth.signup.buttons.alreadyUser')}
								disabled={this.props.isLoading}
								onPress={() => {
									navigationService.back();
								}}
							/>
						</div>
					</form>
				</div>
			</div>
		);
	}

	/**
	 * Submits the signup request when the form is valid
	 */
	private submit(): void {
		if(!this.state.email || !this.state.password || this.props.isLoading) {
			return;
		}
		this.props.signup(this.state);
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
