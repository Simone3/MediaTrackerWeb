import { render, screen } from '@testing-library/react';
import { buildFieldErrorInputProps, FieldErrorComponent, getVisibleFieldError } from 'app/components/presentational/generic/field-error';

type TestValues = {
	name: string;
};

describe('FieldErrorComponent', () => {
	test('stays silent until the field has been touched', () => {
		const errors = {
			name: 'Give the item a name'
		};

		expect(getVisibleFieldError<TestValues>(errors, {}, 'name')).toBeUndefined();
		expect(getVisibleFieldError<TestValues>(errors, { name: true }, 'name')).toBe('Give the item a name');
	});

	test('stays silent for a touched field that has no error', () => {
		expect(getVisibleFieldError<TestValues>({}, { name: true }, 'name')).toBeUndefined();
	});

	test('marks the control invalid and describes it only when there is a message', () => {
		expect(buildFieldErrorInputProps('name-error', 'Give the item a name')).toEqual({
			'aria-invalid': true,
			'aria-describedby': 'name-error'
		});
		expect(buildFieldErrorInputProps('name-error', undefined)).toEqual({
			'aria-invalid': false,
			'aria-describedby': undefined
		});
	});

	test('renders nothing without a message', () => {
		const { container } = render(<FieldErrorComponent id='name-error' message={undefined} />);

		expect(container).toBeEmptyDOMElement();
	});

	test('renders the message as an alert the control can reference', () => {
		render(<FieldErrorComponent id='name-error' message='Give the item a name' />);

		const message = screen.getByRole('alert');

		expect(message).toHaveTextContent('Give the item a name');
		expect(message).toHaveAttribute('id', 'name-error');
	});
});
