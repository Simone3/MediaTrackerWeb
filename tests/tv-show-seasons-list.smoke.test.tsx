import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TvShowSeasonsListScreenComponent } from 'app/components/presentational/tv-show-season/list/screen';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';

describe('TvShowSeasonsListScreenComponent', () => {
	test('supports editing, completion, deletion, and finishing the flow', async() => {
		const tvShowSeasons: TvShowSeasonInternal[] = [
			{
				number: 1,
				episodesNumber: 8,
				watchedEpisodesNumber: 8
			},
			{
				number: 2,
				episodesNumber: 10,
				watchedEpisodesNumber: 4
			}
		];
		const editTvShowSeason = jest.fn();
		const deleteTvShowSeason = jest.fn();
		const completeTvShowSeason = jest.fn();
		const completeHandling = jest.fn();

		render(
			<TvShowSeasonsListScreenComponent
				tvShowSeasons={tvShowSeasons}
				loadNewTvShowSeasonDetails={jest.fn()}
				editTvShowSeason={editTvShowSeason}
				deleteTvShowSeason={deleteTvShowSeason}
				completeTvShowSeason={completeTvShowSeason}
				completeHandling={completeHandling}
				goBack={jest.fn()}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByText('Season 2'));
		await user.click(screen.getAllByRole('button', { name: 'Complete season' })[1]);
		await user.click(screen.getAllByRole('button', { name: 'Delete season' })[1]);
		expect(deleteTvShowSeason).toHaveBeenCalledTimes(0);
		await user.click(screen.getByRole('button', { name: 'OK' }));
		await user.click(screen.getByRole('button', { name: 'Done' }));

		expect(editTvShowSeason).toHaveBeenCalledWith(tvShowSeasons[1]);
		expect(completeTvShowSeason).toHaveBeenCalledWith(tvShowSeasons[1]);
		expect(deleteTvShowSeason).toHaveBeenCalledWith(tvShowSeasons[1]);
		expect(completeHandling).toHaveBeenCalledTimes(1);
	});
});
