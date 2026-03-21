import React, { Component, ReactElement, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { CategoryContextMenuAnchorRect, CategoryContextMenuComponent } from 'app/components/presentational/category/list/context-menu';
import { CategoryRowComponent } from 'app/components/presentational/category/list/row';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the list of user categories
 */
export class CategoriesListComponent extends Component<CategoriesListComponentInput & CategoriesListComponentOutput, CategoriesListComponentState> {
	public state: CategoriesListComponentState = {
		menuAnchorRect: undefined
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CategoriesListComponentInput & CategoriesListComponentOutput>): void {
		if(prevProps.highlightedCategory && !this.props.highlightedCategory && this.state.menuAnchorRect) {
			this.setState({
				menuAnchorRect: undefined
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		return this.renderList();
	}

	/**
	 * Helper method to render loading skeleton rows
	 * @returns the node portion
	 */
	private renderSkeletons(): ReactElement {
		const loadingRows = Array.from({ length: 4 }, (_, index) => {
			return index;
		});

		return (
			<ul className='categories-list-items categories-list-skeleton-items' aria-hidden={true}>
				{loadingRows.map((loadingRow) => {
					return (
						<li key={loadingRow} className='categories-list-item categories-list-skeleton-row'>
							<div className='category-row category-row-skeleton'>
								<span className='category-row-accent list-skeleton-block categories-list-skeleton-accent' />
								<div className='category-row-main'>
									<div className='category-row-leading'>
										<span className='category-row-icon-shell list-skeleton-block categories-list-skeleton-icon' />
										<span className='category-row-copy categories-list-skeleton-copy'>
											<span className='list-skeleton-block categories-list-skeleton-title' />
										</span>
									</div>
								</div>
								<div className='category-row-options'>
									<span className='list-skeleton-block categories-list-skeleton-options-icon' />
								</div>
							</div>
						</li>
					);
				})}
			</ul>
		);
	}

	/**
	 * Helper method to render the no categories message
	 * @returns the node portion
	 */
	private renderNone(): ReactElement {
		return (
			<div className='categories-list-empty'>
				<p className='categories-list-empty-title'>{i18n.t('category.list.empty')}</p>
				<p className='categories-list-empty-copy'>{i18n.t('category.list.emptyHint')}</p>
			</div>
		);
	}

	/**
	 * Helper method to render categories list
	 * @returns the node portion
	 */
	private renderList(): ReactNode {
		const {
			categories,
			highlightedCategory,
			showEmptyState,
			showSkeletons,
			selectCategory,
			highlightCategory,
			editCategory,
			deleteCategory,
			closeCategoryMenu
		} = this.props;
		let listContent: ReactNode;

		if(showSkeletons) {
			listContent = this.renderSkeletons();
		}
		else if(showEmptyState) {
			listContent = this.renderNone();
		}
		else {
			listContent = (
				<ul className='categories-list-items'>
					{categories.map((category: CategoryInternal) => {
						const highlighted = highlightedCategory?.id === category.id;
						const itemClassName = highlighted ? 'categories-list-item categories-list-item-highlighted' : 'categories-list-item';

						return (
							<li key={category.id} className={itemClassName}>
								<CategoryRowComponent
									category={category}
									highlighted={highlighted}
									open={() => {
										selectCategory(category);
									}}
									showOptionsMenu={(buttonRect) => {
										this.setState({
											menuAnchorRect: {
												top: buttonRect.top,
												bottom: buttonRect.bottom,
												left: buttonRect.left,
												right: buttonRect.right,
												width: buttonRect.width,
												height: buttonRect.height
											}
										});
										highlightCategory(category);
									}}
								/>
							</li>
						);
					})}
				</ul>
			);
		}

		return (
			<div className='categories-list' aria-busy={showSkeletons}>
				{listContent}
				<CategoryContextMenuComponent
					category={highlightedCategory}
					anchorRect={this.state.menuAnchorRect}
					edit={editCategory}
					delete={deleteCategory}
					close={() => {
						this.setState({
							menuAnchorRect: undefined
						});
						closeCategoryMenu();
					}}
				/>
			</div>
		);
	}
}

/**
 * CategoriesListComponent's input props
 */
export type CategoriesListComponentInput = {
	/**
	 * The categories list to be displayed
	 */
	categories: CategoryInternal[];

	/**
	 * The currently highlighted category, if any
	 */
	highlightedCategory: CategoryInternal | undefined;

	/**
	 * Whether the list should render the empty-state card
	 */
	showEmptyState: boolean;

	/**
	 * Whether the list should render loading skeletons
	 */
	showSkeletons: boolean;
}

/**
 * CategoriesListComponent's output props
 */
export type CategoriesListComponentOutput = {
	/**
	 * Callback to select a category, e.g. to open the list of its media items
	 */
	selectCategory: (category: CategoryInternal) => void;

	/**
	 * Callback to set a category as highlighted, e.g. to open its dialog menu
	 */
	highlightCategory: (category: CategoryInternal) => void;

	/**
	 * Callback to edit a category from the context menu
	 */
	editCategory: (category: CategoryInternal) => void;

	/**
	 * Callback to delete a category from the context menu
	 */
	deleteCategory: (category: CategoryInternal) => void;

	/**
	 * Callback to close the category context menu
	 */
	closeCategoryMenu: () => void;

}

type CategoriesListComponentState = {
	menuAnchorRect: CategoryContextMenuAnchorRect | undefined;
}
