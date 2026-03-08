import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { styles } from 'app/components/presentational/settings/screen/styles';
import { ClickableSettingsRowComponent } from 'app/components/presentational/settings/row-clickable';
import { SettingsSectionTitleComponent } from 'app/components/presentational/settings/section-title';
import { i18n } from 'app/utilities/i18n';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { UserInternal } from 'app/data/models/internal/user';
import { FilePicker } from 'app/components/presentational/generic/file-picker';

/**
 * Presentational component that contains the whole settings screen
 */
export class SettingsScreenComponent extends Component<SettingsScreenComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View style={styles.container}>
				<SettingsSectionTitleComponent title={i18n.t('settings.screen.sections.user')} />
				{this.renderLogoutButton()}
				<SettingsSectionTitleComponent title={i18n.t('settings.screen.sections.data')} />
				{this.renderOldAppImportButton()}
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
					fullScreen={true}
				/>
			</View>
		);
	}

	/**
	 * Helper to render the logout button
	 * @returns the component
	 */
	private renderLogoutButton(): ReactNode {

		const {
			user,
			logout
		} = this.props;

		return (
			<ClickableSettingsRowComponent
				title={i18n.t('settings.screen.rows.logout.title')}
				subtitle={i18n.t('settings.screen.rows.logout.subtitle', { username: user ? user.email : '' })}
				onPress={() => {

					const title = i18n.t('settings.screen.alert.logout.title');
					const message = i18n.t('settings.screen.alert.logout.message');
					ConfirmAlert.alert(title, message, () => {
		
						logout();
					});
				}}
			/>
		);
	}

	/**
	 * Helper to render the button to import the old Media Tracker app JSON export
	 * @returns the component
	 */
	private renderOldAppImportButton(): ReactNode {

		const {
			importOldAppExport
		} = this.props;

		return (
			<ClickableSettingsRowComponent
				title={i18n.t('settings.screen.rows.oldAppImport.title')}
				subtitle={i18n.t('settings.screen.rows.oldAppImport.subtitle')}
				onPress={() => {

					const preTitle = i18n.t('settings.screen.alert.oldAppImport.prePicker.title');
					const preMessage = i18n.t('settings.screen.alert.oldAppImport.prePicker.message');
					ConfirmAlert.alert(preTitle, preMessage, async() => {
		
						const oldAppJson = await FilePicker.pickJson();
						if(oldAppJson) {

							const postTitle = i18n.t('settings.screen.alert.oldAppImport.postPicker.title');
							const postMessage = i18n.t('settings.screen.alert.oldAppImport.postPicker.message', { filename: oldAppJson.name });
							ConfirmAlert.alert(postTitle, postMessage, () => {

								importOldAppExport(oldAppJson.uri);
							});
						}
					});
				}}
			/>
		);
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
	 * Callback to handle the old Media Tracker app export (JSON file)
	 */
	importOldAppExport: (jsonFileUri: string) => void;
}

/**
 * SettingsScreenComponent's props
 */
export type SettingsScreenComponentProps = SettingsScreenComponentInput & SettingsScreenComponentOutput;
