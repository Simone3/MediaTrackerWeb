import { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { MediaIconComponent } from 'app/components/presentational/category/common/media-icon';
import { config } from 'app/config/config';
import { CategoryInternal, MEDIA_TYPES_INTERNAL } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all category form input fields, all handled by Formik
 */
export class CategoryFormViewComponent extends Component<CategoryFormViewComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.notifyFormStatus();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<CategoryFormViewComponentProps>): void {
		const validChanged = prevProps.isValid !== this.props.isValid;
		const dirtyChanged = prevProps.dirty !== this.props.dirty;

		if(validChanged || dirtyChanged) {
			this.notifyFormStatus();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			values,
			handleChange,
			setFieldValue
		} = this.props;

		return (
			<>
				<div className='category-details-section'>
					<label className='category-details-label' htmlFor='category-name'>
						{i18n.t('category.details.placeholders.name')}
					</label>
					<input
						id='category-name'
						name='name'
						className='category-details-input'
						type='text'
						value={values.name}
						onChange={handleChange}
					/>
				</div>
				<div className='category-details-section'>
					<p className='category-details-label'>{i18n.t('category.details.prompts.mediaType')}</p>
					<div className='category-details-media-grid'>
						{MEDIA_TYPES_INTERNAL.map((mediaType) => {
							const selected = values.mediaType === mediaType;
							const disabled = Boolean(values.id);
							const buttonClassName = selected ?
								'category-details-media-option category-details-media-option-selected' :
								'category-details-media-option';
							const optionLabel = i18n.t(`category.mediaTypes.${mediaType}`);

							return (
								<button
									key={mediaType}
									type='button'
									className={buttonClassName}
									disabled={disabled}
									aria-pressed={selected}
									onClick={() => {
										void setFieldValue('mediaType', mediaType);
									}}>
									<span className='category-details-media-option-icon-shell' aria-hidden={true}>
										<MediaIconComponent mediaType={mediaType} className='category-details-media-option-icon' />
									</span>
									<span className='category-details-media-option-label'>{optionLabel}</span>
								</button>
							);
						})}
					</div>
				</div>
				<div className='category-details-section'>
					<p className='category-details-label'>{i18n.t('common.fields.color')}</p>
					<div className='category-details-colors'>
						{config.ui.colors.availableCategoryColors.map((color) => {
							const selected = values.color === color;
							const buttonClassName = selected ?
								'category-details-color category-details-color-selected' :
								'category-details-color';

							return (
								<button
									key={color}
									type='button'
									className={buttonClassName}
									style={{ backgroundColor: color }}
									onClick={() => {
										void setFieldValue('color', color);
									}}
									aria-label={i18n.t('common.a11y.selectColor', { color: color })}
									aria-pressed={selected}
								/>
							);
						})}
					</div>
				</div>
			</>
		);
	}

	/**
	 * Notifies the current Formik status to the parent flow
	 */
	private notifyFormStatus(): void {
		const {
			isValid,
			dirty,
			notifyFormStatus
		} = this.props;

		notifyFormStatus(isValid, dirty);
	}
}

type CategoryFormViewComponentOutput = {
	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * All props of CategoryFormViewComponent
 */
export type CategoryFormViewComponentProps = FormikProps<CategoryInternal> & CategoryFormViewComponentOutput;
