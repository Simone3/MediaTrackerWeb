import React, { ChangeEvent, Component, ReactNode, createRef } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { UserInternal } from 'app/data/models/internal/user';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole settings screen
 */
export class SettingsScreenComponent extends Component<SettingsScreenComponentProps, SettingsScreenComponentState> {
	private readonly fileInputRef = createRef<HTMLInputElement>();
	private lastImportObjectUrl?: string;
	public state: SettingsScreenComponentState = {
		confirmDialog: undefined
	};

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		this.revokeLastImportObjectUrl();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			user,
			isLoading
		} = this.props;
		const {
			confirmDialog
		} = this.state;

		return (
			<section className='settings-screen'>
				<div className='settings-header'>
					<h1 className='settings-title'>{i18n.t('settings.screen.title')}</h1>
				</div>
				<div className='settings-section'>
					<h2 className='settings-section-title'>{i18n.t('settings.screen.sections.user')}</h2>
					<button
						type='button'
						className='settings-row'
						disabled={isLoading}
						onClick={() => {
							this.handleLogout();
						}}>
						<span className='settings-row-title'>{i18n.t('settings.screen.rows.logout.title')}</span>
						<span className='settings-row-subtitle'>{i18n.t('settings.screen.rows.logout.subtitle', { username: user ? user.email : '' })}</span>
					</button>
				</div>
				<div className='settings-section'>
					<h2 className='settings-section-title'>{i18n.t('settings.screen.sections.data')}</h2>
					<button
						type='button'
						className='settings-row'
						disabled={isLoading}
						onClick={() => {
							this.requestOldAppImport();
						}}>
						<span className='settings-row-title'>{i18n.t('settings.screen.rows.oldAppImport.title')}</span>
						<span className='settings-row-subtitle'>{i18n.t('settings.screen.rows.oldAppImport.subtitle')}</span>
					</button>
				</div>
				<input
					ref={this.fileInputRef}
					className='settings-file-input'
					type='file'
					accept='.json,application/json'
					onChange={(event) => {
						this.handleFileSelected(event);
					}}
				/>
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
	 * Triggers the old-app import pre-confirmation and opens file picker
	 */
	private requestOldAppImport(): void {
		const title = i18n.t('settings.screen.alert.oldAppImport.prePicker.title');
		const message = i18n.t('settings.screen.alert.oldAppImport.prePicker.message');
		this.openConfirmDialog(title, message, () => {
			if(this.fileInputRef.current) {
				this.fileInputRef.current.click();
			}
		});
	}

	/**
	 * Handles the selected JSON file and starts import once confirmed
	 * @param event input file selection event
	 */
	private handleFileSelected(event: ChangeEvent<HTMLInputElement>): void {
		const selectedFile = event.target.files && event.target.files.length > 0 ? event.target.files[0] : undefined;
		event.target.value = '';
		if(!selectedFile) {
			return;
		}

		const title = i18n.t('settings.screen.alert.oldAppImport.postPicker.title');
		const message = i18n.t('settings.screen.alert.oldAppImport.postPicker.message', { filename: selectedFile.name });
		this.openConfirmDialog(title, message, () => {
			this.revokeLastImportObjectUrl();
			if(typeof URL.createObjectURL === 'function') {
				this.lastImportObjectUrl = URL.createObjectURL(selectedFile);
				this.props.importOldAppExport(this.lastImportObjectUrl);
				return;
			}

			selectedFile.text().then((content) => {
				this.props.importOldAppExport(`data:application/json;charset=utf-8,${encodeURIComponent(content)}`);
			});
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

	/**
	 * Revokes the last generated import object URL, if any
	 */
	private revokeLastImportObjectUrl(): void {
		if(this.lastImportObjectUrl) {
			if(typeof URL.revokeObjectURL === 'function') {
				URL.revokeObjectURL(this.lastImportObjectUrl);
			}
			this.lastImportObjectUrl = undefined;
		}
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
}

/**
 * SettingsScreenComponent's output props
 */
export type SettingsScreenComponentOutput = {
	/**
	 * Callback to log the user out
	 */
	logout: () => void;

	/**
	 * Callback to handle the old Media Tracker app export (JSON file object URL)
	 */
	importOldAppExport: (jsonFileUri: string) => void;
}

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
}
