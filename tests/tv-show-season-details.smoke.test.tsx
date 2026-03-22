import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TvShowSeasonDetailsScreenComponent } from 'app/components/presentational/tv-show-season/details/screen';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

describe('TvShowSeasonDetailsScreenComponent', () => {
	test('renders the shared dark-shell layout and submits a valid season', async() => {
		const saveTvShowSeason = jest.fn();
		const notifyFormStatus = jest.fn();
		const { unmount } = render(
			<TvShowSeasonDetailsScreenComponent
				tvShowSeason={{
					number: undefined as unknown as number,
					episodesNumber: undefined,
					watchedEpisodesNumber: undefined
				}}
				addingNewSeason={true}
				saveTvShowSeason={saveTvShowSeason}
				notifyFormStatus={notifyFormStatus}
				goBack={jest.fn()}
			/>
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		expect(screen.getByRole('heading', { level: 1, name: i18n.t('tvShowSeason.details.title.new') })).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.basics') })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: i18n.t('common.sections.progress') })).not.toBeInTheDocument();
		expect(screen.getByText(i18n.t('tvShowSeason.list.emptyHint'))).toBeInTheDocument();

		const user = userEvent.setup();
		const numberInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.number'));
		const episodesInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.episodesNumber'));
		const watchedInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		expect(saveButton).toBeDisabled();

		await user.type(numberInput, '2');
		await user.type(episodesInput, '10');
		await user.type(watchedInput, '7');

		expect(screen.getByText(i18n.t('tvShowSeason.list.row.secondary', {
			episodesNumber: 10,
			watchedEpisodesNumber: 7
		}))).toBeInTheDocument();
		expect(saveButton).toBeEnabled();

		await user.click(saveButton);

		expect(saveTvShowSeason).toHaveBeenCalledWith({
			number: 2,
			episodesNumber: 10,
			watchedEpisodesNumber: 7
		} as TvShowSeasonInternal);
		expect(notifyFormStatus).toHaveBeenCalled();

		unmount();

		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
