import { MediaTypeInternal } from 'app/data/models/internal/category';
import { AppError } from 'app/data/models/internal/error';
import { MediaItemImportanceInternal, MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { OwnPlatformIconInternal } from 'app/data/models/internal/own-platform';
import { ImageRequireSource, Platform } from 'react-native';

/**
 * Centralized component to get images
 */
class ImagesHelper {

	/**
	 * Image getter
	 * @param mediaType a media type
	 * @returns the media type icon
	 */
	public mediaType(mediaType: MediaTypeInternal): ImageRequireSource {

		switch(mediaType) {

			case 'BOOK': {
				return require('app/resources/images/ic_media_book.png');
			}
			
			case 'MOVIE': {
				return require('app/resources/images/ic_media_movie.png');
			}
			
			case 'TV_SHOW': {
				return require('app/resources/images/ic_media_tvshow.png');
			}
			
			case 'VIDEOGAME': {
				return require('app/resources/images/ic_media_videogame.png');
			}
			
			default: {
				throw AppError.GENERIC.withDetails(`Media icon not mapped for media type ${mediaType}`);
			}
		}
	}

	/**
	 * Image getter
	 * @param importance the importance level
	 * @returns the media item importance icon
	 */
	public mediaItemImportance(importance: MediaItemImportanceInternal): ImageRequireSource {

		switch(importance) {

			case '400':
				return require('app/resources/images/ic_importance_1.png');
			
			case '300':
				return require('app/resources/images/ic_importance_2.png');

			case '200':
				return require('app/resources/images/ic_importance_3.png');

			case '100':
				return require('app/resources/images/ic_importance_4.png');
			
			default:
				throw AppError.GENERIC.withDetails(`Importance level ${importance} not mapped for icon`);
		}
	}

	/**
	 * Image getter
	 * @param mediaItem the media item
	 * @returns the media item status icon
	 */
	public mediaItemStatus(mediaItem: MediaItemInternal): ImageRequireSource {

		switch(mediaItem.status) {

			case 'ACTIVE':

				return this.activeIcon(mediaItem.mediaType);

			case 'UPCOMING':
			
				return require('app/resources/images/ic_status_upcoming.png');
			
			case 'REDO':

				return this.redoIcon();
			
			case 'COMPLETE':

				return this.completeIcon();

			case 'NEW':

				return this.mediaItemImportance(mediaItem.importance);
			
			default:
				
				throw AppError.GENERIC.withDetails(`Status ${mediaItem.status} not recognized for media item status icon`);
		}
	}

	/**
	 * Image getter
	 * @returns complete status icon
	 */
	public completeIcon(): ImageRequireSource {
		
		return require('app/resources/images/ic_status_complete.png');
	}

	/**
	 * Image getter
	 * @returns redo status icon
	 */
	public redoIcon(): ImageRequireSource {
		
		return require('app/resources/images/ic_status_redoing.png');
	}

	/**
	 * Image getter
	 * @param mediaType the media type
	 * @returns the active status icon
	 */
	public activeIcon(mediaType: MediaTypeInternal): ImageRequireSource {
		
		switch(mediaType) {
					
			case 'BOOK':
				return require('app/resources/images/ic_status_reading.png');

			case 'MOVIE':
			case 'TV_SHOW':
				return require('app/resources/images/ic_status_watching.png');

			case 'VIDEOGAME':
				return require('app/resources/images/ic_status_playing.png');

			default:
				throw AppError.GENERIC.withDetails(`Media type ${mediaType} not recognized for active status icon`);
		}
	}

	/**
	 * Image getter
	 * @returns a generic "null" image icon
	 */
	public none(): ImageRequireSource {
		
		return require('app/resources/images/ic_none.png');
	}

	/**
	 * Image getter
	 * @returns the save icon
	 */
	public saveButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_save.png');
	}

	/**
	 * Image getter
	 * @returns the delete icon
	 */
	public deleteButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_delete.png');
	}

	/**
	 * Image getter
	 * @returns the complete icon
	 */
	public completeButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_complete.png');
	}

	/**
	 * Image getter
	 * @returns the edit icon
	 */
	public editButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_edit.png');
	}

	/**
	 * Image getter
	 * @returns the add icon
	 */
	public addButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_add.png');
	}

	/**
	 * Image getter
	 * @returns the clear icon
	 */
	public clearButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_clear.png');
	}

	/**
	 * Image getter
	 * @returns the search icon
	 */
	public searchButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_search.png');
	}

	/**
	 * Image getter
	 * @returns the filter icon
	 */
	public filterButton(): ImageRequireSource {
		
		return require('app/resources/images/ic_action_filter.png');
	}

	/**
	 * Image getter
	 * @returns name input field icon
	 */
	public nameField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_name.png');
	}

	/**
	 * Image getter
	 * @returns description input field icon
	 */
	public descriptionField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_description.png');
	}

	/**
	 * Image getter
	 * @returns color input field icon
	 */
	public colorField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_color.png');
	}

	/**
	 * Image getter
	 * @returns status input field icon
	 */
	public statusField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_status.png');
	}

	/**
	 * Image getter
	 * @returns group input field icon
	 */
	public groupField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_group.png');
	}

	/**
	 * Image getter
	 * @returns own platform input field icon
	 */
	public ownPlatformField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_own_platform.png');
	}

	/**
	 * Image getter
	 * @returns sort by input field icon
	 */
	public sortField(): ImageRequireSource {
		
		return require('app/resources/images/ic_input_sort.png');
	}

	/**
	 * Image getter
	 * @returns release date field icon
	 */
	public releaseDateField(): ImageRequireSource {

		return require('app/resources/images/ic_input_release_date.png');
	}

	/**
	 * Image getter
	 * @returns duration field icon
	 */
	public durationField(): ImageRequireSource {

		return require('app/resources/images/ic_input_duration.png');
	}

	/**
	 * Image getter
	 * @returns notes field icon
	 */
	public userCommentField(): ImageRequireSource {

		return require('app/resources/images/ic_input_user_comment.png');
	}

	/**
	 * Image getter
	 * @returns genres field icon
	 */
	public genresField(): ImageRequireSource {

		return require('app/resources/images/ic_input_genre.png');
	}

	/**
	 * Image getter
	 * @returns menu button icon
	 */
	public menuButton(): ImageRequireSource {

		return require('app/resources/images/ic_action_more.png');
	}

	/**
	 * Image getter
	 * @returns show more button icon
	 */
	public more(): ImageRequireSource {

		return require('app/resources/images/ic_more.png');
	}

	/**
	 * Image getter
	 * @returns default media item image (details form)
	 */
	public defaultMediaItemImage(): ImageRequireSource {

		return require('app/resources/images/im_media_item_form_default.png');
	}

	/**
	 * Image getter
	 * @returns Google icon
	 */
	public googleIcon(): ImageRequireSource {

		return require('app/resources/images/ic_google.png');
	}

	/**
	 * Image getter
	 * @returns Wikipedia icon
	 */
	public wikipediaIcon(): ImageRequireSource {

		return require('app/resources/images/ic_wikipedia.png');
	}

	/**
	 * Image getter
	 * @returns Just Watch icon
	 */
	public justWatchIcon(): ImageRequireSource {

		return require('app/resources/images/ic_justwatch.png');
	}

	/**
	 * Image getter
	 * @returns How Long To Beat icon
	 */
	public howLongToBeatIcon(): ImageRequireSource {

		return require('app/resources/images/ic_howlongtobeat.png');
	}

	/**
	 * Image getter
	 * @returns download icon
	 */
	public downloadIcon(): ImageRequireSource {

		return require('app/resources/images/ic_download.png');
	}

	/**
	 * Image getter
	 * @returns creator field icon
	 */
	public creatorField(): ImageRequireSource {

		return require('app/resources/images/ic_input_creator.png');
	}

	/**
	 * Image getter
	 * @returns completion dates field icon
	 */
	public completedOnField(): ImageRequireSource {

		return require('app/resources/images/ic_input_complete_date.png');
	}

	/**
	 * Image getter
	 * @returns episodes field icon
	 */
	public episodesField(): ImageRequireSource {

		return require('app/resources/images/ic_input_episodes_number.png');
	}

	/**
	 * Image getter
	 * @returns seasons field icon
	 */
	public seasonsField(): ImageRequireSource {

		return require('app/resources/images/ic_input_season_number.png');
	}

	/**
	 * Image getter
	 * @returns production field icon
	 */
	public inProductionField(): ImageRequireSource {

		return require('app/resources/images/ic_input_in_production.png');
	}

	/**
	 * Image getter
	 * @returns next episode date field icon
	 */
	public nextEpisodeDateField(): ImageRequireSource {

		return require('app/resources/images/ic_input_next_episode.png');
	}

	/**
	 * Image getter
	 * @returns publishers field icon
	 */
	public publishersField(): ImageRequireSource {

		return require('app/resources/images/ic_input_publisher.png');
	}

	/**
	 * Image getter
	 * @returns platforms field icon
	 */
	public platformsField(): ImageRequireSource {

		return require('app/resources/images/ic_input_platform.png');
	}

	/**
	 * Image getter
	 * @param iconId the icon ID
	 * @returns a platform icon
	 */
	public ownPlatform(iconId: OwnPlatformIconInternal): ImageRequireSource {

		switch(iconId) {
				
			case 'android':
				return require('app/resources/images/ic_platform_android.png');
				
			case 'apple':
				return require('app/resources/images/ic_platform_apple.png');

			case 'book':
				return require('app/resources/images/ic_platform_book.png');

			case 'default':
				return require('app/resources/images/ic_input_own_platform.png');

			case 'disc':
				return require('app/resources/images/ic_platform_disc.png');

			case 'disney':
				return require('app/resources/images/ic_platform_disney.png');

			case 'download':
				return require('app/resources/images/ic_platform_download.png');
							
			case 'epic':
				return require('app/resources/images/ic_platform_epic.png');
				
			case 'gog':
				return require('app/resources/images/ic_platform_gog.png');
				
			case 'hulu':
				return require('app/resources/images/ic_platform_hulu.png');
				
			case 'kindle':
				return require('app/resources/images/ic_platform_kindle.png');

			case 'netflix':
				return require('app/resources/images/ic_platform_netflix.png');
						
			case 'origin':
				return require('app/resources/images/ic_platform_origin.png');
				
			case 'playstation':
				return require('app/resources/images/ic_platform_playstation.png');
				
			case 'steam':
				return require('app/resources/images/ic_platform_steam.png');
				
			case 'switch':
				return require('app/resources/images/ic_platform_switch.png');
				
			case 'uplay':
				return require('app/resources/images/ic_platform_uplay.png');
			
			default:
				throw AppError.GENERIC.withDetails(`Own platform icon ID ${iconId} is not mapped to an actual image`);
		}
	}

	/**
	 * Image getter
	 * @returns hamburger menu icon
	 */
	public menu(): ImageRequireSource {

		return require('app/resources/images/ic_menu.png');
	}

	/**
	 * Image getter
	 * @returns settings icon
	 */
	public settings(): ImageRequireSource {

		return require('app/resources/images/ic_settings.png');
	}

	/**
	 * Image getter
	 * @returns credits icon
	 */
	public credits(): ImageRequireSource {

		return require('app/resources/images/ic_credits.png');
	}

	/**
	 * Image getter
	 * @returns home icon
	 */
	public home(): ImageRequireSource {

		return require('app/resources/images/ic_home.png');
	}

	/**
	 * Image getter
	 * @returns app logo
	 */
	public appLogo(): ImageRequireSource {

		return require('app/resources/images/ic_app_logo.png');
	}

	/**
	 * Image getter
	 * @returns back icon
	 */
	public back(): ImageRequireSource {

		return Platform.OS === 'ios' ? require('app/resources/images/ic_action_back_ios.png') : require('app/resources/images/ic_action_back_android.png');
	}
}

/**
 * Centralized component to get images
 */
export const images = new ImagesHelper();
