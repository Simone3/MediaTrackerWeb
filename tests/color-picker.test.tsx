import { fireEvent, render, screen } from '@testing-library/react';
import { ColorPickerComponent } from 'app/components/presentational/generic/color-picker';

describe('ColorPickerComponent', () => {
	test('renders a labeled color group and notifies selection changes', () => {
		const onSelectColor = jest.fn();

		render(
			<ColorPickerComponent
				id='category-color'
				ariaLabel='Color'
				colors={[ '#111111', '#222222' ]}
				selectedColor='#222222'
				getColorAriaLabel={(color) => {
					return `Select ${color}`;
				}}
				onSelectColor={onSelectColor}
			/>
		);

		const group = screen.getByRole('group', { name: 'Color' });
		const selectedButton = screen.getByRole('button', { name: 'Select #222222' });

		expect(group).toHaveAttribute('id', 'category-color');
		expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
		expect(selectedButton).toHaveClass('color-picker-option-selected');

		fireEvent.click(screen.getByRole('button', { name: 'Select #111111' }));

		expect(onSelectColor).toHaveBeenCalledWith('#111111');
	});

	test('falls back to the raw color as the aria label', () => {
		render(
			<ColorPickerComponent
				ariaLabel='Color'
				colors={[ '#abcdef' ]}
				onSelectColor={() => {
					return undefined;
				}}
			/>
		);

		expect(screen.getByRole('button', { name: '#abcdef' })).toBeInTheDocument();
	});
});
