import { useEffect, useState } from 'react';

/**
 * The viewport width, in pixels, at or below which the interface switches to its mobile layout. It is the single breakpoint of the
 * application: the stylesheet media queries and every piece of responsive JavaScript agree on this number
 */
export const MOBILE_LAYOUT_BREAKPOINT = 960;

/**
 * Helper to read the current layout off the viewport, defensive about a missing window so that it can run outside the browser
 * @returns true if the viewport is currently at or below the mobile breakpoint
 */
const getIsMobileLayout = (): boolean => {
	if(typeof window === 'undefined') {
		return false;
	}

	return window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
};

/**
 * Hook that tells if the mobile layout is active and keeps up with the viewport as it is resized. It is how a component branches on
 * the breakpoint when behaviour, and not just appearance, has to change: appearance alone belongs in the stylesheet
 * @returns true while the viewport is at or below MOBILE_LAYOUT_BREAKPOINT
 */
export const useIsMobileLayout = (): boolean => {
	const [ isMobileLayout, setIsMobileLayout ] = useState<boolean>(() => {
		return getIsMobileLayout();
	});

	useEffect(() => {
		const handleResize = (): void => {
			const nextIsMobileLayout = getIsMobileLayout();

			setIsMobileLayout((currentIsMobileLayout) => {
				return currentIsMobileLayout === nextIsMobileLayout ? currentIsMobileLayout : nextIsMobileLayout;
			});
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return isMobileLayout;
};
