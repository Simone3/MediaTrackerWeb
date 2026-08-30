import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { SelectComponent } from 'app/components/presentational/generic/select';
import { MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES, MEDIA_ITEM_FILTER_FORM_SORT_VALUES, MEDIA_ITEM_FILTER_FORM_STATUS_VALUES, MediaItemFilterFormOption, MediaItemFilterFormValues } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all generic media item filter form input fields, all handled by the Formik container component
 * @param props the component props
 * @returns the component
 */
export const MediaItemFilterFormViewComponent = <TFormValues extends MediaItemFilterFormValues>(
	props: MediaItemFilterFormViewComponentProps<TFormValues>
): ReactElement => {
	return (
		<form className='media-item-filter-form' onSubmit={props.handleSubmit}>
			<div className='media-item-filter-field'>
				<label className='media-item-filter-label' htmlFor='media-item-filter-status'>
					{i18n.t('mediaItem.list.filter.prompts.status')}
				</label>
				<SelectComponent
					id='media-item-filter-status'
					name='status'
					value={props.values.status}
					onChange={props.handleChange}>
					{MEDIA_ITEM_FILTER_FORM_STATUS_VALUES.map((status) => {
						return (
							<option key={status} value={status}>
								{i18n.t(`mediaItem.list.filter.values.status.${status}`)}
							</option>
						);
					})}
				</SelectComponent>
			</div>

			<div className='media-item-filter-field'>
				<label className='media-item-filter-label' htmlFor='media-item-filter-importance'>
					{i18n.t('mediaItem.list.filter.prompts.importance')}
				</label>
				<SelectComponent
					id='media-item-filter-importance'
					name='importanceLevel'
					value={props.values.importanceLevel}
					onChange={props.handleChange}>
					{MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES.map((importance) => {
						return (
							<option key={importance} value={importance}>
								{importance === 'NONE' ?
									i18n.t('mediaItem.list.filter.values.importance.all') :
									i18n.t(`mediaItem.common.importance.${importance}`)}
							</option>
						);
					})}
				</SelectComponent>
			</div>

			<div className='media-item-filter-field'>
				<label className='media-item-filter-label' htmlFor='media-item-filter-group'>
					{i18n.t('mediaItem.list.filter.prompts.group')}
					{props.groupsLoading ? <span className='media-item-filter-inline-spinner' aria-hidden={true} /> : null}
				</label>
				<SelectComponent
					id='media-item-filter-group'
					name='group'
					value={props.values.group}
					onChange={props.handleChange}>
					{props.groupOptions.map((option) => {
						return (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						);
					})}
				</SelectComponent>
			</div>

			<div className='media-item-filter-field'>
				<label className='media-item-filter-label' htmlFor='media-item-filter-own-platform'>
					{i18n.t('mediaItem.list.filter.prompts.ownPlatform')}
					{props.ownPlatformsLoading ? <span className='media-item-filter-inline-spinner' aria-hidden={true} /> : null}
				</label>
				<SelectComponent
					id='media-item-filter-own-platform'
					name='ownPlatform'
					value={props.values.ownPlatform}
					onChange={props.handleChange}>
					{props.ownPlatformOptions.map((option) => {
						return (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						);
					})}
				</SelectComponent>
			</div>

			<div className='media-item-filter-field'>
				<label className='media-item-filter-label' htmlFor='media-item-filter-sort-by'>
					{i18n.t('mediaItem.list.filter.prompts.sort')}
				</label>
				<SelectComponent
					id='media-item-filter-sort-by'
					name='sortBy'
					value={props.values.sortBy}
					onChange={props.handleChange}>
					{MEDIA_ITEM_FILTER_FORM_SORT_VALUES.map((sortBy) => {
						return (
							<option key={sortBy} value={sortBy}>
								{i18n.t(`mediaItem.list.filter.values.sort.${sortBy}`)}
							</option>
						);
					})}
				</SelectComponent>
			</div>
			<div className='media-item-filter-actions'>
				<PillButtonComponent tone='secondary' size='compact' onClick={props.close}>
					{i18n.t('common.alert.default.cancelButton')}
				</PillButtonComponent>
				<PillButtonComponent type='submit' tone='primary' size='compact'>
					{i18n.t('common.alert.default.applyButton')}
				</PillButtonComponent>
			</div>
		</form>
	);
};

/**
 * MediaItemFilterFormViewComponent's input props
 */
export type MediaItemFilterFormViewComponentInput = {
	/**
	 * Callback when the form requests to be closed
	 */
	close: () => void;

	/**
	 * The options of the group filter input
	 */
	groupOptions: MediaItemFilterFormOption[];

	/**
	 * The options of the own platform filter input
	 */
	ownPlatformOptions: MediaItemFilterFormOption[];

	/**
	 * If the groups are being fetched: the input stays usable, it only says that more options are on their way
	 */
	groupsLoading: boolean;

	/**
	 * If the own platforms are being fetched: the input stays usable, it only says that more options are on their way
	 */
	ownPlatformsLoading: boolean;
};

/**
 * MediaItemFilterFormViewComponent's output props
 */
export type MediaItemFilterFormViewComponentOutput = {
};

/**
 * All props of MediaItemFilterFormViewComponent
 */
export type MediaItemFilterFormViewComponentProps<TFormValues extends MediaItemFilterFormValues = MediaItemFilterFormValues> = FormikProps<TFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
