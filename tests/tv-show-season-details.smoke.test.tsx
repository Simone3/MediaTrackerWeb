import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TvShowSeasonDetailsScreenComponent } from 'app/components/presentational/tv-show-season/details/screen';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';

describe('TvShowSeasonDetailsScreenComponent', () => {
	test('renders the shared dark-shell layout and submits a valid season', async() => {
		const saveTvShowSeason = jest.fn();
		const notifyFormStatus = jest.fn();
		render(
			<MemoryRouter>
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
			</MemoryRouter>
		);

		expect(screen.getByRole('heading', { level: 1, name: i18n.t('tvShowSeason.details.title.new') })).toBeInTheDocument();
		expect(screen.queryAllByRole('heading', { level: 2 })).toHaveLength(0);
		expect(screen.getByText(i18n.t('tvShowSeason.details.subtitle.new'))).toBeInTheDocument();

		const user = userEvent.setup();
		const numberInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.number'));
		const episodesInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.episodesNumber'));
		const watchedInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await waitFor(() => {
			expect(saveButton).toBeDisabled();
		});

		await user.type(numberInput, '2');
		await user.type(episodesInput, '10');
		await user.type(watchedInput, '7');

		await waitFor(() => {
			expect(saveButton).toBeEnabled();
		});

		await user.click(saveButton);

		expect(saveTvShowSeason).toHaveBeenCalledWith({
			number: 2,
			episodesNumber: 10,
			watchedEpisodesNumber: 7
		} as TvShowSeasonInternal);
		expect(notifyFormStatus).toHaveBeenCalled();
	});

	test('keeps season number locked when editing an existing season', async() => {
		const saveTvShowSeason = jest.fn();
		const season: TvShowSeasonInternal = {
			number: 2,
			episodesNumber: 10,
			watchedEpisodesNumber: 7
		};

		render(
			<MemoryRouter>
				<TvShowSeasonDetailsScreenComponent
					tvShowSeason={season}
					addingNewSeason={false}
					saveTvShowSeason={saveTvShowSeason}
					notifyFormStatus={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		const user = userEvent.setup();
		const numberInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.number'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		expect(numberInput).toBeDisabled();
		await waitFor(() => {
			expect(saveButton).toBeEnabled();
		});

		await user.click(saveButton);

		expect(saveTvShowSeason).toHaveBeenCalledWith(season);
	});

	test('keeps Save disabled when watched episodes exceed total episodes', async() => {
		const saveTvShowSeason = jest.fn();
		render(
			<MemoryRouter>
				<TvShowSeasonDetailsScreenComponent
					tvShowSeason={{
						number: undefined as unknown as number,
						episodesNumber: undefined,
						watchedEpisodesNumber: undefined
					}}
					addingNewSeason={true}
					saveTvShowSeason={saveTvShowSeason}
					notifyFormStatus={jest.fn()}
					goBack={jest.fn()}
				/>
			</MemoryRouter>
		);

		const user = userEvent.setup();
		const numberInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.number'));
		const episodesInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.episodesNumber'));
		const watchedInput = screen.getByLabelText(i18n.t('tvShowSeason.details.placeholders.watchedEpisodesNumber'));
		const saveButton = screen.getByRole('button', { name: i18n.t('common.buttons.save') });

		await user.type(numberInput, '2');
		await user.type(episodesInput, '10');
		await user.type(watchedInput, '12');

		await waitFor(() => {
			expect(saveButton).toBeDisabled();
		});

		await user.click(saveButton);

		expect(saveTvShowSeason).not.toHaveBeenCalled();
	});
});
