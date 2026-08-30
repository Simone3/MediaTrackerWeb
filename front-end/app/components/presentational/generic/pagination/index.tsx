import { ReactElement } from 'react';
import { PillButtonComponent } from 'app/components/presentational/generic/pill-button';
import { i18n } from 'app/utilities/i18n';

/**
 * Shared page navigation for a paginated list. Renders nothing when everything fits on a single page,
 * since page controls the user cannot act on are just noise
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
			<span className='pagination-position' aria-live='polite'>
				{i18n.t('common.pagination.position', {
					current: currentPage + 1,
					total: totalPages
				})}
			</span>
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
