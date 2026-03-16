import React, { Component, ReactElement, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { CategoryContextMenuComponent } from 'app/components/presentational/category/list/context-menu';
import { CategoryRowComponent } from 'app/components/presentational/category/list/row';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display the list of user categories
 */
export class CategoriesListComponent extends Component<CategoriesListComponentInput & CategoriesListComponentOutput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return this.renderList();
	}

	/**
	 * Helper method to render the no categories message
	 * @returns the node portion
	 */
	private renderNone(): ReactElement {
		return <p className='categories-list-empty'>{i18n.t('category.list.empty')}</p>;
	}

	/**
	 * Helper method to render categories list
	 * @returns the node portion
	 */
	private renderList(): ReactNode {
		const {
			categories,
			highlightedCategory,
			selectCategory,
			highlightCategory,
			editCategory,
			deleteCategory,
			closeCategoryMenu
		} = this.props;

		return (
			<div className='categories-list'>
				<div className='categories-list-header'>
					<h1 className='categories-list-title'>{i18n.t('category.list.title')}</h1>
				</div>
				{categories.length === 0 ?
					this.renderNone() :
					(
					<ul className='categories-list-items'>
						{categories.map((category: CategoryInternal) => {
							return (
								<li key={category.id} className='categories-list-item'>
									<CategoryRowComponent
										category={category}
										open={() => {
											selectCategory(category);
										}}
										showOptionsMenu={() => {
											highlightCategory(category);
										}}
									/>
								</li>
							);
						})}
					</ul>
				)}
				<CategoryContextMenuComponent
					category={highlightedCategory}
					edit={editCategory}
					delete={deleteCategory}
					close={closeCategoryMenu}
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
