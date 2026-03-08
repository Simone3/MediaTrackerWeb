/**
 * An application error that can be thrown or promise-rejected in the code and then handled with a negative user message
 */
export class AppError extends Error {

	public static GENERIC = new AppError('generic.application', 'error.flash.messages.genericApplication');
	public static BACKEND_TIMEOUT = new AppError('backend.timeout', 'error.flash.messages.backendTimeout');
	public static BACKEND_GENERIC_ERROR = new AppError('backend.generic', 'error.flash.messages.backendGeneric');
	public static BACKEND_PARSE = new AppError('backend.parse', 'error.flash.messages.backendParse');

	public static BACKEND_USER_CHECK_LOGIN_STATUS = new AppError('backend.user.checkLoginStatus', 'error.flash.messages.localCheckLoginStatus');
	public static BACKEND_USER_SIGNUP = new AppError('backend.user.signup', 'error.flash.messages.backendSignup');
	public static BACKEND_USER_LOGIN = new AppError('backend.user.login', 'error.flash.messages.backendLogin');
	public static BACKEND_USER_LOGOUT = new AppError('backend.user.logout', 'error.flash.messages.backendLogout');

	public static BACKEND_CATEGORY_FETCH = new AppError('backend.category.fetch', 'error.flash.messages.backendCategoryFetch');
	public static BACKEND_CATEGORY_SAVE = new AppError('backend.category.save', 'error.flash.messages.backendCategorySave');
	public static BACKEND_CATEGORY_DELETE = new AppError('backend.category.delete', 'error.flash.messages.backendCategoryDelete');
	
	public static BACKEND_MEDIA_ITEM_FETCH = new AppError('backend.mediaItem.fetch', 'error.flash.messages.backendMediaItemFetch');
	public static BACKEND_MEDIA_ITEM_SAVE = new AppError('backend.mediaItem.save', 'error.flash.messages.backendMediaItemSave');
	public static BACKEND_MEDIA_ITEM_DELETE = new AppError('backend.mediaItem.delete', 'error.flash.messages.backendMediaItemDelete');
	public static BACKEND_MEDIA_ITEM_CATALOG_SEARCH = new AppError('backend.mediaItem.catalogSearch', 'error.flash.messages.backendMediaItemCatalogSearch');
	public static BACKEND_MEDIA_ITEM_CATALOG_DETAILS = new AppError('backend.mediaItem.catalogDetails', 'error.flash.messages.backendMediaItemCatalogDetails');

	public static BACKEND_GROUP_FETCH = new AppError('backend.group.fetch', 'error.flash.messages.backendGroupFetch');
	public static BACKEND_GROUP_SAVE = new AppError('backend.group.save', 'error.flash.messages.backendGroupSave');
	public static BACKEND_GROUP_DELETE = new AppError('backend.group.delete', 'error.flash.messages.backendGroupDelete');

	public static BACKEND_OWN_PLATFORM_FETCH = new AppError('backend.ownPlatform.fetch', 'error.flash.messages.backendOwnPlatformFetch');
	public static BACKEND_OWN_PLATFORM_SAVE = new AppError('backend.ownPlatform.save', 'error.flash.messages.backendOwnPlatformSave');
	public static BACKEND_OWN_PLATFORM_DELETE = new AppError('backend.ownPlatform.delete', 'error.flash.messages.backendOwnPlatformDelete');

	public static BACKEND_IMPORT_OLD_APP = new AppError('backend.import.oldApp', 'error.flash.messages.backendOldAppImport');
	public static IMPORT_FILE = new AppError('import.fileNotValid', 'error.flash.messages.importFileNotValid');

	public static TV_SHOW_SEASON_SAME_NUMBER = new AppError('tvShowSeason.sameNumber', 'error.flash.messages.saveTvShowSeasonNumber');

	private _errorCode: string;
	private _errorDescription: string;
	private _errorDetails?: string | AppError;

	private constructor(errorCode: string, errorDescription: string, errorDetails?: string | AppError) {
		
		super(`${errorCode} - ${errorDescription} - ${errorDetails}`);

		this._errorCode = errorCode;
		this._errorDescription = errorDescription;
		this._errorDetails = errorDetails;
	}

	/**
	 * The error code
	 * @returns the error code
	 */
	public get errorCode(): string {

		return this._errorCode;
	}

	/**
	 * The error description
	 * @returns the error description
	 */
	public get errorDescription(): string {

		return this._errorDescription;
	}

	/**
	 * The optional error details
	 * @returns the optional error details
	 */
	public get errorDetails(): string | AppError | undefined {

		return this._errorDetails;
	}

	/**
	 * Adds details to an error constant
	 * @param errorDetails the error details
	 * @returns a new AppError with the given details
	 */
	public withDetails(errorDetails: unknown): AppError {

		let convertedErrorDetails: string | AppError;
		if(errorDetails) {

			if(errorDetails instanceof AppError) {

				convertedErrorDetails = errorDetails;
			}
			else {

				convertedErrorDetails = String(errorDetails);
			}
		}
		else {

			convertedErrorDetails = '';
		}

		return new AppError(this.errorCode, this.errorDescription, convertedErrorDetails);
	}
}
