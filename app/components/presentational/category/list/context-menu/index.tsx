import React, { Component, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { i18n } from 'app/utilities/i18n';
import { ButtonsListComponentButton, ButtonsListComponent } from 'app/components/presentational/generic/buttons-list';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a modal dialog with the category options
 */
export class CategoryContextMenuComponent extends Component<CategoryContextMenuComponentInput & CategoryContextMenuComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			category
		} = this.props;

		if(category) {

			const {
				close
			} = this.props;

			const buttons: ButtonsListComponentButton[] = [ this.getEditButton(category), this.getDeleteButton(category) ];

			return (
				<ModalComponent
					visible={true}
					onClose={close}
					horizontalPosition='center'
					verticalPosition='bottom'>
					<ButtonsListComponent
						title={category.name}
						titleIcon={images.mediaType(category.mediaType)}
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
	 * @param category the category
	 * @returns the button
	 */
	private getDeleteButton(category: CategoryInternal): ButtonsListComponentButton {

		const {
			delete: deleteCallback,
			close
		} = this.props;

		return {
			label: i18n.t('category.list.delete'),
			icon: images.deleteButton(),
			onClick: (): void => {

				const title = i18n.t('category.common.alert.delete.title');
				const message = i18n.t('category.common.alert.delete.message', { name: category.name });
				ConfirmAlert.alert(title, message, () => {

					deleteCallback(category);
					close();
				});
			}
		};
	}

	/**
	 * The "Edit" button
	 * @param category the category
	 * @returns the button
	 */
	private getEditButton(category: CategoryInternal): ButtonsListComponentButton {

		const {
			edit,
			close
		} = this.props;

		return {
			label: i18n.t('category.list.edit'),
			icon: images.editButton(),
			onClick: (): void => {

				edit(category);
				close();
			}
		};
	}
}

/**
 * CategoryContextMenuComponent's input props
 */
export type CategoryContextMenuComponentInput = {

	/**
	 * The category linked with the modal. Undefined means no modal is displayed.
	 */
	category: CategoryInternal | undefined;
};

/**
 * CategoryContextMenuComponent's output props
 */
export type CategoryContextMenuComponentOutput = {

	/**
	 * Callback to edit the category
	 */
	edit: (category: CategoryInternal) => void;
	
	/**
	 * Callback to delete the category
	 */
	delete: (category: CategoryInternal) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;
};

