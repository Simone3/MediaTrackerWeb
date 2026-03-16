import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';
import { useBeforeUnload, useLocation } from 'react-router-dom';

const HISTORY_STATE_KEY = '__browserBackGuardPath';

const getCurrentPath = (pathname: string, search: string, hash: string): string => {
	return `${pathname}${search}${hash}`;
};

const getCurrentHistoryState = (): Record<string, unknown> => {
	if(typeof window === 'undefined' || !window.history.state || typeof window.history.state !== 'object') {
		return {};
	}

	return window.history.state as Record<string, unknown>;
};

const getGuardedPathFromHistoryState = (): string | undefined => {
	const guardedPath = getCurrentHistoryState()[HISTORY_STATE_KEY];
	return typeof guardedPath === 'string' ? guardedPath : undefined;
};

const pushGuardHistoryState = (path: string): void => {
	window.history.pushState({
		...getCurrentHistoryState(),
		[HISTORY_STATE_KEY]: path
	}, '', path);
};

/**
 * Generic wrapper that replaces in-app back buttons while still guarding browser back for dirty forms.
 * It inserts a duplicate history entry when needed so the first browser-back attempt can be intercepted.
 * @param props the input props
 * @returns the wrapped content plus an optional confirmation dialog
 */
export const BrowserBackNavigationGuardComponent = (props: BrowserBackNavigationGuardComponentProps): ReactElement => {
	const {
		when,
		title,
		message,
		confirmLabel,
		cancelLabel,
		onConfirmLeave,
		children
	} = props;
	const location = useLocation();
	const currentPath = getCurrentPath(location.pathname, location.search, location.hash);
	const [ dialogVisible, setDialogVisible ] = useState(false);
	const currentPathRef = useRef(currentPath);
	const whenRef = useRef(when);
	const guardArmedRef = useRef(false);

	currentPathRef.current = currentPath;
	whenRef.current = when;

	useEffect(() => {
		const currentHistoryPath = getGuardedPathFromHistoryState();
		guardArmedRef.current = currentHistoryPath === currentPath;

		if(when && !guardArmedRef.current) {
			pushGuardHistoryState(currentPath);
			guardArmedRef.current = true;
		}
	}, [ currentPath, when ]);

	useEffect(() => {
		const handlePopState = (): void => {
			if(!guardArmedRef.current) {
				return;
			}

			guardArmedRef.current = false;

			if(whenRef.current) {
				setDialogVisible(true);
				return;
			}

			window.history.back();
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	useBeforeUnload((event) => {
		if(!whenRef.current) {
			return;
		}

		event.preventDefault();
		event.returnValue = '';
	});

	const rearmGuard = (): void => {
		if(getGuardedPathFromHistoryState() !== currentPathRef.current) {
			pushGuardHistoryState(currentPathRef.current);
		}

		guardArmedRef.current = true;
	};

	return (
		<>
			{children}
			<ConfirmDialogComponent
				visible={dialogVisible}
				title={title}
				message={message}
				confirmLabel={confirmLabel}
				cancelLabel={cancelLabel}
				onConfirm={() => {
					setDialogVisible(false);
					onConfirmLeave?.();
					window.history.back();
				}}
				onCancel={() => {
					setDialogVisible(false);
					rearmGuard();
				}}
			/>
		</>
	);
};

export type BrowserBackNavigationGuardComponentProps = {
	when: boolean;
	title: string;
	message: string;
	confirmLabel: string;
	cancelLabel: string;
	onConfirmLeave?: () => void;
	children?: ReactNode;
}
