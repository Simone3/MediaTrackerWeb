import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { TextareaComponent } from 'app/components/presentational/generic/textarea';

describe('TextareaComponent', () => {
	test('applies the shared textarea class and proxies change callbacks', () => {
		const onChange = jest.fn();
		const onChangeValue = jest.fn();

		render(
			<TextareaComponent
				placeholder='Comment'
				onChange={onChange}
				onChangeValue={onChangeValue}
			/>
		);

		const textarea = screen.getByPlaceholderText('Comment');

		expect(textarea).toHaveClass('textarea-input');

		fireEvent.change(textarea, {
			target: {
				value: 'Great show'
			}
		});

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChangeValue).toHaveBeenCalledWith('Great show');
	});

	test('forwards refs', () => {
		const textareaRef = React.createRef<HTMLTextAreaElement>();

		render(
			<TextareaComponent
				ref={textareaRef}
				defaultValue='Initial value'
			/>
		);

		expect(textareaRef.current).not.toBeNull();
		expect(textareaRef.current).toHaveClass('textarea-input');
		expect(textareaRef.current?.value).toBe('Initial value');
	});
});
