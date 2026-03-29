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

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<TvShowFormComponentProps>): void {
		if(!this.formikProps || prevProps.loadSeasonsTimestamp === this.props.loadSeasonsTimestamp || !this.props.loadSeasonsTimestamp) {
			return;
		}

		void this.formikProps.setValues({
			...this.formikProps.values,
			seasons: this.props.loadSeasons.length > 0 ? [ ...this.props.loadSeasons ] : undefined
		});
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<CommonMediaItemFormComponent
				{...this.props}
				validationSchema={tvShowFormValidationSchema as ObjectSchema<MediaItemDetailsFormValues>}>
				{(formikProps, requestCatalogReload) => {
					this.formikProps = formikProps;

					return (
						<TvShowFormViewComponent
							{...formikProps}
							baseMediaItem={this.props.baseMediaItem}
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
};
