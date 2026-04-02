import { ReactElement } from 'react';
import { FormikProps } from 'formik';
import {
	MEDIA_ITEM_FILTER_FORM_GROUP_VALUES,
	MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES,
	MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES,
	MEDIA_ITEM_FILTER_FORM_SORT_VALUES,
	MEDIA_ITEM_FILTER_FORM_STATUS_VALUES,
	MediaItemFilterFormValues
} from 'app/components/presentational/media-item/list/filter-form/data/media-item';
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
				<select
					id='media-item-filter-status'
					name='status'
					className='media-item-filter-select'
					value={props.values.status}
					onChange={props.handleChange}>
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
					value={props.values.group}
					onChange={props.handleChange}>
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
					value={props.values.ownPlatform}
					onChange={props.handleChange}>
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
					value={props.values.sortBy}
					onChange={props.handleChange}>
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
				<button type='button' className='media-item-filter-button media-item-filter-button-secondary' onClick={props.close}>
					{i18n.t('common.alert.default.cancelButton')}
				</button>
				<button type='submit' className='media-item-filter-button media-item-filter-button-primary'>
					{i18n.t('common.alert.default.applyButton')}
				</button>
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
}

/**
 * MediaItemFilterFormViewComponent's output props
 */
export type MediaItemFilterFormViewComponentOutput = {
}

/**
 * All props of MediaItemFilterFormViewComponent
 */
export type MediaItemFilterFormViewComponentProps<TFormValues extends MediaItemFilterFormValues = MediaItemFilterFormValues> = FormikProps<TFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
