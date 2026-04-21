import { CSSProperties, ReactElement, useEffect, useId, useState } from 'react';
import { MOBILE_LAYOUT_BREAKPOINT } from 'app/utilities/layout';

const VIEWPORT_PADDING = 16;
const DESKTOP_OFFSET = 12;
const DEFAULT_POPOVER_WIDTH = 304;
const DEFAULT_SHEET_MAX_WIDTH = 420;
const MENU_HEADER_HEIGHT = 52;
const MENU_ACTION_HEIGHT = 58;

const getSheetStyle = (): CSSProperties => {
	return {
		'--responsive-action-menu-sheet-width': `${DEFAULT_SHEET_MAX_WIDTH}px`
	} as CSSProperties;
};

const getPopoverPlacement = (
	anchorRect: ResponsiveActionMenuAnchorRect | undefined,
	popoverHeight: number
): ResponsiveActionMenuPopoverPlacement => {
	if(!anchorRect) {
		return 'below';
	}

	return anchorRect.bottom + DESKTOP_OFFSET + popoverHeight > window.innerHeight - VIEWPORT_PADDING ?
		'above' :
		'below';
};

const getPopoverStyle = (
	anchorRect: ResponsiveActionMenuAnchorRect | undefined,
	popoverHeight: number,
	placement: ResponsiveActionMenuPopoverPlacement
): CSSProperties => {
	const sharedStyle = {
		'--responsive-action-menu-width': `${DEFAULT_POPOVER_WIDTH}px`,
		'--responsive-action-menu-sheet-width': `${DEFAULT_SHEET_MAX_WIDTH}px`
	} as CSSProperties;

	if(!anchorRect) {
		return {
			...sharedStyle,
			top: VIEWPORT_PADDING,
			right: VIEWPORT_PADDING
		};
	}

	const left = Math.min(
		Math.max(VIEWPORT_PADDING, anchorRect.right - DEFAULT_POPOVER_WIDTH),
		window.innerWidth - DEFAULT_POPOVER_WIDTH - VIEWPORT_PADDING
	);
	const top = placement === 'above' ?
		Math.max(VIEWPORT_PADDING, anchorRect.top - popoverHeight - DESKTOP_OFFSET) :
		Math.min(anchorRect.bottom + DESKTOP_OFFSET, window.innerHeight - popoverHeight - VIEWPORT_PADDING);

	return {
		...sharedStyle,
		top,
		left
	};
};

/**
 * Shared responsive shell for desktop popovers and mobile bottom sheets.
 * It keeps the same interaction model used by the category and media-item action menus.
 * @param props the input props
 * @returns the component
 */
export const ResponsiveActionMenuComponent = (props: ResponsiveActionMenuComponentProps): ReactElement | null => {
	const {
		visible,
		title,
		actions,
		anchorRect,
		closeAriaLabel,
		onClose,
		escapeDisabled
	} = props;
	const titleId = useId();
	const [ isMobileLayout, setIsMobileLayout ] = useState<boolean>(() => {
		return window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
	});
	const popoverHeight = MENU_HEADER_HEIGHT + (actions.length * MENU_ACTION_HEIGHT);
	const popoverPlacement = getPopoverPlacement(anchorRect, popoverHeight);

	useEffect(() => {
		if(!visible) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent): void => {
			if(event.key === 'Escape' && !escapeDisabled) {
				onClose();
			}
		};
		const handleResize = (): void => {
			const nextIsMobileLayout = window.innerWidth <= MOBILE_LAYOUT_BREAKPOINT;
			setIsMobileLayout((currentIsMobileLayout) => {
				return currentIsMobileLayout === nextIsMobileLayout ? currentIsMobileLayout : nextIsMobileLayout;
			});
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('resize', handleResize);
		};
	}, [ escapeDisabled, onClose, visible ]);

	if(!visible) {
		return null;
	}

	const content = (
		<>
			<header className='responsive-action-menu-header'>
				<h2 id={titleId} className='responsive-action-menu-title'>{title}</h2>
			</header>
			<div className='responsive-action-menu-actions'>
				{actions.map((action: ResponsiveActionMenuAction, index: number) => {
					const actionClassName = action.tone === 'danger' ?
						'responsive-action-menu-button responsive-action-menu-button-danger' :
						'responsive-action-menu-button';

					return (
						<button
							key={`${index}-${action.label}`}
							type='button'
							className={actionClassName}
							onClick={action.onClick}>
							{action.label}
						</button>
					);
				})}
			</div>
		</>
	);

	if(isMobileLayout) {
		return (
			<div className='responsive-action-menu-overlay' role='presentation' onClick={onClose}>
				<div
					className='responsive-action-menu responsive-action-menu-sheet'
					role='dialog'
					aria-modal={true}
					aria-labelledby={titleId}
					style={getSheetStyle()}
					onClick={(event) => {
						event.stopPropagation();
					}}>
					<div className='responsive-action-menu-handle' />
					{content}
				</div>
			</div>
		);
	}

	return (
		<div className='responsive-action-menu-layer' role='presentation'>
			<button
				type='button'
				className='responsive-action-menu-dismiss'
				onClick={onClose}
				aria-label={closeAriaLabel}
			/>
			<div
				className={`responsive-action-menu responsive-action-menu-popover responsive-action-menu-popover-${popoverPlacement}`}
				role='dialog'
				aria-modal={false}
				aria-labelledby={titleId}
				style={getPopoverStyle(anchorRect, popoverHeight, popoverPlacement)}>
				{content}
			</div>
		</div>
	);
};

export type ResponsiveActionMenuAnchorRect = {
	top: number;
	bottom: number;
	left: number;
	right: number;
	width: number;
	height: number;
};

export type ResponsiveActionMenuComponentProps = {
	visible: boolean;
	title: string;
	closeAriaLabel: string;
	onClose: () => void;
	actions: ResponsiveActionMenuAction[];
	anchorRect?: ResponsiveActionMenuAnchorRect;
	escapeDisabled?: boolean;
};

export type ResponsiveActionMenuAction = {
	label: string;
	onClick: () => void;
	tone?: 'default' | 'danger';
};

type ResponsiveActionMenuPopoverPlacement = 'above' | 'below';
