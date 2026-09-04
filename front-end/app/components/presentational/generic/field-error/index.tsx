import { ReactElement } from 'react';
import { FormikErrors, FormikTouched } from 'formik';

/**
 * All props of FieldErrorComponent
 */
export type FieldErrorComponentProps = {
	/**
	 * The message element ID, referenced by the control via aria-describedby
	 */
	id: string;

	/**
	 * The message to display, if the field currently has one
	 */
	message?: string;
};

/**
 * Extracts the validation message a field should currently display. A field that the user has not left
 * yet shows nothing, so that a form does not open covered in errors for values nobody has typed
 * @param errors the current Formik errors
 * @param touched the current Formik touched flags
 * @param field the field key
 * @returns the message to display, or undefined if the field has nothing to show
 */
export const getVisibleFieldError = <TValues extends object>(
	errors: FormikErrors<TValues>,
	touched: FormikTouched<TValues>,
	field: keyof TValues & string
): string | undefined => {
	const error = errors[field];

	return touched[field] && typeof error === 'string' ? error : undefined;
};

/**
 * Builds the accessibility props that tie a control to its validation message
 * @param id the message element ID
 * @param message the message to display, if any
 * @returns the props to spread on the control
 */
export const buildFieldErrorInputProps = (id: string, message?: string): { 'aria-invalid': boolean, 'aria-describedby'?: string } => {
	return {
		'aria-invalid': Boolean(message),
		'aria-describedby': message ? id : undefined
	};
};

/**
 * Shared inline validation message, rendered under the control it belongs to.
 * It renders nothing when there is no message, so a field can always mount it.
 * @param props the input props
 * @returns the component
 */
export const FieldErrorComponent = (props: FieldErrorComponentProps): ReactElement | null => {
	const {
		id,
		message
	} = props;

	if(!message) {
		return null;
	}

	return (
		<p className='field-error' id={id} role='alert'>
			{message}
		</p>
	);
};
