import { Component, ReactNode } from 'react';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { UserInternal } from 'app/data/models/internal/user';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole settings screen
 */
export class SettingsScreenComponent extends Component<SettingsScreenComponentProps, SettingsScreenComponentState> {
	public state: SettingsScreenComponentState = {
		confirmDialog: undefined
	};

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			user,
			isLoading,
			openCredits
		} = this.props;
		const {
			confirmDialog
		} = this.state;

		return (
			<section className='settings-screen'>
				<div className='settings-shell'>
					<AuthenticatedPageHeaderComponent
						title={i18n.t('settings.screen.title')}
						subtitle={i18n.t('settings.screen.subtitle')}
					/>
					<div className='settings-panel'>
						<div className='settings-section'>
							<h2 className='settings-section-title'>{i18n.t('settings.screen.sections.user')}</h2>
							<button
								type='button'
								className='settings-row'
								disabled={isLoading}
								onClick={() => {
									this.handleLogout();
								}}>
								<span className='settings-row-copy'>
									<span className='settings-row-title'>{i18n.t('settings.screen.rows.logout.title')}</span>
									<span className='settings-row-subtitle'>{i18n.t('settings.screen.rows.logout.subtitle', { username: user ? user.email : '' })}</span>
								</span>
							</button>
						</div>
						<div className='settings-section'>
							<h2 className='settings-section-title'>{i18n.t('settings.screen.sections.about')}</h2>
							<button
								type='button'
								className='settings-row'
								disabled={isLoading}
								onClick={openCredits}>
								<span className='settings-row-copy'>
									<span className='settings-row-title'>{i18n.t('settings.screen.rows.credits.title')}</span>
									<span className='settings-row-subtitle'>{i18n.t('settings.screen.rows.credits.subtitle')}</span>
								</span>
							</button>
						</div>
					</div>
				</div>
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
				<ConfirmDialogComponent
					visible={Boolean(confirmDialog)}
					title={confirmDialog ? confirmDialog.title : ''}
					message={confirmDialog ? confirmDialog.message : ''}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						if(confirmDialog) {
							confirmDialog.onConfirm();
						}
						this.closeConfirmDialog();
					}}
					onCancel={() => {
						this.closeConfirmDialog();
					}}
				/>
			</section>
		);
	}

	/**
	 * Handles logout flow with user confirmation
	 */
	private handleLogout(): void {
		const title = i18n.t('settings.screen.alert.logout.title');
		const message = i18n.t('settings.screen.alert.logout.message');
		this.openConfirmDialog(title, message, () => {
			this.props.logout();
		});
	}

	/**
	 * Shows the confirmation dialog with callback
	 * @param title dialog title
	 * @param message dialog message
	 * @param onConfirm callback executed on confirm
	 */
	private openConfirmDialog(title: string, message: string, onConfirm: () => void): void {
		this.setState({
			confirmDialog: {
				title: title,
				message: message,
				onConfirm: onConfirm
			}
		});
	}

	/**
	 * Closes any open confirmation dialog
	 */
	private closeConfirmDialog(): void {
		this.setState({
			confirmDialog: undefined
		});
	}
}

/**
 * SettingsScreenComponent's input props
 */
export type SettingsScreenComponentInput = {
	/**
	 * The current user
	 */
	user?: UserInternal;

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;
};

/**
 * SettingsScreenComponent's output props
 */
export type SettingsScreenComponentOutput = {
	/**
	 * Callback to log the user out
	 */
	logout: () => void;

	/**
	 * Callback to open the credits screen
	 */
	openCredits: () => void;
};

/**
 * SettingsScreenComponent's props
 */
export type SettingsScreenComponentProps = SettingsScreenComponentInput & SettingsScreenComponentOutput;

type SettingsScreenComponentState = {
	confirmDialog?: {
		title: string;
		message: string;
		onConfirm: () => void;
	};
};
