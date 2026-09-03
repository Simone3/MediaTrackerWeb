import { ReactElement } from 'react';
import { act, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Action, Store, createStore } from 'redux';
import { useContainerInput, useContainerOutput } from 'app/redux/hooks';

type TestState = {
	counter: number;
	unrelated: number;
};

type TestInput = {
	counter: number;
};

type TestOutput = {
	bump: () => void;
};

const buildStore = (): Store<TestState, Action> => {
	return createStore((state: TestState = { counter: 0, unrelated: 0 }, action: Action): TestState => {
		if(action.type === 'BUMP_COUNTER') {
			return { ...state, counter: state.counter + 1 };
		}
		if(action.type === 'BUMP_UNRELATED') {
			return { ...state, unrelated: state.unrelated + 1 };
		}

		return state;
	});
};

// The hooks are typed against the whole app State, which these probes deliberately do not build: what is under test
// is the binding behaviour, so they select out of a two-field store and cast at the one point where that shows.
const selectCounter = (state: unknown): TestInput => {
	return {
		counter: (state as TestState).counter
	};
};

const buildBump = (dispatch: (action: Action) => void): TestOutput => {
	return {
		bump: () => {
			dispatch({ type: 'BUMP_COUNTER' });
		}
	};
};

const renderProbe = (store: Store<TestState, Action>, Probe: () => ReactElement) => {
	return render(
		<Provider store={store as unknown as Store}>
			<Probe />
		</Provider>
	);
};

describe('useContainerInput', () => {
	test('re-renders only when a selected value actually changes', () => {
		const store = buildStore();
		let renders = 0;

		renderProbe(store, () => {
			const input = useContainerInput(selectCounter);
			renders += 1;

			return <span data-testid='counter'>{input.counter}</span>;
		});

		expect(renders).toBe(1);
		expect(screen.getByTestId('counter')).toHaveTextContent('0');

		// An action that leaves the selected value alone must not re-render, which is what the shallow comparison buys
		act(() => {
			store.dispatch({ type: 'BUMP_UNRELATED' });
		});
		expect(renders).toBe(1);

		act(() => {
			store.dispatch({ type: 'BUMP_COUNTER' });
		});
		expect(renders).toBe(2);
		expect(screen.getByTestId('counter')).toHaveTextContent('1');
	});
});

describe('useContainerOutput', () => {
	test('hands the component the same callbacks across re-renders', () => {
		const store = buildStore();
		const outputs: TestOutput[] = [];

		renderProbe(store, () => {
			const input = useContainerInput(selectCounter);
			const output = useContainerOutput(buildBump);
			outputs.push(output);

			return <span data-testid='counter'>{input.counter}</span>;
		});

		act(() => {
			store.dispatch({ type: 'BUMP_COUNTER' });
		});

		expect(outputs.length).toBe(2);
		expect(outputs[1]).toBe(outputs[0]);
		expect(outputs[1].bump).toBe(outputs[0].bump);
	});

	test('builds callbacks that dispatch to the store', () => {
		const store = buildStore();

		renderProbe(store, () => {
			const output = useContainerOutput(buildBump);

			return <button onClick={output.bump}>bump</button>;
		});

		act(() => {
			screen.getByText('bump').click();
		});

		expect(store.getState().counter).toBe(1);
	});
});
