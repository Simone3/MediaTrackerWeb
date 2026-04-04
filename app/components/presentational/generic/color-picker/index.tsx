import { ReactElement } from 'react';

/**
 * All props of ColorPickerComponent
 */
export type ColorPickerComponentProps = {
	colors: readonly string[];
	id?: string;
	ariaLabel: string;
	selectedColor?: string;
	getColorAriaLabel?: (color: string) => string;
	onSelectColor: (color: string) => void;
};

/**
 * Shared color picker component used by details forms
 * @param props the component props
 * @returns the component
 */
export const ColorPickerComponent = (props: ColorPickerComponentProps): ReactElement => {
	const getColorAriaLabel = props.getColorAriaLabel || ((color: string) => {
		return color;
	});

	return (
		<div
			id={props.id}
			className='color-picker'
			role='group'
			aria-label={props.ariaLabel}>
			{props.colors.map((color) => {
				const selected = props.selectedColor === color;
				const buttonClassName = selected ?
					'color-picker-option color-picker-option-selected' :
					'color-picker-option';

				return (
					<button
						key={color}
						type='button'
						className={buttonClassName}
						style={{ backgroundColor: color }}
						onClick={() => {
							props.onSelectColor(color);
						}}
						aria-label={getColorAriaLabel(color)}
						aria-pressed={selected}
					/>
				);
			})}
		</div>
	);
};
