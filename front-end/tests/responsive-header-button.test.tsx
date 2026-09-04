import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResponsiveHeaderButtonComponent } from 'app/components/presentational/generic/responsive-header-button';

describe('ResponsiveHeaderButtonComponent', () => {
	const originalInnerWidth = window.innerWidth;

	afterEach(() => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: originalInnerWidth
		});
	});

	test('keeps the desktop label above the mobile breakpoint', async() => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 1280
		});
		const onClick = jest.fn();

		render(
			<ResponsiveHeaderButtonComponent
				label='Add category'
				mobileLabel='Add'
				onClick={onClick}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Add category' }));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test('uses the compact mobile label at or below the mobile breakpoint', async() => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 640
		});
		const onClick = jest.fn();

		render(
			<ResponsiveHeaderButtonComponent
				label='Add movie'
				mobileLabel='Add'
				onClick={onClick}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Add' }));

		expect(screen.queryByRole('button', { name: 'Add movie' })).not.toBeInTheDocument();
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
