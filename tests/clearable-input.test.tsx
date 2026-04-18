import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ClearableInputComponent } from 'app/components/presentational/generic/clearable-input';
import { i18n } from 'app/utilities/i18n';

describe('ClearableInputComponent', () => {
	test('renders the input, forwards refs, and triggers the clear action', () => {
		const onClear = jest.fn();
		const inputRef = React.createRef<HTMLInputElement>();

		render(
			<ClearableInputComponent
				ref={inputRef}
				type='date'
				value='2026-04-18'
				onChange={() => {
					return undefined;
				}}
				onClear={onClear}
			/>
		);

		expect(inputRef.current).not.toBeNull();
		expect(inputRef.current).toHaveClass('text-input');
		expect(screen.getByRole('button', { name: i18n.t('common.buttons.clear') })).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: i18n.t('common.buttons.clear') }));

		expect(onClear).toHaveBeenCalledTimes(1);
	});

	test('hides the clear action when requested and keeps custom container classes', () => {
		const {
			container
		} = render(
			<ClearableInputComponent
				containerClassName='example-container'
				type='text'
				value='Dune'
				onChange={() => {
					return undefined;
				}}
				onClear={() => {
					return undefined;
				}}
				showClearButton={false}
			/>
		);

		expect(container.firstChild).toHaveClass('clearable-input');
		expect(container.firstChild).toHaveClass('example-container');
		expect(screen.queryByRole('button', { name: i18n.t('common.buttons.clear') })).not.toBeInTheDocument();
	});
});
