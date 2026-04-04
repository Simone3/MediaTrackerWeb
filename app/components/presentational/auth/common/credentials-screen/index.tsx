import { ReactElement, useState } from 'react';
import { AppTitleComponent } from 'app/components/presentational/auth/common/app-title';
import { AuthLinkComponent } from 'app/components/presentational/auth/common/auth-link';
import { AuthSubmitComponent } from 'app/components/presentational/auth/common/auth-submit';
import { InputComponent } from 'app/components/presentational/generic/input';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { UserSecretInternal } from 'app/data/models/internal/user';
import { i18n } from 'app/utilities/i18n';

const submitCredentials = (credentials: UserSecretInternal, props: AuthCredentialsScreenComponentProps): void => {
	if (!credentials.email || !credentials.password || props.isLoading) {
		return;
	}

	props.onSubmit(credentials);
};

/**
 * Shared credential screen used by both login and signup.
 * @param props the input props
 * @returns the component
 */
export const AuthCredentialsScreenComponent = (props: AuthCredentialsScreenComponentProps): ReactElement => {
	const [ credentials, setCredentials ] = useState<UserSecretInternal>({
		email: '',
		password: ''
	});

	return (
		<section className='auth-screen'>
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
						<span className='auth-panel-eyebrow'>{props.eyebrow}</span>
						<h2 className='auth-panel-title'>{props.title}</h2>
						<p className='auth-panel-copy'>{props.description}</p>
					</div>
					<form
						className='auth-form'
						onSubmit={(event) => {
							event.preventDefault();
							submitCredentials(credentials, props);
						}}>
						<div className='auth-form-inputs'>
							<label className='auth-field'>
								<span className='auth-field-label'>{props.emailLabel}</span>
								<InputComponent
									variant='auth'
									onChangeValue={(value) => {
										setCredentials((previousCredentials) => {
											return {
												...previousCredentials,
												email: value
											};
										});
									}}
									value={credentials.email}
									placeholder={props.emailPlaceholder}
									autoComplete='email'
									inputMode='email'
									disabled={props.isLoading}
								/>
							</label>
							<label className='auth-field'>
								<span className='auth-field-label'>{props.passwordLabel}</span>
								<InputComponent
									variant='auth'
									onChangeValue={(value) => {
										setCredentials((previousCredentials) => {
											return {
												...previousCredentials,
												password: value
											};
										});
									}}
									value={credentials.password}
									placeholder={props.passwordPlaceholder}
									secureTextEntry={true}
									autoComplete={props.passwordAutoComplete}
									disabled={props.isLoading}
								/>
							</label>
						</div>
						<div className='auth-form-submit'>
							<AuthSubmitComponent
								text={props.submitLabel}
								type='submit'
								disabled={props.isLoading || !credentials.email || !credentials.password}
							/>
							<AuthLinkComponent
								text={props.alternateLabel}
								disabled={props.isLoading}
								onPress={props.onAlternateAction}
							/>
						</div>
					</form>
				</div>
			</div>
			<LoadingIndicatorComponent
				visible={props.isLoading}
				fullScreen={true}
			/>
		</section>
	);
};

export type AuthCredentialsScreenComponentProps = {
	eyebrow: string;
	title: string;
	description: string;
	emailLabel: string;
	emailPlaceholder: string;
	passwordLabel: string;
	passwordPlaceholder: string;
	passwordAutoComplete: string;
	submitLabel: string;
	alternateLabel: string;
	isLoading: boolean;
	onSubmit: (credentials: UserSecretInternal) => void;
	onAlternateAction: () => void;
};
