import { CSSProperties, ReactElement, ReactNode, useEffect, useState } from 'react';
import { CATEGORIES_MOBILE_BREAKPOINT } from 'app/components/presentational/category/list/constants';

const VIEWPORT_PADDING = 16;
const DESKTOP_OFFSET = 12;

const getSheetStyle = (sheetMaxWidth?: number): CSSProperties => {
	return {
		'--responsive-action-menu-sheet-width': `${sheetMaxWidth || 420}px`
	} as CSSProperties;
};

const getPopoverStyle = (
	anchorRect: ResponsiveActionMenuAnchorRect | undefined,
	popoverWidth: number,
	popoverHeight: number,
	sheetMaxWidth: number | undefined
): CSSProperties => {
	const sharedStyle = {
		'--responsive-action-menu-width': `${popoverWidth}px`,
		'--responsive-action-menu-sheet-width': `${sheetMaxWidth || 420}px`
	} as CSSProperties;

	if(!anchorRect) {
		return {
			...sharedStyle,
			top: VIEWPORT_PADDING,
			right: VIEWPORT_PADDING
		};
	}

	const left = Math.min(
		Math.max(VIEWPORT_PADDING, anchorRect.right - popoverWidth),
		window.innerWidth - popoverWidth - VIEWPORT_PADDING
	);
	const openAbove = anchorRect.bottom + DESKTOP_OFFSET + popoverHeight > window.innerHeight - VIEWPORT_PADDING;
	const top = openAbove ?
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
		anchorRect,
		labelledBy,
		closeAriaLabel,
		onClose,
		popoverWidth,
		popoverHeight,
		popoverClassName,
		sheetClassName,
		layerClassName,
		dismissClassName,
		overlayClassName,
		handleClassName,
		escapeDisabled,
		children
	} = props;
	const [ isMobileLayout, setIsMobileLayout ] = useState<boolean>(() => {
		return window.innerWidth <= CATEGORIES_MOBILE_BREAKPOINT;
	});

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
			const nextIsMobileLayout = window.innerWidth <= CATEGORIES_MOBILE_BREAKPOINT;
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

	if(isMobileLayout) {
		return (
			<div className={overlayClassName} role='presentation' onClick={onClose}>
				<div
					className={sheetClassName}
					role='dialog'
					aria-modal={true}
					aria-labelledby={labelledBy}
					style={getSheetStyle(props.sheetMaxWidth)}
					onClick={(event) => {
						event.stopPropagation();
					}}>
					<div className={handleClassName} />
					{children}
				</div>
			</div>
		);
	}

	return (
		<div className={layerClassName} role='presentation'>
			<button
				type='button'
				className={dismissClassName}
				onClick={onClose}
				aria-label={closeAriaLabel}
			/>
			<div
				className={popoverClassName}
				role='dialog'
				aria-modal={false}
				aria-labelledby={labelledBy}
				style={getPopoverStyle(anchorRect, popoverWidth, popoverHeight, props.sheetMaxWidth)}>
				{children}
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
	labelledBy: string;
	closeAriaLabel: string;
	onClose: () => void;
	popoverWidth: number;
	popoverHeight: number;
	layerClassName: string;
	dismissClassName: string;
	overlayClassName: string;
	popoverClassName: string;
	sheetClassName: string;
	handleClassName: string;
	children: ReactNode;
	anchorRect?: ResponsiveActionMenuAnchorRect;
	escapeDisabled?: boolean;
	sheetMaxWidth?: number;
};
