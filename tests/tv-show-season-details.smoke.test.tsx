import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TvShowSeasonDetailsScreenComponent } from 'app/components/presentational/tv-show-season/details/screen';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

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
		expect(screen.getByRole('heading', { level: 1, name: 'New Season' })).toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Basics' })).not.toBeInTheDocument();
		expect(screen.queryByRole('heading', { level: 2, name: 'Progress' })).not.toBeInTheDocument();
		expect(screen.getByText('Add seasons to keep track of episode progress')).toBeInTheDocument();

		const user = userEvent.setup();
		const numberInput = screen.getByLabelText('Season number');
		const episodesInput = screen.getByLabelText('Number of episodes');
		const watchedInput = screen.getByLabelText('Number of watched episodes');
		const saveButton = screen.getByRole('button', { name: 'Save' });

		expect(saveButton).toBeDisabled();

		await user.type(numberInput, '2');
		await user.type(episodesInput, '10');
		await user.type(watchedInput, '7');

		expect(screen.getByText('Watched 7 out of 10 episodes')).toBeInTheDocument();
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
