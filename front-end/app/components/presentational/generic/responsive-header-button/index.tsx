import { ReactElement } from 'react';
import { PillButtonComponent, PillButtonAppearance } from 'app/components/presentational/generic/pill-button';
import { useIsMobileLayout } from 'app/utilities/layout';

/**
 * Shared action button used in authenticated page headers.
 * It keeps the descriptive desktop label while shortening to a compact mobile label, where the header has no room for a phrase.
 * @param props the input props
 * @returns the component
 */
export const ResponsiveHeaderButtonComponent = (props: ResponsiveHeaderButtonComponentProps): ReactElement => {
	const isMobileLayout = useIsMobileLayout();

	return (
		<PillButtonComponent
			tone='secondary'
			size='compact'
			appearance={props.appearance}
			onClick={props.onClick}>
			{isMobileLayout ? props.mobileLabel : props.label}
		</PillButtonComponent>
	);
};

export type ResponsiveHeaderButtonComponentProps = {
	label: string;
	mobileLabel: string;
	appearance?: PillButtonAppearance;
	onClick: () => void;
};
