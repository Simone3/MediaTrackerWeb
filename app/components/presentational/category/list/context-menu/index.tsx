import React, { Component, ReactNode } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
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
				<div className='category-context-menu-overlay' role='presentation' onClick={close}>
					<div
						className='category-context-menu'
						role='dialog'
						aria-modal={true}
						aria-labelledby='category-context-menu-title'
						onClick={(event) => {
							event.stopPropagation();
						}}>
						<div className='category-context-menu-handle' />
						<header className='category-context-menu-header'>
							<h2 id='category-context-menu-title' className='category-context-menu-title'>{category.name}</h2>
							<p className='category-context-menu-media'>{i18n.t(`category.mediaTypes.${category.mediaType}`)}</p>
						</header>
						<div className='category-context-menu-actions'>
							<button
								type='button'
								className='category-context-menu-button'
								onClick={() => {
									this.props.edit(category);
									close();
								}}>
								{i18n.t('category.list.edit')}
							</button>
							<button
								type='button'
								className='category-context-menu-button category-context-menu-button-danger'
								onClick={() => {
									this.setState({
										deleteConfirmationVisible: true
									});
								}}>
								{i18n.t('category.list.delete')}
							</button>
						</div>
					</div>
				</div>
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

type CategoryContextMenuComponentState = {
	deleteConfirmationVisible: boolean;
};
