import { Component, CSSProperties, ReactNode } from 'react';
import { MediaIconComponent } from 'app/components/presentational/category/common/media-icon';
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
			highlighted,
			open,
			showOptionsMenu
		} = this.props;
		const cardClassName = highlighted ? 'category-row category-row-highlighted' : 'category-row';

		return (
			<article
				className={cardClassName}
				style={{ '--category-color': category.color } as CSSProperties}>
				<span className='category-row-accent' aria-hidden={true} />
				<button type='button' className='category-row-main' onClick={open}>
					<span className='category-row-leading'>
						<span className='category-row-icon-shell' aria-hidden={true}>
							<MediaIconComponent mediaType={category.mediaType} className='category-row-icon' />
						</span>
						<span className='category-row-copy'>
							<span className='category-row-name'>{category.name}</span>
						</span>
					</span>
				</button>
				<button
					type='button'
					className='category-row-options'
					onClick={(event) => {
						showOptionsMenu(event.currentTarget.getBoundingClientRect());
					}}
					aria-label={i18n.t('common.a11y.optionsFor', { name: category.name })}>
					<span className='category-row-options-icon' aria-hidden={true}>...</span>
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
	 * True when the row options menu is open for this category
	 */
	highlighted: boolean;

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
	showOptionsMenu: (buttonRect: DOMRect) => void;
};
