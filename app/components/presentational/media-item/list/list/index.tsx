import React, { Component, ReactElement, ReactNode } from 'react';
import { InputComponent } from 'app/components/presentational/generic/input';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { MediaItemContextMenuAnchorRect, MediaItemContextMenuComponent } from 'app/components/presentational/media-item/list/context-menu';
import { MediaItemRowComponent } from 'app/components/presentational/media-item/list/row';
import { GroupInternal } from 'app/data/models/internal/group';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';
import { CategoryInternal } from 'app/data/models/internal/category';

/**
 * Presentational component to display the list of user media items
 */
export class MediaItemsListComponent extends Component<MediaItemsListComponentInput & MediaItemsListComponentOutput, MediaItemsListComponentState> {
	private readonly searchInputRef = React.createRef<HTMLInputElement>();

	public state: MediaItemsListComponentState = {
		searchTerm: this.props.currentSearchTerm || '',
		menuAnchorRect: undefined
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemsListComponentInput & MediaItemsListComponentOutput>): void {
		if (
			prevProps.category.id !== this.props.category.id ||
			prevProps.currentSearchTerm !== this.props.currentSearchTerm
		) {
			const nextSearchTerm = this.props.currentSearchTerm || '';
			if (nextSearchTerm !== this.state.searchTerm) {
				this.setState({
					searchTerm: nextSearchTerm
				});
			}
		}

		if (!prevProps.isSearchMode && this.props.isSearchMode) {
			this.searchInputRef.current?.focus();
		}

		if (prevProps.highlightedMediaItem && !this.props.highlightedMediaItem && this.state.menuAnchorRect) {
			this.setState({
				menuAnchorRect: undefined
			});
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			mediaItems,
			category,
			showEmptyState,
			showSkeletons,
			openFilters,
			selectMediaItem,
			highlightMediaItem,
			highlightedMediaItem,
			currentViewGroup,
			isSearchMode,
			editMediaItem,
			deleteMediaItem,
			markMediaItemAsActive,
			markMediaItemAsComplete,
			markMediaItemAsRedo,
			viewMediaItemGroup,
			closeMediaItemMenu,
			exitViewGroupMode
		} = this.props;
		const emptyMessage = i18n.t(`mediaItem.list.empty.${category.mediaType}`);
		const searchPlaceholder = i18n.t(`mediaItem.list.search.${category.mediaType}`);
		let listContent: ReactNode;

		if (showSkeletons) {
			listContent = this.renderSkeletons();
		}
		else if (showEmptyState) {
			listContent = this.renderNone(emptyMessage);
		}
		else {
			listContent = (
				<ul className='media-items-list-items'>
					{mediaItems.map((mediaItem) => {
						const highlighted = highlightedMediaItem?.id === mediaItem.id;

						return (
							<MediaItemRowComponent
								key={mediaItem.id}
								mediaItem={mediaItem}
								highlighted={highlighted}
								open={() => {
									selectMediaItem(mediaItem);
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
									highlightMediaItem(mediaItem);
								}}
							/>
						);
					})}
				</ul>
			);
		}

		return (
			<section className='media-items-list' aria-busy={showSkeletons}>
				<div className='media-items-list-header'>
					<form
						className='media-items-list-search media-items-list-search-inline'
						role='search'
						onSubmit={(event) => {
							event.preventDefault();
							this.submitSearchOrClose();
						}}>
						<InputComponent
							ref={this.searchInputRef}
							id='media-items-list-search'
							type='search'
							value={this.state.searchTerm}
							placeholder={searchPlaceholder}
							aria-label={searchPlaceholder}
							onChange={(event) => {
								this.setState({
									searchTerm: event.target.value
								});
							}}
						/>
						<PillButtonComponent
							type='submit'
							tone='secondary'
							size='compact'
							appearance='subtle'
							className='media-items-list-action'
							disabled={!isSearchMode && !this.state.searchTerm.trim()}>
							{i18n.t('mediaItem.list.buttons.search')}
						</PillButtonComponent>
					</form>
					<PillButtonComponent
						tone='secondary'
						size='compact'
						appearance='subtle'
						className='media-items-list-action'
						onClick={openFilters}>
						{i18n.t('mediaItem.list.filter.title')}
					</PillButtonComponent>
				</div>
				{currentViewGroup && (
					<div className='media-items-list-view-group-banner'>
						<div className='media-items-list-view-group-copy'>
							<span className='media-items-list-view-group-label'>{i18n.t('mediaItem.list.viewGroup')}</span>
							<strong className='media-items-list-view-group-name'>{currentViewGroup.name}</strong>
						</div>
						<PillButtonComponent
							tone='secondary'
							size='compact'
							appearance='subtle'
							onClick={exitViewGroupMode}>
							Back
						</PillButtonComponent>
					</div>
				)}
				{listContent}
				<MediaItemContextMenuComponent
					mediaItem={highlightedMediaItem}
					anchorRect={this.state.menuAnchorRect}
					currentViewGroupId={currentViewGroup?.id}
					edit={editMediaItem}
					delete={deleteMediaItem}
					markAsActive={markMediaItemAsActive}
					markAsComplete={markMediaItemAsComplete}
					markAsRedo={markMediaItemAsRedo}
					viewGroup={viewMediaItemGroup}
					close={() => {
						this.setState({
							menuAnchorRect: undefined
						});
						closeMediaItemMenu();
					}}
				/>
			</section>
		);
	}

	/**
	 * Helper method to render the empty-state card
	 * @param emptyMessage the media-type-specific empty title
	 * @returns the node portion
	 */
	private renderNone(emptyMessage: string): ReactElement {
		return (
			<div className='media-items-list-empty'>
				<p className='media-items-list-empty-title'>{emptyMessage}</p>
				<p className='media-items-list-empty-copy'>{i18n.t('mediaItem.list.emptyHint')}</p>
			</div>
		);
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
			<ul className='media-items-list-items media-items-list-skeleton-items' aria-hidden={true}>
				{loadingRows.map((loadingRow) => {
					return (
						<li key={loadingRow} className='media-item-row media-item-row-skeleton'>
							<div className='media-item-row-main'>
								<span className='media-item-row-platform'>
									<span className='media-item-row-platform-shell list-skeleton-block media-items-list-skeleton-platform' />
								</span>
								<span className='media-item-row-data'>
									<span className='list-skeleton-block media-items-list-skeleton-title' />
									<span className='list-skeleton-block media-items-list-skeleton-detail' />
									<span className='list-skeleton-block media-items-list-skeleton-detail media-items-list-skeleton-detail-short' />
								</span>
							</div>
							<div className='media-item-row-secondary'>
								<span className='media-item-row-status list-skeleton-block media-items-list-skeleton-status' />
								<span className='media-item-row-options list-skeleton-block media-items-list-skeleton-options' />
							</div>
						</li>
					);
				})}
			</ul>
		);
	}

	/**
	 * Submits the current search term if valid
	 */
	private submitSearchOrClose(): void {
		const searchTerm = this.state.searchTerm.trim();
		if (!searchTerm) {
			if (this.props.isSearchMode) {
				this.props.closeSearch();
			}
			return;
		}

		if (!this.props.isSearchMode) {
			this.props.openSearch();
		}

		this.props.submitSearch(searchTerm);
	}
}

/**
 * MediaItemsListComponent's input props
 */
export type MediaItemsListComponentInput = {
	/**
	 * The linked category
	 */
	category: CategoryInternal;

	/**
	 * The media items list to be displayed
	 */
	mediaItems: MediaItemInternal[];

	/**
	 * The currently highlighted media item, if any
	 */
	highlightedMediaItem: MediaItemInternal | undefined;

	/**
	 * The currently viewed group, if the list is filtered by group
	 */
	currentViewGroup?: GroupInternal;

	/**
	 * Flag to tell whether the list is currently in text-search mode
	 */
	isSearchMode: boolean;

	/**
	 * The current submitted search term, if any
	 */
	currentSearchTerm?: string;

	/**
	 * Whether the list should render the empty-state card
	 */
	showEmptyState: boolean;

	/**
	 * Whether the list should render loading skeletons
	 */
	showSkeletons: boolean;
};

/**
 * MediaItemsListComponent's output props
 */
export type MediaItemsListComponentOutput = {
	/**
	 * Callback to select a media item, e.g. to open its details
	 */
	selectMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to set a mediaItem as highlighted, e.g. to open its dialog menu
	 */
	highlightMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to edit a media item from the context menu
	 */
	editMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to delete a media item from the context menu
	 */
	deleteMediaItem: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to mark a media item as active from the context menu
	 */
	markMediaItemAsActive: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to mark a media item as complete from the context menu
	 */
	markMediaItemAsComplete: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to mark a media item as redo from the context menu
	 */
	markMediaItemAsRedo: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to view all media items in a group from the context menu
	 */
	viewMediaItemGroup: (group: GroupInternal) => void;

	/**
	 * Callback to close the media item context menu
	 */
	closeMediaItemMenu: () => void;

	/**
	 * Callback to open text-search mode
	 */
	openSearch: () => void;

	/**
	 * Callback to submit a text search
	 */
	submitSearch: (term: string) => void;

	/**
	 * Callback to close text-search mode
	 */
	closeSearch: () => void;

	/**
	 * Callback to open filter modal
	 */
	openFilters: () => void;

	/**
	 * Callback to exit the current view-group mode
	 */
	exitViewGroupMode: () => void;
};

type MediaItemsListComponentState = {
	searchTerm: string;
	menuAnchorRect: MediaItemContextMenuAnchorRect | undefined;
};
