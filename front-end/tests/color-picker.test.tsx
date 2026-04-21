import { fireEvent, render, screen } from '@testing-library/react';
import { config } from 'app/config/config';
import { ColorPickerComponent } from 'app/components/presentational/generic/color-picker';

describe('ColorPickerComponent', () => {
	test('renders a labeled color group and notifies selection changes', () => {
		const onSelectColor = jest.fn();
		const colorOne = config.ui.colors.availableCategoryColors[0];
		const colorTwo = config.ui.colors.availableCategoryColors[1];

		render(
			<ColorPickerComponent
				id='category-color'
				ariaLabel='Color'
				colors={[ colorOne, colorTwo ]}
				selectedColor={colorTwo}
				getColorAriaLabel={(color) => {
					return `Select ${color}`;
				}}
				onSelectColor={onSelectColor}
			/>
		);

		const group = screen.getByRole('group', { name: 'Color' });
		const selectedButton = screen.getByRole('button', { name: `Select ${colorTwo}` });

		expect(group).toHaveAttribute('id', 'category-color');
		expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
		expect(selectedButton).toHaveClass('color-picker-option-selected');

		fireEvent.click(screen.getByRole('button', { name: `Select ${colorOne}` }));

		expect(onSelectColor).toHaveBeenCalledWith(colorOne);
	});

	test('falls back to the raw color as the aria label', () => {
		const color = config.ui.colors.availableCategoryColors[2];

		render(
			<ColorPickerComponent
				ariaLabel='Color'
				colors={[ color ]}
				onSelectColor={() => {
					return undefined;
				}}
			/>
		);

		expect(screen.getByRole('button', { name: color })).toBeInTheDocument();
	});
});
