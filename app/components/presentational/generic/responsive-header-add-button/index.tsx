import { ReactElement, useEffect, useState } from 'react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { MOBILE_LAYOUT_BREAKPOINT } from 'app/utilities/layout';

const getIsMobileLayout = (): boolean => {
	if(typeof window === 'undefined') {
		return false;
	}

	return window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
};

/**
 * Shared add button used in authenticated page headers.
 * It keeps the descriptive desktop label while shortening to a compact mobile label.
 * @param props the input props
 * @returns the component
 */
export const ResponsiveHeaderAddButtonComponent = (props: ResponsiveHeaderAddButtonComponentProps): ReactElement => {
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

	return (
		<PillButtonComponent tone='secondary' size='compact' onClick={props.onClick}>
			{isMobileLayout ? props.mobileLabel : props.label}
		</PillButtonComponent>
	);
};

export type ResponsiveHeaderAddButtonComponentProps = {
	label: string;
	mobileLabel: string;
	onClick: () => void;
};
