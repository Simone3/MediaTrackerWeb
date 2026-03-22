import React, { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { ResponsiveActionMenuAnchorRect, ResponsiveActionMenuComponent } from 'app/components/presentational/generic/responsive-action-menu';
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

		return (
			<>
				<ResponsiveActionMenuComponent
					visible={true}
					anchorRect={this.props.anchorRect}
					labelledBy='category-context-menu-title'
					closeAriaLabel={i18n.t('common.a11y.closeCategoryActions')}
					onClose={close}
					popoverWidth={272}
					popoverHeight={176}
					escapeDisabled={this.state.deleteConfirmationVisible}
					layerClassName='responsive-action-menu-layer category-context-menu-layer'
					dismissClassName='responsive-action-menu-dismiss category-context-menu-dismiss'
					overlayClassName='responsive-action-menu-overlay category-context-menu-overlay'
					popoverClassName='responsive-action-menu responsive-action-menu-popover category-context-menu category-context-menu-popover'
					sheetClassName='responsive-action-menu responsive-action-menu-sheet category-context-menu category-context-menu-sheet'
					handleClassName='responsive-action-menu-handle category-context-menu-handle'>
					{this.renderMenuContent(category, close)}
				</ResponsiveActionMenuComponent>
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

	/**
	 * Renders the shared menu header and actions
	 * @param category active category
	 * @param close callback to close the menu
	 * @returns the shared menu content
	 */
	private renderMenuContent(category: CategoryInternal, close: () => void): ReactNode {
		return (
			<>
				<header className='responsive-action-menu-header category-context-menu-header'>
					<h2 id='category-context-menu-title' className='responsive-action-menu-title category-context-menu-title'>{category.name}</h2>
				</header>
				<div className='responsive-action-menu-actions category-context-menu-actions'>
					<button
						type='button'
						className='responsive-action-menu-button category-context-menu-button'
						onClick={() => {
							this.props.edit(category);
							close();
						}}>
						{i18n.t('category.list.edit')}
					</button>
					<button
						type='button'
						className='responsive-action-menu-button responsive-action-menu-button-danger category-context-menu-button category-context-menu-button-danger'
						onClick={() => {
							this.setState({
								deleteConfirmationVisible: true
							});
						}}>
						{i18n.t('category.list.delete')}
					</button>
				</div>
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
