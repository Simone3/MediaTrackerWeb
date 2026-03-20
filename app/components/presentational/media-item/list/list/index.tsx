import React, { Component, ReactNode } from 'react';
import { MediaItemContextMenuComponent } from 'app/components/presentational/media-item/list/context-menu';
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
		searchTerm: this.props.currentSearchTerm || ''
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemsListComponentInput & MediaItemsListComponentOutput>): void {
		if(
			prevProps.category.id !== this.props.category.id ||
			prevProps.isSearchMode !== this.props.isSearchMode ||
			prevProps.currentSearchTerm !== this.props.currentSearchTerm
		) {
			const nextSearchTerm = this.props.currentSearchTerm || '';
			if(nextSearchTerm !== this.state.searchTerm) {
				this.setState({
					searchTerm: nextSearchTerm
				});
			}
		}

		if(!prevProps.isSearchMode && this.props.isSearchMode) {
			this.searchInputRef.current?.focus();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			mediaItems,
			category,
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

		return (
			<section className='media-items-list'>
				<div className='media-items-list-header'>
					<h2 className='media-items-list-title'>{i18n.t(`category.mediaTypes.${category.mediaType}`)}</h2>
					<div className='media-items-list-actions'>
						{!isSearchMode && (
							<button
								type='button'
								className='media-items-list-action'
								onClick={() => {
									this.props.openSearch();
								}}>
								{i18n.t('mediaItem.list.buttons.search')}
							</button>
						)}
						{!isSearchMode && (
							<button type='button' className='media-items-list-action' onClick={openFilters}>
								Filter
							</button>
						)}
					</div>
				</div>
				{isSearchMode && (
					<form
						className='media-items-list-search'
						role='search'
						onSubmit={(event) => {
							event.preventDefault();
							this.submitSearch();
						}}>
						<input
							ref={this.searchInputRef}
							id='media-items-list-search'
							className='media-items-list-search-input'
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
						<button
							type='submit'
							className='media-items-list-action'
							disabled={!this.state.searchTerm.trim()}>
							{i18n.t('mediaItem.list.buttons.search')}
						</button>
						<button
							type='button'
							className='media-items-list-search-cancel'
							onClick={() => {
								this.props.closeSearch();
							}}>
							{i18n.t('common.alert.default.cancelButton')}
						</button>
					</form>
				)}
				{currentViewGroup && (
					<div className='media-items-list-view-group-banner'>
						<div className='media-items-list-view-group-copy'>
							<span className='media-items-list-view-group-label'>{i18n.t('mediaItem.list.viewGroup')}</span>
							<strong className='media-items-list-view-group-name'>{currentViewGroup.name}</strong>
						</div>
						<button type='button' className='media-items-list-view-group-exit' onClick={exitViewGroupMode}>
							Back
						</button>
					</div>
				)}
				{mediaItems.length === 0 && (
					<p className='media-items-list-empty'>{emptyMessage}</p>
				)}
				{mediaItems.length > 0 && (
					<ul className='media-items-list-items'>
						{mediaItems.map((mediaItem) => {
							return (
								<MediaItemRowComponent
									key={mediaItem.id}
									mediaItem={mediaItem}
									open={() => {
										selectMediaItem(mediaItem);
									}}
									showOptionsMenu={() => {
										highlightMediaItem(mediaItem);
									}}
								/>
							);
						})}
					</ul>
				)}
				<MediaItemContextMenuComponent
					mediaItem={highlightedMediaItem}
					currentViewGroupId={currentViewGroup?.id}
					edit={editMediaItem}
					delete={deleteMediaItem}
					markAsActive={markMediaItemAsActive}
					markAsComplete={markMediaItemAsComplete}
					markAsRedo={markMediaItemAsRedo}
					viewGroup={viewMediaItemGroup}
					close={closeMediaItemMenu}
				/>
			</section>
		);
	}

	/**
	 * Submits the current search term if valid
	 */
	private submitSearch(): void {
		const searchTerm = this.state.searchTerm.trim();
		if(!searchTerm) {
			return;
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
}

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
}

type MediaItemsListComponentState = {
	searchTerm: string;
}
