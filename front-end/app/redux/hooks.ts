import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { State } from 'app/redux/state/state';

// Both type parameters below are constrained to `object` because every set of props is one, and because the
// constraint is also what makes the generic arrow functions parse: Babel reads every file in this project with
// JSX enabled, `.ts` included, so a bare `<TInput>` would open what looks like an unclosed JSX tag.

/**
 * Reads a presentational component's input props out of the Redux state.
 *
 * The result is compared shallowly, which is what keeps a container from re-rendering on every action: a selector
 * that derives its props builds a new object each time it runs, so comparing that object by reference would always
 * report a change. Anything the selector returns has to survive the comparison, which means a derived object or
 * array has to be memoized before it is returned rather than rebuilt inside the selector.
 * @param selectInput the selector that builds the input props
 * @returns the current input props
 */
export const useContainerInput = <TInput extends object>(selectInput: (state: State) => TInput): TInput => {
	return useSelector<State, TInput>(selectInput, shallowEqual);
};

/**
 * Builds a presentational component's output props, the callbacks that dispatch back into Redux.
 *
 * They are built once per store and then reused, so that a re-rendering container does not hand the component a
 * fresh set of functions: the presentational components compare props across updates, and a callback whose identity
 * changes on every render defeats that.
 * @param buildOutput the factory that builds the output props from the dispatch function
 * @returns the output props
 */
export const useContainerOutput = <TOutput extends object>(buildOutput: (dispatch: Dispatch) => TOutput): TOutput => {
	const dispatch = useDispatch();

	return useMemo(() => {
		return buildOutput(dispatch);
	}, [ buildOutput, dispatch ]);
};
