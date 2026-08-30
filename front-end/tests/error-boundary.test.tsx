import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundaryComponent } from 'app/components/presentational/generic/error-boundary';

const ThrowingScreen = (): ReactElement => {
	throw new Error('App navigated to a screen without the context it requires');
};

const WorkingScreen = (): ReactElement => {
	return <div>Working screen</div>;
};

describe('ErrorBoundaryComponent', () => {
	let consoleError: jest.SpyInstance;
	let consoleLog: jest.SpyInstance;

	// React and the boundary itself report the caught error, which would just be noise here
	beforeEach(() => {
		consoleError = jest.spyOn(console, 'error').mockImplementation(jest.fn());
		consoleLog = jest.spyOn(console, 'log').mockImplementation(jest.fn());
	});

	afterEach(() => {
		consoleError.mockRestore();
		consoleLog.mockRestore();
	});

	test('renders the children when nothing throws', () => {
		render(
			<ErrorBoundaryComponent resetKey='first' recover={jest.fn()}>
				<WorkingScreen />
			</ErrorBoundaryComponent>
		);

		expect(screen.getByText('Working screen')).toBeInTheDocument();
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});

	test('shows the recoverable error screen when a child throws while rendering', () => {
		render(
			<ErrorBoundaryComponent resetKey='first' recover={jest.fn()}>
				<ThrowingScreen />
			</ErrorBoundaryComponent>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Back to Home' })).toBeInTheDocument();
	});

	test('invokes the recovery callback when the button is clicked', async() => {
		const recover = jest.fn();

		render(
			<ErrorBoundaryComponent resetKey='first' recover={recover}>
				<ThrowingScreen />
			</ErrorBoundaryComponent>
		);

		await userEvent.click(screen.getByRole('button', { name: 'Back to Home' }));

		expect(recover).toHaveBeenCalledTimes(1);
	});

	test('clears the error when a new screen is opened', () => {
		const { rerender } = render(
			<ErrorBoundaryComponent resetKey='first' recover={jest.fn()}>
				<ThrowingScreen />
			</ErrorBoundaryComponent>
		);

		expect(screen.getByRole('alert')).toBeInTheDocument();

		rerender(
			<ErrorBoundaryComponent resetKey='second' recover={jest.fn()}>
				<WorkingScreen />
			</ErrorBoundaryComponent>
		);

		expect(screen.getByText('Working screen')).toBeInTheDocument();
		expect(screen.queryByRole('alert')).not.toBeInTheDocument();
	});
});
