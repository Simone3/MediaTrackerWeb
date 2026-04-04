import { CSSProperties, ReactElement, ReactNode } from 'react';
import { i18n } from 'app/utilities/i18n';

const renderNoneOption = (noneOption: EntityManagementListNoneOption, selectedLabel: string): ReactElement => {
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
				<div className='entity-management-list-actions'>
					<span className='entity-management-list-action list-skeleton-block entity-management-list-skeleton-action' />
					<span className='entity-management-list-action list-skeleton-block entity-management-list-skeleton-action' />
				</div>
			</li>
		);
	});
};

/**
 * Shared selectable list used by the group and own-platform management screens.
 * @param props the input props
 * @returns the component
 */
export const EntityManagementListComponent: <T>(props: EntityManagementListComponentProps<T>) => ReactElement = (props) => {
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
					const badgeShellClassName = props.getBadgeShellClassName ? props.getBadgeShellClassName(item) : '';

					return (
						<li
							key={itemKey}
							className={`entity-management-list-row${selected ? ' entity-management-list-row-selected' : ''}`}
							style={{ '--entity-management-row-accent': props.getItemAccentColor(item) } as CSSProperties}>
							<button
								type='button'
								className='entity-management-list-main'
								aria-pressed={selected}
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
							<div className='entity-management-list-actions'>
								<button
									type='button'
									className='entity-management-list-action'
									onClick={() => {
										props.onEdit(item);
									}}
									aria-label={i18n.t('common.a11y.edit', { name: itemName })}>
									{props.editLabel}
								</button>
								<button
									type='button'
									className='entity-management-list-action entity-management-list-action-danger'
									onClick={() => {
										props.onDelete(item);
									}}
									aria-label={i18n.t('common.a11y.delete', { name: itemName })}>
									{props.deleteLabel}
								</button>
							</div>
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
		</div>
	);
};

export type EntityManagementListComponentProps<T> = {
	items: T[];
	selectedLabel: string;
	editLabel: string;
	deleteLabel: string;
	emptyTitle: string;
	emptyCopy: string;
	showEmptyState: boolean;
	showSkeletons: boolean;
	getItemKey: (item: T) => string;
	getItemName: (item: T) => string;
	getItemAccentColor: (item: T) => string;
	renderItemBadge: (item: T) => ReactNode;
	onSelect: (item: T) => void;
	onEdit: (item: T) => void;
	onDelete: (item: T) => void;
	getBadgeShellClassName?: (item: T) => string;
	renderItemMeta?: (item: T) => ReactNode;
	noneOption?: EntityManagementListNoneOption;
	selectedItemId?: string;
	skeletonRowCount?: number;
	skeletonAccentColor: string;
	skeletonBadgeShellClassName?: string;
	skeletonKeyPrefix: string;
};

type EntityManagementListNoneOption = {
	label: string;
	badge: ReactNode;
	accentColor: string;
	selected: boolean;
	onSelect: () => void;
	badgeShellClassName?: string;
};
