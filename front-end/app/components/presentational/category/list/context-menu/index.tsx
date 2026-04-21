import { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { ResponsiveActionMenuAction, ResponsiveActionMenuAnchorRect, ResponsiveActionMenuComponent } from 'app/components/presentational/generic/responsive-action-menu';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the category options popup
 */
export class CategoryContextMenuComponent extends Component<CategoryContextMenuComponentInput & CategoryContextMenuComponentOutput, CategoryContextMenuComponentState> {
	public state: CategoryContextMenuComponentState = {
		deleteConfirmationVisible: false
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CategoryContextMenuComponentInput & CategoryContextMenuComponentOutput>): void {
		if(prevProps.category?.id !== this.props.category?.id && this.state.deleteConfirmationVisible) {
			this.setState({
				deleteConfirmationVisible: false
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			category,
			close
		} = this.props;

		if(!category) {
			return null;
		}

		const actions: ResponsiveActionMenuAction[] = [
			{
				label: i18n.t('category.list.edit'),
				onClick: () => {
					this.props.edit(category);
					close();
				}
			},
			{
				label: i18n.t('category.list.delete'),
				onClick: () => {
					this.setState({
						deleteConfirmationVisible: true
					});
				},
				tone: 'danger'
			}
		];

		return (
			<>
				<ResponsiveActionMenuComponent
					visible={true}
					anchorRect={this.props.anchorRect}
					title={category.name}
					closeAriaLabel={i18n.t('common.a11y.closeCategoryActions')}
					onClose={close}
					escapeDisabled={this.state.deleteConfirmationVisible}
					actions={actions}
				/>
				<ConfirmDialogComponent
					visible={this.state.deleteConfirmationVisible}
					title={i18n.t('category.common.alert.delete.title')}
					message={i18n.t('category.common.alert.delete.message', { name: category.name })}
					confirmLabel={i18n.t('common.alert.default.okButton')}
					cancelLabel={i18n.t('common.alert.default.cancelButton')}
					onConfirm={() => {
						this.setState({
							deleteConfirmationVisible: false
						}, () => {
							this.props.delete(category);
							close();
						});
					}}
					onCancel={() => {
						this.setState({
							deleteConfirmationVisible: false
						});
					}}
				/>
			</>
		);
	}
}

/**
 * CategoryContextMenuComponent's input props
 */
export type CategoryContextMenuComponentInput = {
	/**
	 * The category linked with the popup. Undefined means no popup is displayed.
	 */
	category: CategoryInternal | undefined;

	/**
	 * Bounding rect of the options button that opened the menu
	 */
	anchorRect?: CategoryContextMenuAnchorRect;
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

export type CategoryContextMenuAnchorRect = ResponsiveActionMenuAnchorRect;

type CategoryContextMenuComponentState = {
	deleteConfirmationVisible: boolean;
};
