import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { BrowserRouter } from 'react-router-dom';

const renderGuard = (overrides: Partial<React.ComponentProps<typeof BrowserBackNavigationGuardComponent>> = {}) => {
	return render(
		<BrowserRouter>
			<BrowserBackNavigationGuardComponent
				when={true}
				title='Leave page?'
				message='You have unsaved changes, are you sure you want to exit?'
				confirmLabel='OK'
				cancelLabel='Cancel'
				onConfirmLeave={jest.fn()}
				{...overrides}>
				<div>Guarded page</div>
			</BrowserBackNavigationGuardComponent>
		</BrowserRouter>
	);
};

describe('BrowserBackNavigationGuardComponent', () => {
	beforeEach(() => {
		window.history.pushState({}, '', '/media/items/details');
	});

	test('shows confirmation on browser back and runs the confirm callback before leaving', async() => {
		const onConfirmLeave = jest.fn();
		const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => {});

		renderGuard({
			onConfirmLeave
		});

		await waitFor(() => {
			expect(window.history.state).toEqual(expect.objectContaining({
				__browserBackGuardPath: '/media/items/details'
			}));
		});

		await act(async() => {
			window.dispatchEvent(new PopStateEvent('popstate'));
		});

		expect(screen.getByRole('dialog')).toHaveTextContent('You have unsaved changes, are you sure you want to exit?');

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'OK' }));

		expect(onConfirmLeave).toHaveBeenCalledTimes(1);
		expect(backSpy).toHaveBeenCalledTimes(1);
	});

	test('re-arms the guard when browser back is canceled', async() => {
		renderGuard();

		await waitFor(() => {
			expect(window.history.state).toEqual(expect.objectContaining({
				__browserBackGuardPath: '/media/items/details'
			}));
		});

		await act(async() => {
			window.dispatchEvent(new PopStateEvent('popstate'));
		});

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: 'Cancel' }));

		await act(async() => {
			window.dispatchEvent(new PopStateEvent('popstate'));
		});

		expect(screen.getByRole('dialog')).toHaveTextContent('You have unsaved changes, are you sure you want to exit?');
	});
});
