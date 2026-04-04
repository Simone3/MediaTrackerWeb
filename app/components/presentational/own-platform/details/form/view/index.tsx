import { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { ColorPickerComponent } from 'app/components/presentational/generic/color-picker';
import { InputComponent } from 'app/components/presentational/generic/input';
import { SelectComponent } from 'app/components/presentational/generic/select';
import { config } from 'app/config/config';
import { buildOwnPlatformMaskStyle } from 'app/components/presentational/own-platform/common/icon-registry';
import { OWN_PLATFORM_ICON_INTERNAL_VALUES, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all own platform form input fields, all handled by Formik
 */
export class OwnPlatformFormViewComponent extends Component<OwnPlatformFormViewComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.notifyFormStatus();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<OwnPlatformFormViewComponentProps>): void {
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
			<section className='entity-details-panel'>
				<div className='entity-details-grid'>
					<div className='entity-details-field entity-details-field-span-2'>
						<label className='entity-details-label' htmlFor='own-platform-name'>
							{i18n.t('ownPlatform.details.placeholders.name')}
						</label>
						<InputComponent
							id='own-platform-name'
							name='name'
							type='text'
							value={values.name}
							placeholder={i18n.t('ownPlatform.details.placeholders.name')}
							onChange={handleChange}
						/>
					</div>
					<div className='entity-details-field entity-details-field-span-2'>
						<label className='entity-details-label' htmlFor='own-platform-icon'>
							{i18n.t('ownPlatform.details.prompts.icon')}
						</label>
						<div className='entity-details-select-row'>
							<span
								className='entity-details-selected-icon-shell'
								role='img'
								aria-label={i18n.t('common.a11y.icon', { name: String(i18n.t(`ownPlatform.icons.${values.icon}`)) })}>
								<span
									className='entity-details-selected-icon'
									style={buildOwnPlatformMaskStyle(
										values.icon,
										values.color,
										'--entity-details-selected-icon-url',
										'--entity-details-selected-icon-color'
									)}
									aria-hidden={true}
								/>
							</span>
							<SelectComponent
								id='own-platform-icon'
								name='icon'
								value={values.icon}
								onChange={(event) => {
									void setFieldValue('icon', event.target.value as OwnPlatformInternal['icon']);
								}}>
								{OWN_PLATFORM_ICON_INTERNAL_VALUES.map((icon) => {
									return (
										<option key={icon} value={icon}>
											{i18n.t(`ownPlatform.icons.${icon}`)}
										</option>
									);
								})}
							</SelectComponent>
						</div>
					</div>
					<div className='entity-details-field entity-details-field-span-2'>
						<p className='entity-details-label'>
							{i18n.t('common.fields.color')}
						</p>
						<ColorPickerComponent
							id='own-platform-color'
							ariaLabel={i18n.t('common.fields.color')}
							colors={config.ui.colors.availableOwnPlatformColors}
							selectedColor={values.color}
							getColorAriaLabel={(color) => {
								return i18n.t('common.a11y.selectColor', { color: color });
							}}
							onSelectColor={(color) => {
								void setFieldValue('color', color);
							}}
						/>
					</div>
				</div>
			</section>
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

type OwnPlatformFormViewComponentOutput = {
	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
}

/**
 * All props of OwnPlatformFormViewComponent
 */
export type OwnPlatformFormViewComponentProps = FormikProps<OwnPlatformInternal> & OwnPlatformFormViewComponentOutput;
