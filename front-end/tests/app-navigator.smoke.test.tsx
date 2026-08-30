import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppNavigationContainer } from 'app/components/containers/navigation/app-navigator';
import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens, AppSections } from 'app/utilities/screens';

const mockScreenState = {
	throwWhileRendering: true
};

jest.mock('app/components/containers/navigation/authentication-navigator', () => {
	return {
		ConnectedAuthenticationNavigator: (): ReactElement => {
			if(mockScreenState.throwWhileRendering) {
				throw new Error('App navigated to the media items details screen without category data');
			}

			return <div>App screen</div>;
		}
	};
});

describe('AppNavigationContainer', () => {
	let consoleError: jest.SpyInstance;
	let consoleLog: jest.SpyInstance;

	// React and the error boundary itself report the caught error, which would just be noise here
	beforeEach(() => {
		consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn());
		consoleLog = jest.spyOn(console, 'log').mockImplementation(jest.fn());
		mockScreenState.throwWhileRendering = true;
		window.history.pushState({}, '', screenToPath(AppScreens.MediaItemsList));
	});

	afterEach(() => {
		consoleError.mockRestore();
		consoleLog.mockRestore();
	});

	test('shows the error screen instead of a blank page when a screen throws', () => {
		render(<AppNavigationContainer />);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
	});

	test('leaves the failed screen and recovers when the error screen button is clicked', async() => {
		render(<AppNavigationContainer />);

		mockScreenState.throwWhileRendering = false;
		await userEvent.click(screen.getByRole('button', { name: 'Back to Home' }));

		expect(window.location.pathname).toBe(screenToPath(AppSections.Media));
		expect(screen.getByText('App screen')).toBeInTheDocument();
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});
