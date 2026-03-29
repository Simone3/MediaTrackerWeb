import { Component, ReactNode } from 'react';
import { MediaItemFormSwitcherComponent } from 'app/components/presentational/media-item/details/form/switcher';
import { MediaItemDetailsFormValues, areMediaItemDetailsDifferent, mergeCatalogDetailsIntoMediaItem } from 'app/components/presentational/media-item/details/form/data/media-item';
import { MediaItemInternal, CatalogMediaItemInternal, SearchMediaItemCatalogResultInternal } from 'app/data/models/internal/media-items/media-item';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Presentational component that contains the whole "media item details" screen, that works as the "add new media item", "update media item" and
 * "view media item data" sections
 */
export class MediaItemDetailsScreenComponent extends Component<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput, MediaItemDetailsScreenComponentState> {
	public state: MediaItemDetailsScreenComponentState = {
		initialValues: this.buildFormValuesFromProps()
	};

	/**
	 * @override
	 */
	public componentDidMount(): void {
		document.body.classList.add('app-dark-screen-active');
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemDetailsScreenComponentInput & MediaItemDetailsScreenComponentOutput>): void {
		if(areMediaItemDetailsDifferent(prevProps.mediaItem, this.props.mediaItem)) {
			this.setState({
				initialValues: this.buildFormValuesFromProps()
			});
		}
	}

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<MediaItemFormSwitcherComponent
				isLoading={this.props.isLoading}
				initialValues={this.state.initialValues}
				baseMediaItem={this.props.mediaItem}
				sameNameConfirmationRequested={this.props.sameNameConfirmationRequested}
				tvShowSeasons={this.props.tvShowSeasons}
				tvShowSeasonsLoadTimestamp={this.props.tvShowSeasonsLoadTimestamp}
				catalogSearchResults={this.props.catalogSearchResults}
				catalogDetails={this.props.catalogDetails}
				selectedGroup={this.props.selectedGroup}
				selectedOwnPlatform={this.props.selectedOwnPlatform}
				saveMediaItem={this.props.saveMediaItem}
				notifyFormStatus={this.props.notifyFormStatus}
				persistFormDraft={this.props.persistFormDraft}
				handleTvShowSeasons={this.props.handleTvShowSeasons}
				requestGroupSelection={this.props.requestGroupSelection}
				requestOwnPlatformSelection={this.props.requestOwnPlatformSelection}
				searchMediaItemsCatalog={this.props.searchMediaItemsCatalog}
				loadMediaItemCatalogDetails={this.props.loadMediaItemCatalogDetails}
				resetMediaItemsCatalogSearch={this.props.resetMediaItemsCatalogSearch}
			/>
		);
	}

	/**
	 * Builds form values from Redux props, including staged selections and unsaved catalog data
	 * @returns initial form values
	 */
	private buildFormValuesFromProps(): MediaItemDetailsFormValues {
		const hasDraft = Boolean(this.props.draftMediaItem);
		const sourceMediaItem = (this.props.draftMediaItem || this.props.mediaItem) as MediaItemDetailsFormValues;
		let formValues: MediaItemDetailsFormValues = {
			...sourceMediaItem
		};

		if(!hasDraft && this.props.catalogDetails) {
			formValues = mergeCatalogDetailsIntoMediaItem(formValues, this.props.catalogDetails);
		}

		if(formValues.mediaType === 'TV_SHOW' && this.props.tvShowSeasonsLoadTimestamp) {
			formValues = {
				...formValues,
				seasons: this.props.tvShowSeasons.length > 0 ? [ ...this.props.tvShowSeasons ] : undefined
			};
		}

		return {
			...formValues,
			group: this.props.selectedGroup,
			ownPlatform: this.props.selectedOwnPlatform
		};
	}
}

/**
 * MediaItemDetailsScreenComponent's input props
 */
export type MediaItemDetailsScreenComponentInput = {
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Media item loaded from Redux state
	 */
	mediaItem: MediaItemInternal;

	/**
	 * Current unsaved form draft, if any
	 */
	draftMediaItem?: MediaItemInternal;

	/**
	 * If true, the user must confirm save with duplicated name
	 */
	sameNameConfirmationRequested: boolean;

	/**
	 * TV show seasons loaded from seasons flow
	 */
	tvShowSeasons: TvShowSeasonInternal[];

	/**
	 * Timestamp updated when seasons flow is completed
	 */
	tvShowSeasonsLoadTimestamp: Date | undefined;

	/**
	 * Current catalog search results
	 */
	catalogSearchResults?: SearchMediaItemCatalogResultInternal[];

	/**
	 * Current catalog details
	 */
	catalogDetails?: CatalogMediaItemInternal;

	/**
	 * Current selected group
	 */
	selectedGroup?: GroupInternal;

	/**
	 * Current selected own platform
	 */
	selectedOwnPlatform?: OwnPlatformInternal;
}

/**
 * MediaItemDetailsScreenComponent's output props
 */
export type MediaItemDetailsScreenComponentOutput = {
	/**
	 * Callback to save media item
	 */
	saveMediaItem: (mediaItem: MediaItemInternal, confirmSameName: boolean) => void;

	/**
	 * Callback to notify form validity and dirty status
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;

	/**
	 * Callback to persist the current unsaved form draft
	 */
	persistFormDraft: (mediaItem: MediaItemInternal) => void;

	/**
	 * Callback to discard the current unsaved form draft
	 */
	discardFormDraft: () => void;

	/**
	 * Callback to open TV show seasons flow
	 */
	handleTvShowSeasons: (currentSeasons?: TvShowSeasonInternal[]) => void;

	/**
	 * Callback to request group selection
	 */
	requestGroupSelection: () => void;

	/**
	 * Callback to request own platform selection
	 */
	requestOwnPlatformSelection: () => void;

	/**
	 * Callback to search media items catalog
	 */
	searchMediaItemsCatalog: (term: string) => void;

	/**
	 * Callback to load media item catalog details
	 */
	loadMediaItemCatalogDetails: (catalogId: string) => void;

	/**
	 * Callback to clear media items catalog search results
	 */
	resetMediaItemsCatalogSearch: () => void;
}

type MediaItemDetailsScreenComponentState = {
	initialValues: MediaItemDetailsFormValues;
}
