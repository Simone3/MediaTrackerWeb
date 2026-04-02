import { BookInternal } from 'app/data/models/internal/media-items/book';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';

export const getBookCreatorNames = (mediaItem: BookInternal): string[] | undefined => {
	return mediaItem.authors;
};

export const getBookDurationValue = (mediaItem: BookInternal): number | undefined => {
	return mediaItem.pagesNumber;
};

export const getMovieCreatorNames = (mediaItem: MovieInternal): string[] | undefined => {
	return mediaItem.directors;
};

export const getMovieDurationValue = (mediaItem: MovieInternal): number | undefined => {
	return mediaItem.durationMinutes;
};

export const getTvShowCreatorNames = (mediaItem: TvShowInternal): string[] | undefined => {
	return mediaItem.creators;
};

export const getTvShowDurationValue = (mediaItem: TvShowInternal): number | undefined => {
	return mediaItem.averageEpisodeRuntimeMinutes;
};

export const getVideogameCreatorNames = (mediaItem: VideogameInternal): string[] | undefined => {
	return mediaItem.developers;
};

export const getVideogameDurationValue = (mediaItem: VideogameInternal): number | undefined => {
	return mediaItem.averageLengthHours;
};
