import React, { Component, ReactNode } from 'react';
import { GroupInternal } from 'app/data/models/internal/group';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { i18n } from 'app/utilities/i18n';
import { ButtonsListComponentButton, ButtonsListComponent } from 'app/components/presentational/generic/buttons-list';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a modal dialog with the group options
 */
export class GroupContextMenuComponent extends Component<GroupContextMenuComponentInput & GroupContextMenuComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			group
		} = this.props;

		if(group) {

			const {
				close
			} = this.props;

			const buttons: ButtonsListComponentButton[] = [ this.getEditButton(group), this.getDeleteButton(group) ];

			return (
				<ModalComponent
					visible={true}
					onClose={close}
					horizontalPosition='center'
					verticalPosition='bottom'>
					<ButtonsListComponent
						title={group.name}
						titleIcon={images.groupField()}
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
	 * @param group the group
	 * @returns the button
	 */
	private getDeleteButton(group: GroupInternal): ButtonsListComponentButton {

		const {
			delete: deleteCallback,
			close
		} = this.props;

		return {
			label: i18n.t('group.list.delete'),
			icon: images.deleteButton(),
			onClick: (): void => {

				const title = i18n.t('group.common.alert.delete.title');
				const message = i18n.t('group.common.alert.delete.message', { name: group.name });
				ConfirmAlert.alert(title, message, () => {

					deleteCallback(group);
					close();
				});
			}
		};
	}

	/**
	 * The "Edit" button
	 * @param group the group
	 * @returns the button
	 */
	private getEditButton(group: GroupInternal): ButtonsListComponentButton {

		const {
			edit,
			close
		} = this.props;

		return {
			label: i18n.t('group.list.edit'),
			icon: images.editButton(),
			onClick: (): void => {

				edit(group);
				close();
			}
		};
	}
}

/**
 * GroupContextMenuComponent's input props
 */
export type GroupContextMenuComponentInput = {

	/**
	 * The group linked with the modal. Undefined means no modal is displayed.
	 */
	group: GroupInternal | undefined;
};

/**
 * GroupContextMenuComponent's output props
 */
export type GroupContextMenuComponentOutput = {

	/**
	 * Callback to edit the group
	 */
	edit: (group: GroupInternal) => void;
	
	/**
	 * Callback to delete the group
	 */
	delete: (group: GroupInternal) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;
};

