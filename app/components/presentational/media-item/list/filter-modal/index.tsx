import React, { Component, ReactNode } from 'react';
import { CategoryInternal } from 'app/data/models/internal/category';
import { MediaItemFilterInternal, MediaItemSortByInternal } from 'app/data/models/internal/media-items/media-item';
import { i18n } from 'app/utilities/i18n';
import {
	MEDIA_ITEM_FILTER_FORM_GROUP_VALUES,
	MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES,
	MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES,
	MEDIA_ITEM_FILTER_FORM_SORT_VALUES,
	MEDIA_ITEM_FILTER_FORM_STATUS_VALUES,
	MediaItemFilterFormValues
} from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { AppError } from 'app/data/models/internal/error';

type MediaItemFilterKnownSortField = 'ACTIVE' | 'IMPORTANCE' | 'RELEASE_DATE' | 'COMPLETION_DATE' | 'NAME';
type MediaItemFilterKnownSortBy = MediaItemSortByInternal & {
	field: MediaItemFilterKnownSortField;
}

const DEFAULT_MEDIA_ITEM_SORT_BY: MediaItemFilterKnownSortBy[] = [{
	field: 'ACTIVE',
	ascending: false
}, {
	field: 'IMPORTANCE',
	ascending: false
}, {
	field: 'RELEASE_DATE',
	ascending: true
}];

/**
 * Presentational component to display a modal dialog with the media item filter options
 */
export class MediaItemFilterModalComponent extends Component<MediaItemFilterModalComponentProps, MediaItemFilterModalComponentState> {
	public state: MediaItemFilterModalComponentState = {
		formValues: this.buildFormValuesFromProps(this.props)
	};

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<MediaItemFilterModalComponentProps>): void {
		const openedNow = !prevProps.visible && this.props.visible;
		const categoryChanged = prevProps.category.mediaType !== this.props.category.mediaType;
		const filterChanged = prevProps.initialFilter !== this.props.initialFilter;
		const sortChanged = prevProps.initialSortBy !== this.props.initialSortBy;

		if(openedNow || categoryChanged || filterChanged || sortChanged) {
			this.syncFormValuesFromProps();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		if(!this.props.visible) {
			return null;
		}

		const {
			formValues
		} = this.state;

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
					<div className='media-item-filter-form'>
						<label className='media-item-filter-label' htmlFor='media-item-filter-status'>
							{i18n.t('mediaItem.list.filter.prompts.status')}
						</label>
						<select
							id='media-item-filter-status'
							className='media-item-filter-select'
							value={formValues.status}
							onChange={(event) => {
								this.setFormField('status', event.target.value as MediaItemFilterFormValues['status']);
							}}>
							{MEDIA_ITEM_FILTER_FORM_STATUS_VALUES.map((status) => {
								return (
									<option key={status} value={status}>
										{i18n.t(`mediaItem.list.filter.values.status.${status}`)}
									</option>
								);
							})}
						</select>

						<label className='media-item-filter-label' htmlFor='media-item-filter-importance'>
							{i18n.t('mediaItem.list.filter.prompts.importance')}
						</label>
						<select
							id='media-item-filter-importance'
							className='media-item-filter-select'
							value={formValues.importanceLevel}
							onChange={(event) => {
								this.setFormField('importanceLevel', event.target.value as MediaItemFilterFormValues['importanceLevel']);
							}}>
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

						<label className='media-item-filter-label' htmlFor='media-item-filter-group'>
							{i18n.t('mediaItem.list.filter.prompts.group')}
						</label>
						<select
							id='media-item-filter-group'
							className='media-item-filter-select'
							value={formValues.group}
							onChange={(event) => {
								this.setFormField('group', event.target.value as MediaItemFilterFormValues['group']);
							}}>
							{MEDIA_ITEM_FILTER_FORM_GROUP_VALUES.map((group) => {
								return (
									<option key={group} value={group}>
										{i18n.t(`mediaItem.list.filter.values.group.${group}`)}
									</option>
								);
							})}
						</select>

						<label className='media-item-filter-label' htmlFor='media-item-filter-own-platform'>
							{i18n.t('mediaItem.list.filter.prompts.ownPlatform')}
						</label>
						<select
							id='media-item-filter-own-platform'
							className='media-item-filter-select'
							value={formValues.ownPlatform}
							onChange={(event) => {
								this.setFormField('ownPlatform', event.target.value as MediaItemFilterFormValues['ownPlatform']);
							}}>
							{MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES.map((ownPlatform) => {
								return (
									<option key={ownPlatform} value={ownPlatform}>
										{i18n.t(`mediaItem.list.filter.values.ownPlatform.${ownPlatform}`)}
									</option>
								);
							})}
						</select>

						<label className='media-item-filter-label' htmlFor='media-item-filter-sort-by'>
							{i18n.t('mediaItem.list.filter.prompts.sort')}
						</label>
						<select
							id='media-item-filter-sort-by'
							className='media-item-filter-select'
							value={formValues.sortBy}
							onChange={(event) => {
								this.setFormField('sortBy', event.target.value as MediaItemFilterFormValues['sortBy']);
							}}>
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
						<button
							type='button'
							className='media-item-filter-button media-item-filter-button-primary'
							onClick={() => {
								this.submitCurrentFilter();
							}}>
							{i18n.t('common.alert.default.applyButton')}
						</button>
					</div>
				</section>
			</div>
		);
	}

	/**
	 * Syncs local form values from current input props
	 */
	private syncFormValuesFromProps(): void {
		this.setState({
			formValues: this.buildFormValuesFromProps(this.props)
		});
	}

	/**
	 * Builds form values from props
	 * @param props component props
	 * @returns form values
	 */
	private buildFormValuesFromProps(props: MediaItemFilterModalComponentProps): MediaItemFilterFormValues {
		return {
			importanceLevel: this.toImportanceFormValue(props.initialFilter.importanceLevels),
			group: this.toGroupFormValue(props.initialFilter.groups),
			ownPlatform: this.toOwnPlatformFormValue(props.initialFilter.ownPlatforms),
			status: this.toStatusFormValue(props.initialFilter.status),
			sortBy: this.toSortByFormValue(props.initialSortBy)
		};
	}

	/**
	 * Handles a single form field update
	 * @param key field key
	 * @param value field value
	 */
	private setFormField<K extends keyof MediaItemFilterFormValues>(key: K, value: MediaItemFilterFormValues[K]): void {
		this.setState((prevState) => {
			return {
				formValues: {
					...prevState.formValues,
					[key]: value
				}
			};
		});
	}

	/**
	 * Submits the current form values to parent callback
	 */
	private submitCurrentFilter(): void {
		const filter = this.toFilterModel(this.state.formValues);
		const sortBy = this.toSortByModel(this.state.formValues);
		this.props.submitFilter(filter, sortBy);
	}

	/**
	 * Maps form values to the internal filter model
	 * @param formValues form values
	 * @returns filter model
	 */
	private toFilterModel(formValues: MediaItemFilterFormValues): MediaItemFilterInternal {
		return {
			importanceLevels: this.toImportanceModel(formValues.importanceLevel),
			groups: this.toGroupModel(formValues.group),
			ownPlatforms: this.toOwnPlatformModel(formValues.ownPlatform),
			status: this.toStatusModel(formValues.status)
		};
	}

	/**
	 * Maps form values to the internal sort model
	 * @param formValues form values
	 * @returns sort model
	 */
	private toSortByModel(formValues: MediaItemFilterFormValues): MediaItemFilterKnownSortBy[] {
		switch(formValues.sortBy) {
			case 'DEFAULT':
				return DEFAULT_MEDIA_ITEM_SORT_BY.map((sortBy) => {
					return {
						field: sortBy.field,
						ascending: sortBy.ascending
					};
				});

			case 'COMPLETION_DATE':
				return [{
					field: 'COMPLETION_DATE',
					ascending: false
				}];

			case 'NAME':
				return [{
					field: 'NAME',
					ascending: true
				}];

			default:
				throw AppError.GENERIC.withDetails(`Cannot map sort form value ${formValues.sortBy}`);
		}
	}

	/**
	 * Maps the internal status filter to the form model
	 * @param source status filter
	 * @returns form status value
	 */
	private toStatusFormValue(source: MediaItemFilterInternal['status']): MediaItemFilterFormValues['status'] {
		if(source === 'COMPLETE') {
			return 'COMPLETE';
		}
		if(source === 'CURRENT') {
			return 'CURRENT';
		}
		return 'ALL';
	}

	/**
	 * Maps the internal importance filter to the form model
	 * @param source importance filter
	 * @returns form importance value
	 */
	private toImportanceFormValue(source: MediaItemFilterInternal['importanceLevels']): MediaItemFilterFormValues['importanceLevel'] {
		return source && source.length > 0 ? source[0] : 'NONE';
	}

	/**
	 * Maps the internal group filter to the form model
	 * @param source group filter
	 * @returns form group value
	 */
	private toGroupFormValue(source: MediaItemFilterInternal['groups']): MediaItemFilterFormValues['group'] {
		if(source) {
			if(source.anyGroup) {
				return 'ANY';
			}
			if(source.noGroup) {
				return 'NONE';
			}
		}
		return 'ALL';
	}

	/**
	 * Maps the internal own platform filter to the form model
	 * @param source own platform filter
	 * @returns form own platform value
	 */
	private toOwnPlatformFormValue(source: MediaItemFilterInternal['ownPlatforms']): MediaItemFilterFormValues['ownPlatform'] {
		if(source) {
			if(source.anyOwnPlatform) {
				return 'ANY';
			}
			if(source.noOwnPlatform) {
				return 'NONE';
			}
		}
		return 'ALL';
	}

	/**
	 * Maps the internal sort model to the form model
	 * @param sortBy sort model
	 * @returns form sort value
	 */
	private toSortByFormValue(sortBy: MediaItemSortByInternal[]): MediaItemFilterFormValues['sortBy'] {
		const typedSortBy = sortBy as MediaItemFilterKnownSortBy[];
		if(typedSortBy.length === 1) {
			if(typedSortBy[0].field === 'NAME') {
				return 'NAME';
			}
			if(typedSortBy[0].field === 'COMPLETION_DATE') {
				return 'COMPLETION_DATE';
			}
		}
		return 'DEFAULT';
	}

	/**
	 * Maps the form status value to internal model
	 * @param source form status value
	 * @returns internal status filter
	 */
	private toStatusModel(source: MediaItemFilterFormValues['status']): MediaItemFilterInternal['status'] {
		switch(source) {
			case 'ALL':
				return undefined;
			case 'COMPLETE':
				return 'COMPLETE';
			case 'CURRENT':
				return 'CURRENT';
			default:
				throw AppError.GENERIC.withDetails(`Cannot map status filter ${source}`);
		}
	}

	/**
	 * Maps the form importance value to internal model
	 * @param source form importance value
	 * @returns internal importance filter
	 */
	private toImportanceModel(source: MediaItemFilterFormValues['importanceLevel']): MediaItemFilterInternal['importanceLevels'] {
		return source === 'NONE' ? undefined : [ source ];
	}

	/**
	 * Maps the form group value to internal model
	 * @param source form group value
	 * @returns internal group filter
	 */
	private toGroupModel(source: MediaItemFilterFormValues['group']): MediaItemFilterInternal['groups'] {
		switch(source) {
			case 'ALL':
				return undefined;
			case 'ANY':
				return {
					anyGroup: true
				};
			case 'NONE':
				return {
					noGroup: true
				};
			default:
				throw AppError.GENERIC.withDetails(`Cannot map group filter ${source}`);
		}
	}

	/**
	 * Maps the form own platform value to internal model
	 * @param source form own platform value
	 * @returns internal own platform filter
	 */
	private toOwnPlatformModel(source: MediaItemFilterFormValues['ownPlatform']): MediaItemFilterInternal['ownPlatforms'] {
		switch(source) {
			case 'ALL':
				return undefined;
			case 'ANY':
				return {
					anyOwnPlatform: true
				};
			case 'NONE':
				return {
					noOwnPlatform: true
				};
			default:
				throw AppError.GENERIC.withDetails(`Cannot map own platform filter ${source}`);
		}
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

type MediaItemFilterModalComponentState = {
	formValues: MediaItemFilterFormValues;
}
