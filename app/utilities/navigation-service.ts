import { Navigation } from 'app/components/containers/navigation/global';
import { AppError } from 'app/data/models/internal/error';
import { screenToPath } from 'app/utilities/navigation-routes';

/**
 * Global class that can be used anywhere to navigate to a different app screen
 */
class NavigationService {
	private navigator?: Navigation;

	/**
	 * To be used ONLY by the top-level navigation component to save the navigator reference
	 * @param navigator the navigator reference
	 */
	public initialize(navigator: Navigation): void {
		this.navigator = navigator;
	}

	/**
	 * Navigates to the given screen
	 * @param routeName the screen name
	 */
	public navigate(routeName: string): void {
		if(!this.navigator) {
			throw AppError.GENERIC.withDetails('Navigation service was not initialized');
		}

		this.navigator.navigate(screenToPath(routeName));
	}

	/**
	 * Navigates back the stack
	 */
	public back(): void {
		if(!this.navigator) {
			throw AppError.GENERIC.withDetails('Navigation service was not initialized');
		}

		this.navigator.back();
	}

	/**
	 * Sets a navigation param
	 * @param route the route where to set the param
	 * @param key the param key
	 * @param value the param value
	 */
	public setParam(route: string, key: string, value: unknown): void {
		console.debug('navigationService.setParam is not implemented on web yet', route, key, value);

		// Phase2 note: replace with URL search params management where needed.
	}
}

/**
 * Singleton implementation of the navigation service
 */
export const navigationService = new NavigationService();
