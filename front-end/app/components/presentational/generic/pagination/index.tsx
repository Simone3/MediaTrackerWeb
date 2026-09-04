import { ReactElement } from 'react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { SelectComponent } from 'app/components/presentational/generic/select';
import { i18n } from 'app/utilities/i18n';

/**
 * Shared page navigation for a paginated list: a step either way, plus a picker that doubles as the position
 * indicator, so its closed state reads as the sentence it replaces. Renders nothing when everything fits on a
 * single page, since page controls the user cannot act on are just noise
 * @param props the input props
 * @returns the component
 */
export const PaginationComponent = (props: PaginationComponentProps): ReactElement | null => {
	const {
		currentPage,
		totalPages,
		disabled,
		goToPage
	} = props;

	if(totalPages <= 1) {
		return null;
	}

	const isFirstPage = currentPage <= 0;
	const isLastPage = currentPage >= totalPages - 1;
	const pages = Array.from({ length: totalPages }, (_, index) => {
		return index;
	});

	return (
		<nav className='pagination' aria-label={i18n.t('common.pagination.label')}>
			<PillButtonComponent
				tone='secondary'
				size='compact'
				appearance='subtle'
				className='pagination-button'
				disabled={disabled || isFirstPage}
				onClick={() => {
					goToPage(currentPage - 1);
				}}>
				{i18n.t('common.pagination.previous')}
			</PillButtonComponent>
			<SelectComponent
				className='pagination-select'
				aria-label={i18n.t('common.pagination.goToPage')}
				value={currentPage}
				disabled={disabled}
				onChangeValue={(value) => {
					goToPage(Number(value));
				}}>
				{pages.map((page) => {
					return (
						<option key={page} value={page}>
							{i18n.t('common.pagination.position', {
								current: page + 1,
								total: totalPages
							})}
						</option>
					);
				})}
			</SelectComponent>
			<PillButtonComponent
				tone='secondary'
				size='compact'
				appearance='subtle'
				className='pagination-button'
				disabled={disabled || isLastPage}
				onClick={() => {
					goToPage(currentPage + 1);
				}}>
				{i18n.t('common.pagination.next')}
			</PillButtonComponent>
		</nav>
	);
};

/**
 * PaginationComponent's props
 */
export type PaginationComponentProps = {
	/**
	 * The zero-based index of the currently displayed page
	 */
	currentPage: number;

	/**
	 * The total number of pages
	 */
	totalPages: number;

	/**
	 * Whether the controls are currently inert, e.g. while a page is loading
	 */
	disabled: boolean;

	/**
	 * Callback to move to another page, receiving its zero-based index
	 */
	goToPage: (page: number) => void;
};
