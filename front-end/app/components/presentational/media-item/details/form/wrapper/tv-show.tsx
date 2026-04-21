import { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { CommonMediaItemFormComponent, CommonMediaItemFormComponentInputMain, CommonMediaItemFormComponentOutput } from './media-item';
import { tvShowFormValidationSchema, normalizeTvShowFormValues, preserveTvShowSeasonProgress } from 'app/components/presentational/media-item/details/form/data/tv-show';
import { TvShowFormViewComponent } from 'app/components/presentational/media-item/details/form/view/tv-show';
import { DEFAULT_CATALOG_TV_SHOW, TvShowInternal, TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Presentational component that handles the Formik wrapper component for the TV show form
 */
export class TvShowFormComponent extends Component<TvShowFormComponentProps> {
	private formikProps?: FormikProps<TvShowInternal>;
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
		return (
			<CommonMediaItemFormComponent<TvShowInternal>
				{...this.props}
				defaultCatalogItem={DEFAULT_CATALOG_TV_SHOW}
				normalizeFormValues={normalizeTvShowFormValues}
				onLoadCatalogDetails={preserveTvShowSeasonProgress}
				validationSchema={tvShowFormValidationSchema}>
				{(formikProps, requestCatalogReload) => {
					this.formikProps = formikProps;

					return (
						<TvShowFormViewComponent
							{...formikProps}
							catalogSearchResults={this.props.catalogSearchResults}
							notifyFormStatus={this.props.notifyFormStatus}
							persistFormDraft={this.props.persistFormDraft}
							requestGroupSelection={this.props.requestGroupSelection}
							requestOwnPlatformSelection={this.props.requestOwnPlatformSelection}
							searchMediaItemsCatalog={this.props.searchMediaItemsCatalog}
							loadMediaItemCatalogDetails={this.props.loadMediaItemCatalogDetails}
							resetMediaItemsCatalogSearch={this.props.resetMediaItemsCatalogSearch}
							requestCatalogReload={requestCatalogReload}
							handleTvShowSeasons={this.props.handleTvShowSeasons}
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
			loadSeasonsTimestamp,
			restoredDraft
		} = this.props;

		if(!this.formikProps || !loadSeasonsTimestamp || loadSeasonsTimestamp === this.loadedSeasonsTimestamp) {
			return;
		}

		this.loadedSeasonsTimestamp = loadSeasonsTimestamp;

		// On remount after the seasons flow, Formik may still expose the saved media item while the common wrapper is restoring the unsaved draft.
		const currentValues = restoredDraft || this.formikProps.values;

		void this.formikProps.setValues({
			...currentValues,
			seasons: loadSeasons.length > 0 ? [ ...loadSeasons ] : undefined
		});
	}
}

/**
 * TvShowFormComponent's props
 */
export type TvShowFormComponentProps = CommonMediaItemFormComponentInputMain<TvShowInternal> & CommonMediaItemFormComponentOutput & {
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
