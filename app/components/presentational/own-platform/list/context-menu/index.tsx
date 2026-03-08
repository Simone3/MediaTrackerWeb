import React, { Component, ReactNode } from 'react';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { i18n } from 'app/utilities/i18n';
import { ButtonsListComponentButton, ButtonsListComponent } from 'app/components/presentational/generic/buttons-list';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a modal dialog with the own platform options
 */
export class OwnPlatformContextMenuComponent extends Component<OwnPlatformContextMenuComponentInput & OwnPlatformContextMenuComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			ownPlatform
		} = this.props;

		if(ownPlatform) {

			const {
				close
			} = this.props;

			const buttons: ButtonsListComponentButton[] = [ this.getEditButton(ownPlatform), this.getDeleteButton(ownPlatform) ];

			return (
				<ModalComponent
					visible={true}
					onClose={close}
					horizontalPosition='center'
					verticalPosition='bottom'>
					<ButtonsListComponent
						title={ownPlatform.name}
						titleIcon={images.ownPlatformField()}
						buttons={buttons}
					/>
				</ModalComponent>
			);
		}
		else {

			return null;
		}
	}

	/**
	 * The "Delete" button
	 * @param ownPlatform the ownPlatform
	 * @returns the button
	 */
	private getDeleteButton(ownPlatform: OwnPlatformInternal): ButtonsListComponentButton {

		const {
			delete: deleteCallback,
			close
		} = this.props;

		return {
			label: i18n.t('ownPlatform.list.delete'),
			icon: images.deleteButton(),
			onClick: (): void => {

				const title = i18n.t('ownPlatform.common.alert.delete.title');
				const message = i18n.t('ownPlatform.common.alert.delete.message', { name: ownPlatform.name });
				ConfirmAlert.alert(title, message, () => {

					deleteCallback(ownPlatform);
					close();
				});
			}
		};
	}

	/**
	 * The "Edit" button
	 * @param ownPlatform the ownPlatform
	 * @returns the button
	 */
	private getEditButton(ownPlatform: OwnPlatformInternal): ButtonsListComponentButton {

		const {
			edit,
			close
		} = this.props;

		return {
			label: i18n.t('ownPlatform.list.edit'),
			icon: images.editButton(),
			onClick: (): void => {

				edit(ownPlatform);
				close();
			}
		};
	}
}

/**
 * OwnPlatformContextMenuComponent's input props
 */
export type OwnPlatformContextMenuComponentInput = {

	/**
	 * The ownPlatform linked with the modal. Undefined means no modal is displayed.
	 */
	ownPlatform: OwnPlatformInternal | undefined;
};

/**
 * OwnPlatformContextMenuComponent's output props
 */
export type OwnPlatformContextMenuComponentOutput = {

	/**
	 * Callback to edit the ownPlatform
	 */
	edit: (ownPlatform: OwnPlatformInternal) => void;
	
	/**
	 * Callback to delete the ownPlatform
	 */
	delete: (ownPlatform: OwnPlatformInternal) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;
};

