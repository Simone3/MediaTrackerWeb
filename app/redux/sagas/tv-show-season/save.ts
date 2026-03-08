import { put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { compareTvShowSeasons } from 'app/data/models/internal/media-items/tv-show';
import { setError } from 'app/redux/actions/error/generators';
import { SAVE_TV_SHOW_SEASON } from 'app/redux/actions/tv-show-season/const';
import { completeSavingTvShowSeason, failSavingTvShowSeason } from 'app/redux/actions/tv-show-season/generators';
import { SaveTvShowSeasonAction } from 'app/redux/actions/tv-show-season/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that saves a TV show season
 * @param action the intercepted action
 */
const saveTvShowSeasonSaga = function * (action: SaveTvShowSeasonAction): SagaIterator {

	const season = action.tvShowSeason;

	// Get values from state
	const state: State = yield select();
	const saveMode = state.tvShowSeasonDetails.formMode;
	let seasons = state.tvShowSeasonsList.tvShowSeasons;
	if(!saveMode || !seasons) {

		throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while saving TV show season');
	}
	seasons = [ ...seasons ];

	// Find the season in the state
	const index = seasons.findIndex((existingSeason) => {
		return existingSeason.number === season.number;
	});

	if(saveMode === 'NEW') {

		// If we are adding a new season, make sure there are no other seasons with the same number
		if(index >= 0) {

			yield put(setError(AppError.TV_SHOW_SEASON_SAME_NUMBER));
			yield put(failSavingTvShowSeason());
			return;
		}

		// Add the new season
		seasons.push(season);
	}
	else if(saveMode === 'EXISTING') {

		// If we are updating an existing season, the season must exist
		if(index < 0) {

			yield put(setError(AppError.GENERIC.withDetails('Season not found')));
			yield put(failSavingTvShowSeason());
			return;
		}

		// Update the season
		seasons[index] = season;
	}

	// Load the new list of TV show seasons
	yield put(completeSavingTvShowSeason(seasons.sort(compareTvShowSeasons)));
};

/**
 * Watcher saga that reacts to the TV show season save actions
 */
export const watchSaveTvShowSeasonSaga = function * (): SagaIterator {

	yield takeLatest(SAVE_TV_SHOW_SEASON, saveTvShowSeasonSaga);
};
