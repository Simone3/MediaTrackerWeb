import React from 'react';
import { render, screen } from '@testing-library/react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';

describe('PillButtonComponent', () => {
	test('defaults to a primary button and forwards refs', () => {
		const buttonRef = React.createRef<HTMLButtonElement>();

		render(
			<PillButtonComponent ref={buttonRef}>
				Save
			</PillButtonComponent>
		);

		const button = screen.getByRole('button', {
			name: 'Save'
		});

		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveClass('pill-button');
		expect(button).toHaveClass('pill-button-primary');
		expect(buttonRef.current).toBe(button);
	});

	test('supports alternate tones, compact size, and custom classes', () => {
		render(
			<PillButtonComponent tone='secondary' size='compact' className='test-extra-class'>
				Cancel
			</PillButtonComponent>
		);

		const button = screen.getByRole('button', {
			name: 'Cancel'
		});

		expect(button).toHaveClass('pill-button-secondary');
		expect(button).toHaveClass('pill-button-compact');
		expect(button).toHaveClass('test-extra-class');
	});
});
