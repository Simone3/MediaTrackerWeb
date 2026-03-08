import { put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { compareTvShowSeasons } from 'app/data/models/internal/media-items/tv-show';
import { setError } from 'app/redux/actions/error/generators';
import { DELETE_TV_SHOW_SEASON } from 'app/redux/actions/tv-show-season/const';
import { completeDeletingTvShowSeason } from 'app/redux/actions/tv-show-season/generators';
import { DeleteTvShowSeasonAction } from 'app/redux/actions/tv-show-season/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that deletes a TV show season
 * @param action the intercepted action
 */
const deleteTvShowSeasonSaga = function * (action: DeleteTvShowSeasonAction): SagaIterator {

	const season = action.tvShowSeason;

	// Get values from state
	const state: State = yield select();
	let seasons = state.tvShowSeasonsList.tvShowSeasons;
	if(!seasons) {

		throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while deleting TV show season');
	}
	seasons = [ ...seasons ];

	// Find the season in the state
	const index = seasons.findIndex((existingSeason) => {
		return existingSeason.number === season.number;
	});

	// Season must exist
	if(index < 0) {

		yield put(setError(AppError.GENERIC.withDetails('Season not found')));
		return;
	}

	// Remove the season
	seasons.splice(index, 1);

	// Load the new list of TV show seasons
	yield put(completeDeletingTvShowSeason(seasons.sort(compareTvShowSeasons)));
};

/**
 * Watcher saga that reacts to the TV show season delete actions
 */
export const watchDeleteTvShowSeasonSaga = function * (): SagaIterator {

	yield takeLatest(DELETE_TV_SHOW_SEASON, deleteTvShowSeasonSaga);
};
