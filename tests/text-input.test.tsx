import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextInputComponent } from 'app/components/presentational/generic/text-input';

describe('TextInputComponent', () => {
	test('uses the auth variant, resolves password mode, and proxies change callbacks', () => {
		const onChange = jest.fn();
		const onChangeText = jest.fn();

		render(
			<TextInputComponent
				variant='auth'
				placeholder='Password'
				secureTextEntry={true}
				onChange={onChange}
				onChangeText={onChangeText}
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
		expect(onChangeText).toHaveBeenCalledWith('hunter2');
	});

	test('forwards refs and applies the requested variant class', () => {
		const inputRef = React.createRef<HTMLInputElement>();

			render(
				<TextInputComponent
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
