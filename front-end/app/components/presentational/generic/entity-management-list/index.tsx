import { CSSProperties, ReactElement, ReactNode, useState } from 'react';
import { ResponsiveActionMenuAction, ResponsiveActionMenuAnchorRect, ResponsiveActionMenuComponent } from 'app/components/presentational/generic/responsive-action-menu';
import { i18n } from 'app/utilities/i18n';

const renderNoneOption = (noneOption: EntityManagementListNoneOption, selectedLabel: string | undefined): ReactElement => {
	return (
		<li
			className={`entity-management-list-row entity-management-list-row-standalone${noneOption.selected ? ' entity-management-list-row-selected' : ''}`}
			style={{ '--entity-management-row-accent': noneOption.accentColor } as CSSProperties}>
			<button
				type='button'
				className='entity-management-list-main entity-management-list-main-standalone'
				aria-pressed={noneOption.selected}
				onClick={noneOption.onSelect}>
				<span className={`entity-management-list-badge-shell${noneOption.badgeShellClassName || ''}`} aria-hidden={true}>
					{noneOption.badge}
				</span>
				<span className='entity-management-list-main-copy'>
					<span className='entity-management-list-name'>{noneOption.label}</span>
				</span>
				{noneOption.selected && <span className='entity-management-list-selection'>{selectedLabel}</span>}
			</button>
		</li>
	);
};

const renderSkeletonRows: <T>(props: EntityManagementListComponentProps<T>) => ReactNode = (props) => {
	const loadingRows = Array.from({ length: props.skeletonRowCount || 3 }, (_, index) => {
		return index;
	});

	return loadingRows.map((loadingRow) => {
		return (
			<li
				key={`${props.skeletonKeyPrefix}-${loadingRow}`}
				className='entity-management-list-row entity-management-list-skeleton-row'
				style={{ '--entity-management-row-accent': props.skeletonAccentColor } as CSSProperties}
				aria-hidden={true}>
				<div className='entity-management-list-main'>
					<span className={`entity-management-list-badge-shell list-skeleton-block entity-management-list-skeleton-badge-shell${props.skeletonBadgeShellClassName || ''}`}>
						<span className='list-skeleton-block entity-management-list-skeleton-badge' />
					</span>
					<span className='entity-management-list-main-copy'>
						<span className='list-skeleton-block entity-management-list-skeleton-title' />
					</span>
					<span className='entity-management-list-selection list-skeleton-block entity-management-list-skeleton-pill' />
				</div>
				<div className='entity-management-list-options'>
					<span className='list-skeleton-block entity-management-list-skeleton-options-icon' />
				</div>
			</li>
		);
	});
};

/**
 * Shared selectable list used by the group, own platform and TV show season management screens.
 * Each row exposes its actions via the shared responsive action menu.
 * @param props the input props
 * @returns the component
 */
export const EntityManagementListComponent: <T>(props: EntityManagementListComponentProps<T>) => ReactElement = (props) => {
	const [ openMenu, setOpenMenu ] = useState<EntityManagementListOpenMenu | undefined>(undefined);
	const selectable = Boolean(props.selectedLabel);
	const menuItem = openMenu ?
		props.items.find((item) => {
			return props.getItemKey(item) === openMenu.itemKey;
		}) :
		undefined;
	const closeMenu = (): void => {
		setOpenMenu(undefined);
	};
	let listContent: ReactNode;

	if(props.showSkeletons) {
		listContent = (
			<ul className='entity-management-list-items'>
				{props.noneOption && renderNoneOption(props.noneOption, props.selectedLabel)}
				{renderSkeletonRows(props)}
			</ul>
		);
	}
	else {
		listContent = (
			<ul className='entity-management-list-items'>
				{props.noneOption && renderNoneOption(props.noneOption, props.selectedLabel)}
				{props.items.map((item) => {
					const itemName = props.getItemName(item);
					const itemKey = props.getItemKey(item);
					const selected = itemKey === props.selectedItemId;
					const highlighted = itemKey === openMenu?.itemKey;
					const badgeShellClassName = props.getBadgeShellClassName ? props.getBadgeShellClassName(item) : '';

					return (
						<li
							key={itemKey}
							className={`entity-management-list-row${selected ? ' entity-management-list-row-selected' : ''}${highlighted ? ' entity-management-list-row-highlighted' : ''}`}
							style={{ '--entity-management-row-accent': props.getItemAccentColor(item) } as CSSProperties}>
							<button
								type='button'
								className='entity-management-list-main'
								aria-pressed={selectable ? selected : undefined}
								onClick={() => {
									props.onSelect(item);
								}}>
								<span className={`entity-management-list-badge-shell${badgeShellClassName}`} aria-hidden={true}>
									{props.renderItemBadge(item)}
								</span>
								<span className='entity-management-list-main-copy'>
									<span className='entity-management-list-name'>{itemName}</span>
									{props.renderItemMeta && props.renderItemMeta(item)}
								</span>
								{selected && <span className='entity-management-list-selection'>{props.selectedLabel}</span>}
							</button>
							<button
								type='button'
								className='entity-management-list-options'
								onClick={(event) => {
									const buttonRect = event.currentTarget.getBoundingClientRect();

									setOpenMenu({
										itemKey: itemKey,
										anchorRect: {
											top: buttonRect.top,
											bottom: buttonRect.bottom,
											left: buttonRect.left,
											right: buttonRect.right,
											width: buttonRect.width,
											height: buttonRect.height
										}
									});
								}}
								aria-label={i18n.t('common.a11y.optionsFor', { name: itemName })}>
								<span className='entity-management-list-options-icon' aria-hidden={true}>...</span>
							</button>
						</li>
					);
				})}
			</ul>
		);
	}

	return (
		<div className='entity-management-list' aria-busy={props.showSkeletons}>
			{listContent}
			{props.showEmptyState &&
				<div className='entity-management-list-empty'>
					<p className='entity-management-list-empty-title'>{props.emptyTitle}</p>
					<p className='entity-management-list-empty-copy'>{props.emptyCopy}</p>
				</div>}
			{menuItem && (
				<ResponsiveActionMenuComponent
					visible={true}
					anchorRect={openMenu?.anchorRect}
					title={props.getItemName(menuItem)}
					closeAriaLabel={props.menuCloseAriaLabel}
					onClose={closeMenu}
					actions={props.getItemActions(menuItem, closeMenu)}
				/>
			)}
		</div>
	);
};

export type EntityManagementListComponentProps<T> = {
	items: T[];
	menuCloseAriaLabel: string;
	emptyTitle: string;
	emptyCopy: string;
	showEmptyState: boolean;
	showSkeletons: boolean;
	getItemKey: (item: T) => string;
	getItemName: (item: T) => string;
	getItemAccentColor: (item: T) => string;
	renderItemBadge: (item: T) => ReactNode;
	getItemActions: (item: T, closeMenu: () => void) => ResponsiveActionMenuAction[];
	onSelect: (item: T) => void;
	getBadgeShellClassName?: (item: T) => string;
	renderItemMeta?: (item: T) => ReactNode;
	noneOption?: EntityManagementListNoneOption;
	selectedLabel?: string;
	selectedItemId?: string;
	skeletonRowCount?: number;
	skeletonAccentColor?: string;
	skeletonBadgeShellClassName?: string;
	skeletonKeyPrefix?: string;
};

type EntityManagementListNoneOption = {
	label: string;
	badge: ReactNode;
	accentColor: string;
	selected: boolean;
	onSelect: () => void;
	badgeShellClassName?: string;
};

type EntityManagementListOpenMenu = {
	itemKey: string;
	anchorRect: ResponsiveActionMenuAnchorRect;
};
