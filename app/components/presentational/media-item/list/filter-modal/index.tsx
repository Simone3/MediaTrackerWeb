import { Component, ReactNode } from 'react';
import { Formik, FormikProps } from 'formik';
import { ObjectSchema } from 'yup';
import { CategoryInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { BookSortByInternal } from 'app/data/models/internal/media-items/book';
import { MovieSortByInternal } from 'app/data/models/internal/media-items/movie';
import { TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';
import { VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { i18n } from 'app/utilities/i18n';
import {
	MEDIA_ITEM_FILTER_FORM_GROUP_VALUES,
	MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES,
	MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES,
	MEDIA_ITEM_FILTER_FORM_SORT_VALUES,
	MEDIA_ITEM_FILTER_FORM_STATUS_VALUES,
	MediaItemFilterFormValues
} from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { BookFilterFormValues, bookFilterFormMapper, bookFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/book';
import { MovieFilterFormValues, movieFilterFormMapper, movieFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/movie';
import { TvShowFilterFormValues, tvShowFilterFormMapper, tvShowFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/tv-show';
import { VideogameFilterFormValues, videogameFilterFormMapper, videogameFilterFormValidationSchema } from 'app/components/presentational/media-item/list/filter-form/data/videogame';

type MediaItemFilterFormDefinition = {
	initialValues: MediaItemFilterFormValues;
	validationSchema: ObjectSchema<MediaItemFilterFormValues>;
	onSubmit: (values: MediaItemFilterFormValues) => void;
}

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

		const formDefinition = this.buildFormDefinition();

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
					<Formik<MediaItemFilterFormValues>
						initialValues={formDefinition.initialValues}
						initialErrors={{}}
						validationSchema={formDefinition.validationSchema}
						validateOnMount={true}
						enableReinitialize={true}
						onSubmit={formDefinition.onSubmit}>
						{(formikProps: FormikProps<MediaItemFilterFormValues>) => {
							return this.renderForm(formikProps);
						}}
					</Formik>
				</section>
			</div>
		);
	}

	/**
	 * Builds the correct Formik setup for the selected media type
	 * @returns the Formik setup
	 */
	private buildFormDefinition(): MediaItemFilterFormDefinition {
		const {
			category,
			initialFilter,
			initialSortBy,
			submitFilter
		} = this.props;

		switch(category.mediaType) {
			case 'BOOK': {
				return {
					initialValues: bookFilterFormMapper.toFormValues(initialFilter, initialSortBy as BookSortByInternal[]),
					validationSchema: bookFilterFormValidationSchema,
					onSubmit: (values: BookFilterFormValues) => {
						submitFilter(bookFilterFormMapper.toFilterModel(values), bookFilterFormMapper.toSortByModel(values));
					}
				};
			}

			case 'MOVIE': {
				return {
					initialValues: movieFilterFormMapper.toFormValues(initialFilter, initialSortBy as MovieSortByInternal[]),
					validationSchema: movieFilterFormValidationSchema,
					onSubmit: (values: MovieFilterFormValues) => {
						submitFilter(movieFilterFormMapper.toFilterModel(values), movieFilterFormMapper.toSortByModel(values));
					}
				};
			}

			case 'TV_SHOW': {
				return {
					initialValues: tvShowFilterFormMapper.toFormValues(initialFilter, initialSortBy as TvShowSortByInternal[]),
					validationSchema: tvShowFilterFormValidationSchema,
					onSubmit: (values: TvShowFilterFormValues) => {
						submitFilter(tvShowFilterFormMapper.toFilterModel(values), tvShowFilterFormMapper.toSortByModel(values));
					}
				};
			}

			case 'VIDEOGAME': {
				return {
					initialValues: videogameFilterFormMapper.toFormValues(initialFilter, initialSortBy as VideogameSortByInternal[]),
					validationSchema: videogameFilterFormValidationSchema,
					onSubmit: (values: VideogameFilterFormValues) => {
						submitFilter(videogameFilterFormMapper.toFilterModel(values), videogameFilterFormMapper.toSortByModel(values));
					}
				};
			}

			default:
				throw AppError.GENERIC.withDetails('Cannot build media item filter form for media type');
		}
	}

	/**
	 * Renders the Formik-backed filter form
	 * @param formikProps the current Formik state
	 * @returns the filter form
	 */
	private renderForm(formikProps: FormikProps<MediaItemFilterFormValues>): ReactNode {
		return (
			<form className='media-item-filter-form' onSubmit={formikProps.handleSubmit}>
				<div className='media-item-filter-field'>
					<label className='media-item-filter-label' htmlFor='media-item-filter-status'>
						{i18n.t('mediaItem.list.filter.prompts.status')}
					</label>
					<select
						id='media-item-filter-status'
						name='status'
						className='media-item-filter-select'
						value={formikProps.values.status}
						onChange={formikProps.handleChange}>
						{MEDIA_ITEM_FILTER_FORM_STATUS_VALUES.map((status) => {
							return (
								<option key={status} value={status}>
									{i18n.t(`mediaItem.list.filter.values.status.${status}`)}
								</option>
							);
						})}
					</select>
				</div>

				<div className='media-item-filter-field'>
					<label className='media-item-filter-label' htmlFor='media-item-filter-importance'>
						{i18n.t('mediaItem.list.filter.prompts.importance')}
					</label>
					<select
						id='media-item-filter-importance'
						name='importanceLevel'
						className='media-item-filter-select'
						value={formikProps.values.importanceLevel}
						onChange={formikProps.handleChange}>
						{MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES.map((importance) => {
							return (
								<option key={importance} value={importance}>
									{importance === 'NONE' ?
										i18n.t('mediaItem.list.filter.values.importance.all') :
										i18n.t(`mediaItem.common.importance.${importance}`)}
								</option>
							);
						})}
					</select>
				</div>

				<div className='media-item-filter-field'>
					<label className='media-item-filter-label' htmlFor='media-item-filter-group'>
						{i18n.t('mediaItem.list.filter.prompts.group')}
					</label>
					<select
						id='media-item-filter-group'
						name='group'
						className='media-item-filter-select'
						value={formikProps.values.group}
						onChange={formikProps.handleChange}>
						{MEDIA_ITEM_FILTER_FORM_GROUP_VALUES.map((group) => {
							return (
								<option key={group} value={group}>
									{i18n.t(`mediaItem.list.filter.values.group.${group}`)}
								</option>
							);
						})}
					</select>
				</div>

				<div className='media-item-filter-field'>
					<label className='media-item-filter-label' htmlFor='media-item-filter-own-platform'>
						{i18n.t('mediaItem.list.filter.prompts.ownPlatform')}
					</label>
					<select
						id='media-item-filter-own-platform'
						name='ownPlatform'
						className='media-item-filter-select'
						value={formikProps.values.ownPlatform}
						onChange={formikProps.handleChange}>
						{MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES.map((ownPlatform) => {
							return (
								<option key={ownPlatform} value={ownPlatform}>
									{i18n.t(`mediaItem.list.filter.values.ownPlatform.${ownPlatform}`)}
								</option>
							);
						})}
					</select>
				</div>

				<div className='media-item-filter-field'>
					<label className='media-item-filter-label' htmlFor='media-item-filter-sort-by'>
						{i18n.t('mediaItem.list.filter.prompts.sort')}
					</label>
					<select
						id='media-item-filter-sort-by'
						name='sortBy'
						className='media-item-filter-select'
						value={formikProps.values.sortBy}
						onChange={formikProps.handleChange}>
						{MEDIA_ITEM_FILTER_FORM_SORT_VALUES.map((sortBy) => {
							return (
								<option key={sortBy} value={sortBy}>
									{i18n.t(`mediaItem.list.filter.values.sort.${sortBy}`)}
								</option>
							);
						})}
					</select>
				</div>
				<div className='media-item-filter-actions'>
					<button type='button' className='media-item-filter-button media-item-filter-button-secondary' onClick={this.props.close}>
						{i18n.t('common.alert.default.cancelButton')}
					</button>
					<button type='submit' className='media-item-filter-button media-item-filter-button-primary'>
						{i18n.t('common.alert.default.applyButton')}
					</button>
				</div>
			</form>
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
}

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
}

/**
 * MediaItemFilterModalComponent's props
 */
export type MediaItemFilterModalComponentProps = MediaItemFilterModalComponentInput & MediaItemFilterModalComponentOutput;
