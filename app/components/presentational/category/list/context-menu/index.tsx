import React, { Component, ReactNode } from 'react';
import { CATEGORIES_MOBILE_BREAKPOINT } from 'app/components/presentational/category/list/constants';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the category options popup
 */
export class CategoryContextMenuComponent extends Component<CategoryContextMenuComponentInput & CategoryContextMenuComponentOutput, CategoryContextMenuComponentState> {
	public state: CategoryContextMenuComponentState = {
		deleteConfirmationVisible: false,
		isMobileLayout: this.isMobileLayout()
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('resize', this.handleResize);
	}

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
	public componentWillUnmount(): void {
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('resize', this.handleResize);
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
				{this.state.isMobileLayout ?
					this.renderSheet(category, close) :
					this.renderPopover(category, close)}
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
	 * Renders the mobile bottom sheet menu
	 * @param category active category
	 * @param close callback to close the menu
	 * @returns the mobile menu node
	 */
	private renderSheet(category: CategoryInternal, close: () => void): ReactNode {
		return (
			<div className='category-context-menu-overlay' role='presentation' onClick={close}>
				<div
					className='category-context-menu category-context-menu-sheet'
					role='dialog'
					aria-modal={true}
					aria-labelledby='category-context-menu-title'
					onClick={(event) => {
						event.stopPropagation();
					}}>
					<div className='category-context-menu-handle' />
					{this.renderMenuContent(category, close)}
				</div>
			</div>
		);
	}

	/**
	 * Renders the desktop popover menu
	 * @param category active category
	 * @param close callback to close the menu
	 * @returns the desktop popover node
	 */
	private renderPopover(category: CategoryInternal, close: () => void): ReactNode {
		return (
			<div className='category-context-menu-layer' role='presentation'>
				<button
					type='button'
					className='category-context-menu-dismiss'
					onClick={close}
					aria-label={i18n.t('common.a11y.closeCategoryActions')}
				/>
				<div
					className='category-context-menu category-context-menu-popover'
					role='dialog'
					aria-modal={false}
					aria-labelledby='category-context-menu-title'
					style={this.getPopoverStyle()}>
					{this.renderMenuContent(category, close)}
				</div>
			</div>
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
				<header className='category-context-menu-header'>
					<h2 id='category-context-menu-title' className='category-context-menu-title'>{category.name}</h2>
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
			</>
		);
	}

	/**
	 * Computes the desktop popover position from the clicked options button
	 * @returns style object for the popover
	 */
	private getPopoverStyle(): React.CSSProperties {
		const popoverWidth = 272;
		const popoverHeight = 176;
		const viewportPadding = 16;
		const anchorRect = this.props.anchorRect;

		if(!anchorRect) {
			return {
				top: viewportPadding,
				right: viewportPadding
			};
		}

		const left = Math.min(
			Math.max(viewportPadding, anchorRect.right - popoverWidth),
			window.innerWidth - popoverWidth - viewportPadding
		);
		const openAbove = anchorRect.bottom + 12 + popoverHeight > window.innerHeight - viewportPadding;
		const top = openAbove ?
			Math.max(viewportPadding, anchorRect.top - popoverHeight - 12) :
			Math.min(anchorRect.bottom + 12, window.innerHeight - popoverHeight - viewportPadding);

		return {
			top,
			left
		};
	}

	/**
	 * Closes the menu when Escape is pressed
	 * @param event keyboard event
	 */
	private handleKeyDown = (event: KeyboardEvent): void => {
		if(event.key === 'Escape' && this.props.category && !this.state.deleteConfirmationVisible) {
			this.props.close();
		}
	};

	/**
	 * Updates the responsive layout state
	 */
	private handleResize = (): void => {
		const isMobileLayout = this.isMobileLayout();

		if(isMobileLayout !== this.state.isMobileLayout) {
			this.setState({
				isMobileLayout
			});
		}
	};

	/**
	 * Checks whether the viewport should use the mobile sheet
	 * @returns true if the mobile sheet should be shown
	 */
	private isMobileLayout(): boolean {
		return window.innerWidth <= CATEGORIES_MOBILE_BREAKPOINT;
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

export type CategoryContextMenuAnchorRect = {
	top: number;
	bottom: number;
	left: number;
	right: number;
	width: number;
	height: number;
};

type CategoryContextMenuComponentState = {
	deleteConfirmationVisible: boolean;
	isMobileLayout: boolean;
};
