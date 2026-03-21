import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserBackNavigationGuardComponent } from 'app/components/presentational/generic/browser-back-navigation-guard';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';

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

const GuardLocationComponent = () => {
	const location = useLocation();

	return (
		<div data-testid='guard-location'>
			{`${location.pathname}${location.search}${location.hash}`}
		</div>
	);
};

const renderGuardWithSiblingNavigation = (overrides: Partial<React.ComponentProps<typeof BrowserBackNavigationGuardComponent>> = {}) => {
	return render(
		<BrowserRouter>
			<nav>
				<Link to='/settings'>Settings</Link>
			</nav>
			<GuardLocationComponent />
			<Routes>
				<Route
					path='/media/items/details'
					element={
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
					}
				/>
				<Route path='/settings' element={<div>Settings page</div>} />
			</Routes>
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

	test('shows confirmation when clicking a sibling in-app link and only navigates after confirm', async() => {
		const onConfirmLeave = jest.fn();
		renderGuardWithSiblingNavigation({
			onConfirmLeave
		});

		expect(screen.getByTestId('guard-location')).toHaveTextContent('/media/items/details');

		const user = userEvent.setup();
		await user.click(screen.getByRole('link', { name: 'Settings' }));

		expect(screen.getByRole('dialog')).toHaveTextContent('You have unsaved changes, are you sure you want to exit?');
		expect(screen.getByTestId('guard-location')).toHaveTextContent('/media/items/details');
		expect(screen.queryByText('Settings page')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'OK' }));

		expect(onConfirmLeave).toHaveBeenCalledTimes(1);

		await waitFor(() => {
			expect(screen.getByTestId('guard-location')).toHaveTextContent('/settings');
		});

		expect(screen.getByText('Settings page')).toBeInTheDocument();
	});

	test('keeps the current route when sibling in-app navigation is canceled', async() => {
		renderGuardWithSiblingNavigation();

		const user = userEvent.setup();
		await user.click(screen.getByRole('link', { name: 'Settings' }));

		expect(screen.getByRole('dialog')).toHaveTextContent('You have unsaved changes, are you sure you want to exit?');

		await user.click(screen.getByRole('button', { name: 'Cancel' }));

		expect(screen.getByTestId('guard-location')).toHaveTextContent('/media/items/details');
		expect(screen.queryByText('Settings page')).not.toBeInTheDocument();
	});
});
