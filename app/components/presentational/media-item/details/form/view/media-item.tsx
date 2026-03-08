import React, { Component, ReactNode } from 'react';
import { View, ScrollView } from 'react-native';
import { FormikProps } from 'formik';
import { styles } from 'app/components/presentational/media-item/details/form/view/styles';
import { i18n } from 'app/utilities/i18n';
import { images } from 'app/utilities/images';
import { TextInputFieldComponent } from 'app/components/presentational/form/fields/text-input';
import { MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { PickerFieldComponent } from 'app/components/presentational/form/fields/picker';
import { MediaItemFormNameFieldContainer } from 'app/components/containers/media-item/details/form-name-field';
import { DatePickerFieldComponent } from 'app/components/presentational/form/fields/date-picker';
import { MultiTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-multiple';
import { MultiDateInputFieldComponent } from 'app/components/presentational/form/fields/date-picker-multiple';
import { GroupPickerFieldContainer } from 'app/components/containers/media-item/details/group-picker';
import { OwnPlatformPickerFieldContainer } from 'app/components/containers/media-item/details/own-platform-picker';
import { MediaItemImageButtonsRowContainer } from 'app/components/containers/media-item/details/image-buttons-row';
import { NumericTextInputFieldComponent } from 'app/components/presentational/form/fields/text-input-number';

/**
 * Presentational component that contains all generic media item form input fields, all handled by the Formik container component
 */
export class MediaItemFormViewComponent extends Component<MediaItemFormViewComponentProps> {

	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.handlePropChange();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: MediaItemFormViewComponentProps): void {
		
		const validChanged = prevProps.isValid !== this.props.isValid;
		const dirtyChanged = prevProps.dirty !== this.props.dirty;
		const saveReqChanged = prevProps.saveRequested !== this.props.saveRequested;
		if(validChanged || dirtyChanged || saveReqChanged) {
			
			this.handlePropChange();
		}
	}

	/**
	 * Helper to handle custom props at startup and after each update
	 */
	private handlePropChange(): void {

		const {
			saveRequested,
			notifyFormStatus,
			submitForm,
			isValid,
			dirty
		} = this.props;

		if(saveRequested) {

			submitForm();
		}
		else {

			notifyFormStatus(isValid, dirty);
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			primarySpecificFields,
			secondarySpecificFields
		} = this.props;
		
		return (
			<ScrollView style={styles.container}>
				<View style={styles.content}>
					{this.imageAndButtons()}
					{this.nameField()}
					{this.descriptionField()}
					{this.releaseDateField()}
					{primarySpecificFields}
					{this.genresField()}
					{this.importanceField()}
					{this.ownPlatformField()}
					{this.groupField()}
					{this.orderInGroupField()}
					{secondarySpecificFields}
					{this.userCommentField()}
					{this.completionDatesField()}
				</View>
			</ScrollView>
		);
	}

	/**
	 * Helper
	 * @returns the image and buttons component
	 */
	private imageAndButtons(): ReactNode {

		return (
			<MediaItemImageButtonsRowContainer
				mediaItem={this.props.values}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the name component
	 */
	private nameField(): ReactNode {

		return (
			<MediaItemFormNameFieldContainer
				name='name'
				placeholder={i18n.t('mediaItem.details.placeholders.name')}
				icon={images.nameField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the description component
	 */
	private descriptionField(): ReactNode {

		return (
			<TextInputFieldComponent
				name='description'
				placeholder={i18n.t('mediaItem.details.placeholders.description')}
				icon={images.descriptionField()}
				multiline={true}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the importance component
	 */
	private importanceField(): ReactNode {

		const items = MEDIA_ITEM_IMPORTANCE_INTERNAL_VALUES.map((importance) => {
			return {
				value: importance,
				label: i18n.t(`mediaItem.common.importance.${importance}`),
				icon: images.mediaItemImportance(importance)
			};
		});

		return (
			<PickerFieldComponent
				name='importance'
				prompt={i18n.t('mediaItem.details.prompts.importance')}
				items={items}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the release date component
	 */
	private releaseDateField(): ReactNode {

		return (
			<DatePickerFieldComponent
				name='releaseDate'
				icon={images.releaseDateField()}
				placeholder={i18n.t('mediaItem.details.placeholders.releaseDate')}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the user comment component
	 */
	private userCommentField(): ReactNode {

		return (
			<TextInputFieldComponent
				name='userComment'
				placeholder={i18n.t('mediaItem.details.placeholders.userComment')}
				icon={images.userCommentField()}
				multiline={true}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the genres component
	 */
	private genresField(): ReactNode {

		return (
			<MultiTextInputFieldComponent
				name='genres'
				placeholder={i18n.t('mediaItem.details.placeholders.genres')}
				icon={images.genresField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the group component
	 */
	private groupField(): ReactNode {

		return (
			<GroupPickerFieldContainer
				name='group'
				placeholder={i18n.t('mediaItem.details.placeholders.group')}
				icon={images.groupField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the order in group component
	 */
	private orderInGroupField(): ReactNode {

		if(this.props.values.group) {
			
			return (
				<NumericTextInputFieldComponent
					name='orderInGroup'
					placeholder={i18n.t('mediaItem.details.placeholders.orderInGroup')}
					icon={images.groupField()}
				/>
			);
		}
		else {

			return null;
		}
	}

	/**
	 * Helper
	 * @returns the own platform component
	 */
	private ownPlatformField(): ReactNode {

		return (
			<OwnPlatformPickerFieldContainer
				name='ownPlatform'
				placeholder={i18n.t('mediaItem.details.placeholders.ownPlatform')}
				icon={images.ownPlatformField()}
			/>
		);
	}

	/**
	 * Helper
	 * @returns the completion dates component
	 */
	private completionDatesField(): ReactNode {

		return (
			<MultiDateInputFieldComponent
				name='completedOn'
				placeholder={i18n.t('mediaItem.details.placeholders.completedOn')}
				icon={images.completedOnField()}
			/>
		);
	}
}

/**
 * MediaItemFormViewComponent's common input props
 */
export type MediaItemFormViewComponentCommonInput = {

	/**
	 * If an external component requests the form submission. Triggers form validation and, if OK, its submission.
	 */
	saveRequested: boolean;
}

/**
 * MediaItemFormViewComponent's input props
 */
export type MediaItemFormViewComponentInput = MediaItemFormViewComponentCommonInput & {

	/**
	 * Inputs for the specific media item (top)
	 */
	primarySpecificFields?: ReactNode[];

	/**
	 * Inputs for the specific media item (bottom)
	 */
	secondarySpecificFields?: ReactNode[];
}

/**
 * MediaItemFormViewComponent's common output props
 */
export type MediaItemFormViewComponentCommonOutput = {

	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * MediaItemFormViewComponent's output props
 */
export type MediaItemFormViewComponentOutput = MediaItemFormViewComponentCommonOutput;

/**
 * All props of MediaItemFormViewComponent
 */
export type MediaItemFormViewComponentProps = FormikProps<MediaItemInternal> & MediaItemFormViewComponentInput & MediaItemFormViewComponentOutput;
