import React, { Component, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display a generic category row
 */
export class CategoryRowComponent extends Component<CategoryRowComponentInput & CategoryRowComponentOutput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			category,
			open,
			showOptionsMenu
		} = this.props;

		const mediaType = i18n.t(`category.mediaTypes.${category.mediaType}`);

		return (
			<article className='category-row' style={{ backgroundColor: category.color }}>
				<button type='button' className='category-row-main' onClick={open}>
					<span className='category-row-media'>{mediaType}</span>
					<span className='category-row-name'>{category.name}</span>
				</button>
				<button
					type='button'
					className='category-row-options'
					onClick={showOptionsMenu}
					aria-label={`Options for ${category.name}`}>
					...
				</button>
			</article>
		);
	}
}

/**
 * CategoryRowComponent's input props
 */
export type CategoryRowComponentInput = {
	/**
	 * The category to be displayed
	 */
	category: CategoryInternal;
};

/**
 * CategoryRowComponent's output props
 */
export type CategoryRowComponentOutput = {
	/**
	 * Callback to open the list of the category media items
	 */
	open: () => void;

	/**
	 * Callback to open the options context menu (with e.g. the edit button)
	 */
	showOptionsMenu: () => void;
};
