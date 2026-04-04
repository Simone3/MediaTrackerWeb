import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectComponent } from 'app/components/presentational/generic/select';

describe('SelectComponent', () => {
	test('applies the shared select class and proxies change callbacks', () => {
		const onChange = jest.fn();
		const onChangeValue = jest.fn();

		render(
			<SelectComponent value='ACTIVE' onChange={onChange} onChangeValue={onChangeValue}>
				<option value='ACTIVE'>Active</option>
				<option value='COMPLETE'>Complete</option>
			</SelectComponent>
		);

		const select = screen.getByDisplayValue('Active');

		expect(select).toHaveClass('select-input');

		fireEvent.change(select, {
			target: {
				value: 'COMPLETE'
			}
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChangeValue).toHaveBeenCalledWith('COMPLETE');
	});

	test('forwards refs', () => {
		const selectRef = React.createRef<HTMLSelectElement>();

		render(
			<SelectComponent ref={selectRef} defaultValue='BOOK'>
				<option value='BOOK'>Book</option>
				<option value='MOVIE'>Movie</option>
			</SelectComponent>
		);

		expect(selectRef.current).not.toBeNull();
		expect(selectRef.current).toHaveClass('select-input');
		expect(selectRef.current?.value).toBe('BOOK');
	});
});
