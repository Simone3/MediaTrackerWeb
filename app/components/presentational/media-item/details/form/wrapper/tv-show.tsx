import { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { ObjectSchema } from 'yup';
import { tvShowFormValidationSchema } from 'app/components/presentational/media-item/details/form/data/tv-show';
import { MediaItemDetailsFormValues } from 'app/components/presentational/media-item/details/form/data/media-item';
import { TvShowFormViewComponent } from 'app/components/presentational/media-item/details/form/view/tv-show';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';

/**
 * Presentational component that handles the Formik wrapper component for the TV show form
 */
export class TvShowFormComponent extends Component<TvShowFormComponentProps> {
	private formikProps?: FormikProps<MediaItemDetailsFormValues>;
	private loadedSeasonsTimestamp?: Date;

	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.checkLoadSeasons();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {
		this.checkLoadSeasons();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const commonProps: CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput = {
			isLoading: this.props.isLoading,
			initialValues: this.props.initialValues,
			restoredDraft: this.props.restoredDraft,
			sameNameConfirmationRequested: this.props.sameNameConfirmationRequested,
			catalogSearchResults: this.props.catalogSearchResults,
			catalogDetails: this.props.catalogDetails,
			selectedGroup: this.props.selectedGroup,
			selectedOwnPlatform: this.props.selectedOwnPlatform,
			notifyFormStatus: this.props.notifyFormStatus,
			saveMediaItem: this.props.saveMediaItem,
			persistFormDraft: this.props.persistFormDraft,
			requestGroupSelection: this.props.requestGroupSelection,
			requestOwnPlatformSelection: this.props.requestOwnPlatformSelection,
			searchMediaItemsCatalog: this.props.searchMediaItemsCatalog,
			loadMediaItemCatalogDetails: this.props.loadMediaItemCatalogDetails,
			resetMediaItemsCatalogSearch: this.props.resetMediaItemsCatalogSearch
		};

		return (
			<CommonMediaItemFormComponent
				{...commonProps}
				validationSchema={tvShowFormValidationSchema as ObjectSchema<MediaItemDetailsFormValues>}>
				{(formikProps, requestCatalogReload) => {
					this.formikProps = formikProps;

					return (
						<TvShowFormViewComponent
							{...formikProps}
							catalogSearchResults={this.props.catalogSearchResults}
							notifyFormStatus={this.props.notifyFormStatus}
							persistFormDraft={this.props.persistFormDraft}
							handleTvShowSeasons={this.props.handleTvShowSeasons}
							requestGroupSelection={this.props.requestGroupSelection}
							requestOwnPlatformSelection={this.props.requestOwnPlatformSelection}
							searchMediaItemsCatalog={this.props.searchMediaItemsCatalog}
							loadMediaItemCatalogDetails={this.props.loadMediaItemCatalogDetails}
							resetMediaItemsCatalogSearch={this.props.resetMediaItemsCatalogSearch}
							requestCatalogReload={requestCatalogReload}
						/>
					);
				}}
			</CommonMediaItemFormComponent>
		);
	}

	/**
	 * Checks if we need to (re)load the list of seasons after it has been updated by the seasons flow
	 */
	private checkLoadSeasons(): void {
		const {
			loadSeasons,
			loadSeasonsTimestamp
		} = this.props;

		if(!this.formikProps || !loadSeasonsTimestamp || loadSeasonsTimestamp === this.loadedSeasonsTimestamp) {
			return;
		}

		this.loadedSeasonsTimestamp = loadSeasonsTimestamp;

		void this.formikProps.setValues({
			...this.formikProps.values,
			seasons: loadSeasons.length > 0 ? [ ...loadSeasons ] : undefined
		});
	}
}

/**
 * TvShowFormComponent's props
 */
export type TvShowFormComponentProps = CommonMediaItemFormComponentInputMain & CommonMediaItemFormComponentOutput & {
	/**
	 * List of seasons to be loaded into Formik
	 */
	loadSeasons: TvShowSeasonInternal[];

	/**
	 * Check field for `loadSeasons` to see if an update has been published after the previous reload
	 */
	loadSeasonsTimestamp: Date | undefined;

	/**
	 * Callback to open TV show seasons flow
	 */
	handleTvShowSeasons: (currentSeasons?: TvShowSeasonInternal[]) => void;
};
