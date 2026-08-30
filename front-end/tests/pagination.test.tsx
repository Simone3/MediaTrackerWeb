import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaginationComponent } from 'app/components/presentational/generic/pagination';
import { i18n } from 'app/utilities/i18n';

describe('PaginationComponent', () => {
	test('renders nothing when everything fits on a single page', () => {
		const { container } = render(
			<PaginationComponent
				currentPage={0}
				totalPages={1}
				disabled={false}
				goToPage={jest.fn()}
			/>
		);

		expect(container).toBeEmptyDOMElement();
	});

	test('moves to the next page and blocks going back from the first one', async() => {
		const goToPage = jest.fn();

		render(
			<PaginationComponent
				currentPage={0}
				totalPages={4}
				disabled={false}
				goToPage={goToPage}
			/>
		);

		expect(screen.getByRole('combobox', { name: i18n.t('common.pagination.goToPage') })).toHaveDisplayValue(i18n.t('common.pagination.position', { current: 1, total: 4 }));
		expect(screen.getByRole('button', { name: i18n.t('common.pagination.previous') })).toBeDisabled();

		const user = userEvent.setup();

		await user.click(screen.getByRole('button', { name: i18n.t('common.pagination.next') }));

		expect(goToPage).toHaveBeenCalledWith(1);
	});

	test('moves to the previous page and blocks going forward from the last one', async() => {
		const goToPage = jest.fn();

		render(
			<PaginationComponent
				currentPage={3}
				totalPages={4}
				disabled={false}
				goToPage={goToPage}
			/>
		);

		expect(screen.getByRole('button', { name: i18n.t('common.pagination.next') })).toBeDisabled();

		const user = userEvent.setup();

		await user.click(screen.getByRole('button', { name: i18n.t('common.pagination.previous') }));

		expect(goToPage).toHaveBeenCalledWith(2);
	});

	test('jumps straight to a chosen page and offers one option per page', async() => {
		const goToPage = jest.fn();

		render(
			<PaginationComponent
				currentPage={0}
				totalPages={7}
				disabled={false}
				goToPage={goToPage}
			/>
		);

		const picker = screen.getByRole('combobox', { name: i18n.t('common.pagination.goToPage') });

		expect(screen.getAllByRole('option')).toHaveLength(7);

		const user = userEvent.setup();

		await user.selectOptions(picker, i18n.t('common.pagination.position', { current: 5, total: 7 }));

		expect(goToPage).toHaveBeenCalledWith(4);
	});

	test('turns both controls inert while a page is loading', () => {
		render(
			<PaginationComponent
				currentPage={1}
				totalPages={4}
				disabled={true}
				goToPage={jest.fn()}
			/>
		);

		expect(screen.getByRole('button', { name: i18n.t('common.pagination.previous') })).toBeDisabled();
		expect(screen.getByRole('button', { name: i18n.t('common.pagination.next') })).toBeDisabled();
		expect(screen.getByRole('combobox', { name: i18n.t('common.pagination.goToPage') })).toBeDisabled();
	});
});
