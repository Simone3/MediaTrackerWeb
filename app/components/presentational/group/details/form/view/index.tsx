import { Component, ReactNode } from 'react';
import { FormikProps } from 'formik';
import { InputComponent } from 'app/components/presentational/generic/input';
import { GroupInternal } from 'app/data/models/internal/group';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains all group form input fields, all handled by Formik
 */
export class GroupFormViewComponent extends Component<GroupFormViewComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		this.notifyFormStatus();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(prevProps: Readonly<GroupFormViewComponentProps>): void {
		const validChanged = prevProps.isValid !== this.props.isValid;
		const dirtyChanged = prevProps.dirty !== this.props.dirty;

		if (validChanged || dirtyChanged) {
			this.notifyFormStatus();
		}
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		const {
			values,
			handleChange
		} = this.props;

		return (
			<section className='entity-details-panel'>
				<div className='entity-details-grid'>
					<div className='entity-details-field entity-details-field-span-2'>
						<label className='entity-details-label' htmlFor='group-name'>
							{i18n.t('group.details.placeholders.name')}
						</label>
						<InputComponent
							id='group-name'
							name='name'
							type='text'
							value={values.name}
							placeholder={i18n.t('group.details.placeholders.name')}
							onChange={handleChange}
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

type GroupFormViewComponentOutput = {
	/**
	 * Callback to notify the current status of the form
	 * @param valid true if the form is valid, i.e. no validation error occurred
	 * @param dirty true if the form is dirty, i.e. one or more fields are different from initial values
	 */
	notifyFormStatus: (valid: boolean, dirty: boolean) => void;
};

/**
 * All props of GroupFormViewComponent
 */
export type GroupFormViewComponentProps = FormikProps<GroupInternal> & GroupFormViewComponentOutput;
