import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CategoryContextMenuComponent } from 'app/components/presentational/category/list/context-menu';
import { CategoryInternal } from 'app/data/models/internal/category';
import { i18n } from 'app/utilities/i18n';

describe('CategoryContextMenuComponent', () => {
	const category: CategoryInternal = {
		id: 'category-id',
		name: 'My Books',
		mediaType: 'BOOK',
		color: '#3f51b5'
	};
	const anchorRect = {
		top: 24,
		bottom: 56,
		left: 120,
		right: 152,
		width: 32,
		height: 32
	};

	test('edits a category from the popup', async() => {
		const edit = jest.fn();
		const deleteCallback = jest.fn();
		const close = jest.fn();

		render(
			<CategoryContextMenuComponent
				category={category}
				anchorRect={anchorRect}
				edit={edit}
				delete={deleteCallback}
				close={close}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('category.list.edit') }));

		expect(edit).toHaveBeenCalledWith(category);
		expect(deleteCallback).not.toHaveBeenCalled();
		expect(close).toHaveBeenCalledTimes(1);
		expect(screen.queryByText(i18n.t('category.mediaTypes.BOOK'))).not.toBeInTheDocument();
	});

	test('asks confirmation before deleting a category', async() => {
		const edit = jest.fn();
		const deleteCallback = jest.fn();
		const close = jest.fn();

		render(
			<CategoryContextMenuComponent
				category={category}
				anchorRect={anchorRect}
				edit={edit}
				delete={deleteCallback}
				close={close}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: i18n.t('category.list.delete') }));

		expect(screen.getByText(i18n.t('category.common.alert.delete.title'))).toBeInTheDocument();
		expect(deleteCallback).not.toHaveBeenCalled();

		await user.click(screen.getByRole('button', { name: i18n.t('common.alert.default.okButton') }));

		expect(deleteCallback).toHaveBeenCalledWith(category);
		expect(edit).not.toHaveBeenCalled();
		expect(close).toHaveBeenCalledTimes(1);
	});
});
