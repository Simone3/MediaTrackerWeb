import React, { Component, ReactNode } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FormikProps } from 'formik';
import { styles } from 'app/components/presentational/media-item/list/filter-form/view/styles';
import { i18n } from 'app/utilities/i18n';
import { PickerFieldComponent } from 'app/components/presentational/form/fields/picker';
import { PickerComponentItem } from 'app/components/presentational/form/components/picker/common';
import { MEDIA_ITEM_FILTER_FORM_GROUP_VALUES, MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES, MEDIA_ITEM_FILTER_FORM_SORT_VALUES, MEDIA_ITEM_FILTER_FORM_STATUS_VALUES, MediaItemFilterFormValues, MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES } from 'app/components/presentational/media-item/list/filter-form/data/media-item';
import { images } from 'app/utilities/images';

/**
 * Presentational component that contains all generic media item filter form input fields, all handled by the Formik container component
 */
export class MediaItemFilterFormViewComponent extends Component<MediaItemFilterFormViewComponentProps> {

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<View>
				{this.statusField()}
				{this.importanceField()}
				{this.groupField()}
				{this.ownPlatformField()}
				{this.sortField()}
				{this.submitButton()}
			</View>
		);
	}

	/**
	 * Helper
	 * @returns the status field
	 */
	private statusField(): ReactNode {

		const items = MEDIA_ITEM_FILTER_FORM_STATUS_VALUES.map((status) => {
			return {
				value: status,
				label: i18n.t(`mediaItem.list.filter.values.status.${status}`)
			};
		});

		return (
			<PickerFieldComponent
				name='status'
				prompt={i18n.t('mediaItem.list.filter.prompts.status')}
				items={items}
				icon={images.statusField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the group field
	 */
	private groupField(): ReactNode {

		const items = MEDIA_ITEM_FILTER_FORM_GROUP_VALUES.map((group) => {
			return {
				value: group,
				label: i18n.t(`mediaItem.list.filter.values.group.${group}`)
			};
		});

		return (
			<PickerFieldComponent
				name='group'
				prompt={i18n.t('mediaItem.list.filter.prompts.group')}
				items={items}
				icon={images.groupField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the own platform field
	 */
	private ownPlatformField(): ReactNode {

		const items = MEDIA_ITEM_FILTER_FORM_OWN_PLATFORM_VALUES.map((ownPlatform) => {
			return {
				value: ownPlatform,
				label: i18n.t(`mediaItem.list.filter.values.ownPlatform.${ownPlatform}`)
			};
		});

		return (
			<PickerFieldComponent
				name='ownPlatform'
				prompt={i18n.t('mediaItem.list.filter.prompts.ownPlatform')}
				items={items}
				icon={images.ownPlatformField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the sort field
	 */
	private sortField(): ReactNode {

		const items = MEDIA_ITEM_FILTER_FORM_SORT_VALUES.map((sort) => {
			return {
				value: sort,
				label: i18n.t(`mediaItem.list.filter.values.sort.${sort}`)
			};
		});

		return (
			<PickerFieldComponent
				name='sortBy'
				prompt={i18n.t('mediaItem.list.filter.prompts.sort')}
				items={items}
				icon={images.sortField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the importance field
	 */
	private importanceField(): ReactNode {

		const items: PickerComponentItem[] = MEDIA_ITEM_FILTER_FORM_IMPORTANCE_VALUES.map((importance) => {
			return {
				value: importance,
				label: importance === 'NONE' ? i18n.t(`mediaItem.list.filter.values.importance.all`) : i18n.t(`mediaItem.common.importance.${importance}`),
				icon: importance === 'NONE' ? images.none() : images.mediaItemImportance(importance)
			};
		});

		return (
			<PickerFieldComponent
				name='importanceLevel'
				prompt={i18n.t('mediaItem.list.filter.prompts.importance')}
				items={items}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the submit button
	 */
	private submitButton(): ReactNode {
		
		const {
			handleSubmit,
			isValid
		} = this.props;

		return (
			<View style={styles.submitContainer}>
				<TouchableOpacity
					onPress={() => {
						handleSubmit();
					}}
					disabled={!isValid}>
					<Text style={!isValid ? [ styles.submitText, styles.submitTextDisabled ] : styles.submitText }>
						{i18n.t('common.alert.default.applyButton')}
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

/**
 * MediaItemFilterFormViewComponent's input props
 */
export type MediaItemFilterFormViewComponentInput = {

}

/**
 * MediaItemFilterFormViewComponent's output props
 */
export type MediaItemFilterFormViewComponentOutput = {

}

/**
 * All props of MediaItemFilterFormViewComponent
 */
export type MediaItemFilterFormViewComponentProps = FormikProps<MediaItemFilterFormValues> & MediaItemFilterFormViewComponentInput & MediaItemFilterFormViewComponentOutput;
