import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { InputComponent } from 'app/components/presentational/generic/input';

describe('InputComponent', () => {
	test('uses the auth variant, resolves password mode, and proxies change callbacks', () => {
		const onChange = jest.fn();
		const onChangeValue = jest.fn();

		render(
			<InputComponent
				variant='auth'
				placeholder='Password'
				secureTextEntry={true}
				onChange={onChange}
				onChangeValue={onChangeValue}
			/>
		);

		const input = screen.getByPlaceholderText('Password');

		expect(input).toHaveAttribute('type', 'password');
		expect(input).toHaveClass('text-input');
		expect(input).toHaveClass('text-input-auth');

		fireEvent.change(input, {
			target: {
				value: 'hunter2'
			}
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChangeValue).toHaveBeenCalledWith('hunter2');
	});

	test('forwards refs and applies the shared input class', () => {
		const inputRef = React.createRef<HTMLInputElement>();

		render(
			<InputComponent
				ref={inputRef}
				type='search'
				defaultValue='Dark'
				onChange={() => {
					return undefined;
				}}
			/>
		);

		expect(inputRef.current).not.toBeNull();
		expect(inputRef.current).toHaveClass('text-input');
		expect(inputRef.current).toHaveAttribute('type', 'search');
		expect(inputRef.current?.value).toBe('Dark');
	});
});
