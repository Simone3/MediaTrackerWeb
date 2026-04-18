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

	test('adds date-specific classes and enables the iOS WebKit workaround when needed', () => {
		const originalDescriptors = {
			userAgent: Object.getOwnPropertyDescriptor(window.navigator, 'userAgent'),
			maxTouchPoints: Object.getOwnPropertyDescriptor(window.navigator, 'maxTouchPoints')
		};

		Object.defineProperty(window.navigator, 'userAgent', {
			configurable: true,
			value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
		});
		Object.defineProperty(window.navigator, 'maxTouchPoints', {
			configurable: true,
			value: 5
		});

		try {
			render(
				<InputComponent
					type='date'
					value='2026-04-18'
					onChange={() => {
						return undefined;
					}}
				/>
			);
		}
		finally {
			if(originalDescriptors.userAgent) {
				Object.defineProperty(window.navigator, 'userAgent', originalDescriptors.userAgent);
			}
			if(originalDescriptors.maxTouchPoints) {
				Object.defineProperty(window.navigator, 'maxTouchPoints', originalDescriptors.maxTouchPoints);
			}
		}

		const input = screen.getByDisplayValue('2026-04-18');

		expect(input).toHaveClass('text-input');
		expect(input).toHaveClass('text-input-date');
		expect(input).toHaveClass('text-input-date-ios');
		expect(input).toHaveAttribute('type', 'date');
	});
});
