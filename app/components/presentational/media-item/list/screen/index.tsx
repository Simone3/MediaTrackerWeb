import React, { Component, CSSProperties, ReactNode } from 'react';
import { CATEGORIES_MOBILE_BREAKPOINT } from 'app/components/presentational/category/list/constants';
import { MediaItemsListContainer } from 'app/components/containers/media-item/list/list';
import { MediaItemFilterModalContainer } from 'app/components/containers/media-item/list/filter-modal';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole "media items list" screen, that lists all media items of the current category
 */
export class MediaItemsListScreenComponent extends Component<MediaItemsListScreenComponentInput & MediaItemsListScreenComponentOutput, MediaItemsListScreenComponentState> {
	public state: MediaItemsListScreenComponentState = {
		isMobileLayout: this.isMobileLayout()
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		document.body.classList.add('app-dark-screen-active');
		window.addEventListener('resize', this.handleResize);
		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {
		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
		window.removeEventListener('resize', this.handleResize);
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			category,
			loadNewMediaItemDetails,
			isLoading,
			mediaItemsCount
		} = this.props;
		const countLabel = mediaItemsCount === 1 ?
			i18n.t('mediaItem.list.count.single') :
			i18n.t('mediaItem.list.count.multiple', { count: mediaItemsCount });

		return (
			<section
				className='media-items-screen'
				style={{ '--media-items-category-color': category.color } as CSSProperties}>
				<div className='media-items-screen-content'>
					<header className='media-items-screen-header'>
						<div className='media-items-screen-heading'>
							<span className='media-items-screen-badge'>{i18n.t(`category.mediaTypes.${category.mediaType}`)}</span>
							<h1 className='media-items-screen-title'>{category.name}</h1>
							<p className='media-items-screen-count'>{countLabel}</p>
						</div>
						{!this.state.isMobileLayout &&
							<button
								type='button'
								className='media-items-screen-add-button'
								onClick={() => {
									loadNewMediaItemDetails(category);
								}}>
								+ {i18n.t(`mediaItem.list.add.${category.mediaType}`)}
							</button>}
					</header>
					<MediaItemsListContainer/>
				</div>
				<MediaItemFilterModalContainer/>
				{this.state.isMobileLayout &&
					<FABComponent
						text='+'
						onPress={() => {
							loadNewMediaItemDetails(category);
						}}
					/>}
				<LoadingIndicatorComponent
					visible={isLoading}
					fullScreen={false}
				/>
			</section>
		);
	}

	/**
	 * Helper to invoke the fetch callback if the input fetch flag is true
	 */
	private requestFetchIfRequired(): void {
		if(this.props.requiresFetch) {
			this.props.fetchMediaItems();
		}
	}

	/**
	 * Updates the responsive layout flag when the viewport changes
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
	 * Checks whether the current viewport matches the mobile layout
	 * @returns true if mobile layout should be used
	 */
	private isMobileLayout(): boolean {
		return window.innerWidth <= CATEGORIES_MOBILE_BREAKPOINT;
	}
}

/**
 * MediaItemsListScreenComponent's input props
 */
export type MediaItemsListScreenComponentInput = {
	/**
	 * The category linked with this media items list
	 */
	category: CategoryInternal;

	/**
	 * Number of media items currently shown in the list
	 */
	mediaItemsCount: number;

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the categories list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;
}

/**
 * MediaItemsListScreenComponent's output props
 */
export type MediaItemsListScreenComponentOutput = {
	/**
	 * Callback to request the media items list (re)load
	 */
	fetchMediaItems: () => void;

	/**
	 * Callback to load the details of a new media item for the given category
	 */
	loadNewMediaItemDetails: (category: CategoryInternal) => void;
}

type MediaItemsListScreenComponentState = {
	isMobileLayout: boolean;
}
