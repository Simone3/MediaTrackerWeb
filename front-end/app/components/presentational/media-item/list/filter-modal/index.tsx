import { Component, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { MediaItemFilterFormComponent } from 'app/components/presentational/media-item/list/filter-form/wrapper/media-item';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component to display a modal dialog with the media item filter options
 */
export class MediaItemFilterModalComponent extends Component<MediaItemFilterModalComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		if(!this.props.visible) {
			return null;
		}

		return (
			<div
				className='media-item-filter-overlay'
				role='presentation'
				onClick={() => {
					this.props.close();
				}}>
				<section
					className='media-item-filter-modal'
					role='dialog'
					aria-modal={true}
					aria-labelledby='media-item-filter-title'
					onClick={(event) => {
						event.stopPropagation();
					}}>
					<h2 id='media-item-filter-title' className='media-item-filter-title'>
						{i18n.t('mediaItem.list.filter.title')}
					</h2>
					<MediaItemFilterFormComponent
						category={this.props.category}
						initialFilter={this.props.initialFilter}
						initialSortBy={this.props.initialSortBy}
						submitFilter={this.props.submitFilter}
						close={this.props.close}
					/>
				</section>
			</div>
		);
	}
}

/**
 * MediaItemFilterModalComponent's input props
 */
export type MediaItemFilterModalComponentInput = {
	/**
	 * The linked category
	 */
	category: CategoryInternal;

	/**
	 * The initial filter values for the form inputs
	 */
	initialFilter: MediaItemFilterInternal;

	/**
	 * The initial sort values for the form inputs
	 */
	initialSortBy: MediaItemSortByInternal[];

	/**
	 * If the component should be displayed at this moment
	 */
	visible: boolean;
};

/**
 * MediaItemFilterModalComponent's output props
 */
export type MediaItemFilterModalComponentOutput = {
	/**
	 * Callback to submit the filter options
	 */
	submitFilter: (filter: MediaItemFilterInternal, sortBy: MediaItemSortByInternal[]) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;
};

/**
 * MediaItemFilterModalComponent's props
 */
export type MediaItemFilterModalComponentProps = MediaItemFilterModalComponentInput & MediaItemFilterModalComponentOutput;
