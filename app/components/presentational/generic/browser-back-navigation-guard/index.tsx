import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { useBeforeUnload, useLocation, useNavigate } from 'react-router-dom';
import { ConfirmDialogComponent } from 'app/components/presentational/generic/confirm-dialog';

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

type PendingNavigation = {
	type: 'BROWSER_BACK';
} | {
	type: 'IN_APP_PATH';
	path: string;
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
	const navigate = useNavigate();
	const currentPath = getCurrentPath(location.pathname, location.search, location.hash);
	const [ dialogVisible, setDialogVisible ] = useState(false);
	const currentPathRef = useRef(currentPath);
	const whenRef = useRef(when);
	const guardArmedRef = useRef(false);
	const pendingNavigationRef = useRef<PendingNavigation | undefined>(undefined);

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
				pendingNavigationRef.current = {
					type: 'BROWSER_BACK'
				};
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

	useEffect(() => {
		const handleDocumentClick = (event: MouseEvent): void => {
			if(
				!whenRef.current ||
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.altKey ||
				event.ctrlKey ||
				event.shiftKey
			) {
				return;
			}

			const target = event.target;
			if(!(target instanceof Element)) {
				return;
			}

			// Intercept same-origin anchor navigation, including sidebar links rendered outside the guarded subtree.
			const linkElement = target.closest('a[href]');
			if(!(linkElement instanceof HTMLAnchorElement)) {
				return;
			}

			if((linkElement.target && linkElement.target !== '_self') || linkElement.hasAttribute('download')) {
				return;
			}

			const nextUrl = new URL(linkElement.href, window.location.href);
			if(nextUrl.origin !== window.location.origin) {
				return;
			}

			const nextPath = getCurrentPath(nextUrl.pathname, nextUrl.search, nextUrl.hash);
			if(nextPath === currentPathRef.current) {
				return;
			}

			event.preventDefault();
			pendingNavigationRef.current = {
				type: 'IN_APP_PATH',
				path: nextPath
			};
			setDialogVisible(true);
		};

		document.addEventListener('click', handleDocumentClick, true);

		return () => {
			document.removeEventListener('click', handleDocumentClick, true);
		};
	}, []);

	useBeforeUnload((event) => {
		if(!whenRef.current) {
			return;
		}

		event.preventDefault();
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
					const pendingNavigation = pendingNavigationRef.current;
					pendingNavigationRef.current = undefined;
					setDialogVisible(false);
					onConfirmLeave?.();

					if(!pendingNavigation || pendingNavigation.type === 'BROWSER_BACK') {
						window.history.back();
						return;
					}

					void navigate(pendingNavigation.path);
				}}
				onCancel={() => {
					const pendingNavigation = pendingNavigationRef.current;
					pendingNavigationRef.current = undefined;
					setDialogVisible(false);

					if(pendingNavigation?.type === 'BROWSER_BACK') {
						rearmGuard();
					}
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
};
