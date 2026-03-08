import { put, select, takeLatest } from '@redux-saga/core/effects';
import { AppError } from 'app/data/models/internal/error';
import { compareTvShowSeasons } from 'app/data/models/internal/media-items/tv-show';
import { setError } from 'app/redux/actions/error/generators';
import { INLINE_UPDATE_TV_SHOW_SEASON } from 'app/redux/actions/tv-show-season/const';
import { completeInlineUpdatingTvShowSeason } from 'app/redux/actions/tv-show-season/generators';
import { InlineUpdateTvShowSeasonAction } from 'app/redux/actions/tv-show-season/types';
import { State } from 'app/redux/state/state';
import { SagaIterator } from 'redux-saga';

/**
 * Worker saga that updates inline a TV show season
 * @param action the intercepted action
 */
const inlineUpdateTvShowSeasonSaga = function * (action: InlineUpdateTvShowSeasonAction): SagaIterator {

	const season = action.tvShowSeason;

	// Get values from state
	const state: State = yield select();
	let seasons = state.tvShowSeasonsList.tvShowSeasons;
	if(!seasons) {

		throw AppError.GENERIC.withDetails('Something went wrong during state initialization: cannot find values while updating TV show season');
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

	// Update the season
	seasons[index] = season;

	// Load the new list of TV show seasons
	yield put(completeInlineUpdatingTvShowSeason(seasons.sort(compareTvShowSeasons)));
};

/**
 * Watcher saga that reacts to the TV show season inline update actions
 */
export const watchInlineUpdateTvShowSeasonSaga = function * (): SagaIterator {

	yield takeLatest(INLINE_UPDATE_TV_SHOW_SEASON, inlineUpdateTvShowSeasonSaga);
};
